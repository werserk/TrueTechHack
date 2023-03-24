import os


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///site.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = 'static/uploads/'
    MAX_VIDEO_LENGTH_SECONDS = 5 * 60
    ALLOWED_VIDEO_EXTENSIONS = ["mp4", "avi", "wmv", "mov", "mkv"]
    # Add other configuration settings as needed, e.g., storage provider API keys
