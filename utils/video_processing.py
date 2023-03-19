import os

from werkzeug.utils import secure_filename

from config import Config


def allowed_video(file):
    return "." in file and file.rsplit(".", 1)[1].lower() in Config.ALLOWED_VIDEO_EXTENSIONS


def process_video(file):
    if file and allowed_video(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        return filepath
    return None
