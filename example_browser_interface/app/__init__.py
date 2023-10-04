from flask import Flask

template_dir = '../templates/'
static_dir = '../static/'
static_url = '/static'
app = Flask(__name__, template_folder=template_dir, static_folder=static_dir, static_url_path=static_url)

from app import routes
