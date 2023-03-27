import os
import subprocess
import uuid

import imageio
import pandas as pd

from config import Config
from production_model import prod_model


def allowed_video(file):
    return "." in file and file.rsplit(".", 1)[1].lower() in Config.ALLOWED_VIDEO_EXTENSIONS


def secure_filename(name):
    return str(uuid.uuid4())


def transform2df(array: list) -> pd.DataFrame:
    # Convert the list to a pandas DataFrame
    df = pd.DataFrame({'data': array})
    return df


def save2parquet(array: list, filename: str):
    df = transform2df(array)
    # Save the DataFrame as a Parquet file
    df.to_parquet(filename)


def save2feather(array: list, filename: str):
    df = transform2df(array)
    # Save the DataFrame as a Feather file
    df.to_feather(filename)


def convert_to_mp4(input_path, output_path):
    cmd = ['ffmpeg', '-i', input_path, '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart',
           output_path]
    subprocess.run(cmd)


def process_video(video):
    filename = video.filename.lower()
    path = Config.VIDEO_UPLOAD_FOLDER + '/' + secure_filename(filename) + '.' + filename.split('.')[-1].lower()
    video.save(path)

    # if not path.endswith('.mp4'):         # TODO: Convert the video to mp4
    #     output_path = os.path.join(Config.VIDEO_UPLOAD_FOLDER, secure_filename(filename) + '.mp4')
    #
    #     path = os.path.abspath(path)
    #     output_path = os.path.abspath(output_path)
    #
    #     convert_to_mp4(path, output_path)
    #     os.remove(path)  # Remove the original video file
    #
    #     path = output_path

    bit_line = prod_model(video_path=path,
                          batch_size=256)
    blur_timeline_path = os.path.join(Config.BLUR_TIMELINE_FOLDER, secure_filename(filename) + '.feather')
    save2feather(bit_line,
                 filename=blur_timeline_path)

    # Save a frame for preview
    preview_path = os.path.join(Config.PREVIEW_UPLOAD_FOLDER, secure_filename(filename) + '.jpg')
    reader = imageio.get_reader(path)
    preview_frame = reader.get_data(0)
    imageio.imwrite(preview_path, preview_frame)

    return {"video_path": path,
            "preview_path": preview_path,
            "blur_timeline_path": blur_timeline_path}
