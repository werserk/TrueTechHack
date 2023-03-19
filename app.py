import os.path

from flask import abort, flash, Flask, redirect, render_template, url_for
from flask_login import current_user, login_required, login_user, LoginManager, logout_user
from werkzeug.security import check_password_hash

from config import Config
from extensions import db
from forms import LoginForm, RegistrationForm, UploadForm
from models import User, Video
from utils.video_processing import process_video

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route("/")
def base():
    return render_template("base.html")


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
    if current_user.is_authenticated:
        return redirect(url_for('upload'))
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
    form = UploadForm()
    if form.validate_on_submit():
        video = form.video.data
        processed_video_path = process_video(video)
        print(processed_video_path)
        video.save(processed_video_path)

        video_entry = Video(filename=os.path.basename(processed_video_path), user_id=current_user.id)
        db.session.add(video_entry)
        db.session.commit()

        flash('Video uploaded and processed successfully!', 'success')
        return redirect(url_for('player', video_id=video_entry.id))

    return render_template('upload.html', form=form)


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
    os.remove(os.path.join(app.config['UPLOAD_FOLDER'], video.filename))
    flash('Your video has been deleted.', 'success')
    return redirect(url_for('library'))


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('base'))


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
