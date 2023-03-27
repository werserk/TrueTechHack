import clip
import numpy as np
from clip_onnx import clip_onnx
from typing import Optional
from video_cutting import split_video

# onnx cannot work with cuda
model, preprocess = clip.load("ViT-B/32", device="cpu", jit=False)

# batch first
visual_path = "clip_visual.onnx"
textual_path = "clip_textual.onnx"

onnx_model = clip_onnx(model, visual_path=visual_path, textual_path=textual_path)
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

    @staticmethod
    def encode_text(promts: list):
        assert len(promts) == 2
        text = clip.tokenize(promts)
        text_onnx = text.detach().cpu().numpy().astype(np.int32)
        return text_onnx

    def __call__(self, video_path: str, specific_promts: Optional[list] = None, batch_size: int = 128):
        return self.predict(video_path, specific_promts, batch_size)

    def predict(self, video_path: str, specific_promts: Optional[list] = None, batch_size: int = 128):
        bit_line = []
        for batch in split_video(video_path, batch_size=batch_size):
            _bit_line = self._predict(batch, specific_promts)
            bit_line += _bit_line
        return bit_line

    def _predict(self, images: list, specific_promts: Optional[list] = None):
        image_onnx = np.array([preprocess(image).detach().cpu().numpy().astype(np.float32) for image in images])

        if specific_promts is not None:
            text_onnx = Model.encode_text(specific_promts)
        else:
            text_onnx = self.promts

        logits_per_image, logits_per_text = onnx_model(image_onnx, text_onnx)
        probs = logits_per_image.softmax(dim=-1).detach().cpu().numpy()
        return probs.argmax(-1)


clip_model = Model(onnx_model)

if __name__ == '__main__':
    bit_line = clip_model(
        video_path='../static/user_data/video/5e739b4d-3f1d-45ed-a8ca-c224ff3c9b28.mp4',
        batch_size=128
    )
    print(bit_line)
