import os

import dotenv

from app import app, db

dotenv.load_dotenv()


def run_flask_app():
    with app.app_context():
        db.create_all()
    app.run(host=os.environ["HOST"], port=int(os.environ["PORT"]))


if __name__ == '__main__':
    run_flask_app()
