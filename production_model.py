import time
from typing import Optional

import clip
import numpy as np
from clip_onnx import clip_onnx

from child_filter.video_cutting import split_video
from epilepsy_filter_model import detect_fast_movement

model, preprocess = clip.load("ViT-B/32", device="cuda", jit=True)

visual_path = "child_filter/weights/clip_visual.onnx"
textual_path = "child_filter/weights/clip_textual.onnx"

onnx_model = clip_onnx(model)
onnx_model.load_onnx(visual_path=visual_path,
                     textual_path=textual_path,
                     logit_scale=100.0000)
onnx_model.start_sessions(providers=["CUDAExecutionProvider"])

basic_promts = [
    "Is this children's content? Using visual cues and contextual information, can this video be classified as child-friendly content according to established standards?",
    "Isn't this children's content? Is there any content in this video that depicts violence, sexuality, drug use, profanity, horror, or mysticism, which is not suitable for children?",
]


class Model:
    def __init__(self, onnx_model, promts=None):
        if promts is None:
            promts = basic_promts
        self.onnx_model = onnx_model
        self.promts = self.encode_text(promts)
        self.is_clip_active = True
        self.is_epilepsy_active = True

    @staticmethod
    def encode_text(promts: list):
        assert len(promts) == 2
        text = clip.tokenize(promts)
        text_onnx = text.detach().cpu().numpy().astype(np.int32)
        return text_onnx

    @staticmethod
    def replace_zeros(lst, zero_count=3):
        count = 0
        for i in range(len(lst)):
            if lst[i] == 1:
                if count <= zero_count:
                    lst[i - count:i] = [1] * count
                count = 0
            else:
                count += 1
        return lst

    @staticmethod
    def predict_epilepsy(batch):
        results = []
        batch_iter = iter(batch)
        prev_frame = np.array(next(batch_iter))
        for frame in batch_iter:
            frame = np.array(frame)  # fixme
            should_skip = detect_fast_movement(prev_frame, frame)
            results.append(int(should_skip))
            prev_frame = frame
        results.append(0)
        return results

    def __call__(self, video_path: str, specific_promts: Optional[list] = None, batch_size: int = 128):
        return self.predict(video_path, specific_promts, batch_size)

    def predict(self, video_path: str, specific_promts: Optional[list] = None, batch_size: int = 128):
        bit_lines = {}
        if self.is_epilepsy_active:
            bit_lines["epilepsy"] = []
        if self.is_clip_active:
            bit_lines["clip"] = []
        for batch in split_video(video_path, batch_size=batch_size):
            if self.is_epilepsy_active:
                bit_lines["epilepsy"].extend(Model.predict_epilepsy(batch))
            if self.is_clip_active:
                bit_lines["clip"].extend(self.predict_clip(batch, specific_promts))
        if self.is_epilepsy_active:
            bit_lines["epilepsy"] = Model.replace_zeros(bit_lines["epilepsy"], zero_count=3)
        return bit_lines

    def predict_clip(self, images: list, specific_promts: Optional[list] = None):
        image_onnx = np.array([preprocess(image).detach().cpu().numpy().astype(np.float32) for image in images])

        if specific_promts is not None:
            text_onnx = Model.encode_text(specific_promts)
        else:
            text_onnx = self.promts

        logits_per_image, logits_per_text = onnx_model(image_onnx, text_onnx)
        probs = logits_per_image.softmax(dim=-1).detach().cpu().numpy()
        return probs.argmax(-1)


prod_model = Model(onnx_model)


def main():
    t = time.time()
    bit_line = prod_model(
        video_path='../static/user_data/video/a55ad454-1daa-493a-9a50-f0f7295c8468.mov',
        batch_size=1024
    )
    print(bit_line)
    print(time.time() - t)

    t = time.time()
    bit_line = prod_model(
        video_path='../static/user_data/video/5e739b4d-3f1d-45ed-a8ca-c224ff3c9b28.mp4',
        batch_size=1024
    )
    print(bit_line)
    print(time.time() - t)


if __name__ == '__main__':
    main()
