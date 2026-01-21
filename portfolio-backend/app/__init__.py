from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
import os

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from app.routes import main
    from app.binary_tree.routes import binary_tree_bp
    from app.binary_search_tree.routes import bst_bp
    from app.bfs.routes import bfs_bp

    app.register_blueprint(main, url_prefix='/api')
    app.register_blueprint(binary_tree_bp, url_prefix='/api/binary-tree')
    app.register_blueprint(bst_bp, url_prefix='/api/binary-search-tree')
    app.register_blueprint(bfs_bp, url_prefix='/api/bfs')

    # CORS configuration - Read from environment variable
    cors_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:5173,http://localhost:8080').split(',')
    
    CORS(app, resources={
        r"/api/*": {
            "origins": cors_origins
        }
    })

    return app
