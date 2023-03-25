import os
import uuid
import imageio
import ffmpeg
from config import Config
import subprocess


def allowed_video(file):
    return "." in file and file.rsplit(".", 1)[1].lower() in Config.ALLOWED_VIDEO_EXTENSIONS


def secure_filename(name):
    return str(uuid.uuid4())


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

    preview_path = os.path.join(Config.PREVIEW_UPLOAD_FOLDER, secure_filename(filename) + '.jpg')
    # Save a frame for preview

    reader = imageio.get_reader(path)
    preview_frame = reader.get_data(0)
    imageio.imwrite(preview_path, preview_frame)

    return path, preview_path
