from flask import Flask
from flask_cors import CORS
import os
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
cors = CORS(app, resources={r"/quiz/api/v1.0/*": {"origins": "*"}})

def mkpath(p):
    return os.path.normpath(
        os.path.join(
            os.path.dirname(__file__), p))

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + mkpath('../quiz.db')
app.config['SQLALCHEMY_ECHO'] = True
db = SQLAlchemy(app)
