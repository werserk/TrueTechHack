from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

from extensions import db


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    videos = db.relationship('Video', backref='user', lazy=True)
    settings = db.relationship('UserSettings', backref='user', lazy=True, uselist=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class UserSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brightness = db.Column(db.Float, nullable=False, default=1.0)
    contrast = db.Column(db.Float, nullable=False, default=1.0)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)


class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    video_filename = db.Column(db.String(255), nullable=False)
    preview_filename = db.Column(db.String(255), nullable=False)
    blur_timeline_filename = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    video_settings = db.relationship('VideoSettings', backref='video', lazy=True, uselist=False)


class VideoSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brightness = db.Column(db.Float, nullable=True)
    contrast = db.Column(db.Float, nullable=True)
    video_id = db.Column(db.Integer, db.ForeignKey("video.id"), nullable=False)
