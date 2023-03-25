import os


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///site.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    VIDEO_UPLOAD_FOLDER = 'static/user_data/video'
    PREVIEW_UPLOAD_FOLDER = 'static/user_data/preview'
    MAX_VIDEO_LENGTH_SECONDS = 5 * 60
    ALLOWED_VIDEO_EXTENSIONS = ["mp4", "avi", "wmv", "mov", "mkv"]
    # Add other configuration settings as needed, e.g., storage provider API keys
