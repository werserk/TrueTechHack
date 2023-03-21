import os
import uuid

from config import Config


def allowed_video(file):
    return "." in file and file.rsplit(".", 1)[1].lower() in Config.ALLOWED_VIDEO_EXTENSIONS


def process_video(file):
    if file and allowed_video(file.filename):
        filename = str(uuid.uuid4()) + '.' + str(file.filename).split('.')[-1]
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        return filepath
    return None
