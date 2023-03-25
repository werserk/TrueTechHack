import os.path

from flask import abort, flash, Flask, redirect, render_template, request, url_for
from flask_login import current_user, login_required, login_user, LoginManager, logout_user
from werkzeug.security import check_password_hash

from config import Config
from extensions import db
from forms import LoginForm, RegistrationForm, UploadForm
from models import User, Video
from video_processing import process_video

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
with app.app_context():
    db.create_all()

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash("Account created successfully!", "success")
        return redirect(url_for("login"))
    return render_template("register.html", form=form)


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and check_password_hash(user.password_hash, form.password.data):
            login_user(user)
            flash('You have successfully logged in.', 'success')
            return redirect(url_for('upload'))
        else:
            flash('Login unsuccessful. Please check your username and password.', 'danger')
    return render_template('login.html', title='Login', form=form)


@app.route('/upload', methods=['GET', 'POST'])
@login_required
def upload():
    form = UploadForm(request.form)
    if request.method == 'POST' and request.form.get('submit_button') == 'Upload':
        video = request.files['video']
        processed_video_path, preview_path = process_video(video)  # Modify this line
        video_entry = Video(name=video.filename,
                            video_filename=os.path.basename(processed_video_path),
                            preview_filename=os.path.basename(preview_path),  # Add this line
                            user_id=current_user.id)
        db.session.add(video_entry)
        db.session.commit()

        flash('Video uploaded and processed successfully!', 'success')
        return redirect(url_for('player', video_id=video_entry.id))

    return render_template('upload.html', form=form)


@app.route('/edit_video_name/<int:video_id>', methods=['POST'])
def edit_video_name(video_id):
    new_video_name = request.form.get('new_video_name')
    video = Video.query.get_or_404(video_id)
    video.name = new_video_name
    db.session.commit()
    flash("Name changed successfully!", "success")
    return redirect(url_for('player', video_id=video.id))


@app.route('/library', methods=['GET'])
@login_required
def library():
    videos = Video.query.filter_by(user_id=current_user.id).all()
    return render_template('library.html', title='My Videos', videos=videos)


@app.route("/video/<int:video_id>")
@login_required
def player(video_id):
    video = Video.query.get_or_404(video_id)
    return render_template("player.html", video=video)


@app.route('/delete_video/<int:video_id>', methods=['POST'])
@login_required
def delete_video(video_id):
    video = Video.query.get_or_404(video_id)
    if video.user_id != current_user.id:
        abort(403)
    db.session.delete(video)
    db.session.commit()
    os.remove(os.path.join(Config.VIDEO_UPLOAD_FOLDER, video.video_filename))
    os.remove(os.path.join(Config.PREVIEW_UPLOAD_FOLDER, video.preview_filename))
    flash('Your video has been deleted.', 'success')
    return redirect(url_for('library'))


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have successfully logged out.', 'success')
    return redirect(url_for('home'))


if __name__ == "__main__":
    app.run(debug=True)
