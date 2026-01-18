from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    db.init_app(app)
    
    # CRITICAL: Import ALL models BEFORE migrate.init_app()
    with app.app_context():
        from app import models
        from app.binary_tree import models as binary_models
        from app.binary_search_tree import models as bst_models
        from app.bfs import models as bfs_models
        from app.sorting_algorithms import models as sorting_models
        print("Main models imported")
        print("Binary tree models imported")
        print("Binary search tree models imported")
        print("BFS models imported")
        print("Sorting algorithms models imported")
    
    migrate.init_app(app, db)
    
    # Configure CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://localhost:8080", "http://localhost:8081"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type"],
        }
    })
    
    # Register blueprints
    from app.routes import main
    from app.binary_tree import binary_tree_bp
    from app.binary_search_tree.routes import bst_bp
    from app.bfs import bfs_bp
    from app.sorting_algorithms.routes import sorting_bp
    
    app.register_blueprint(main, url_prefix='/api')
    app.register_blueprint(binary_tree_bp, url_prefix='/api/binary-tree')
    app.register_blueprint(bst_bp, url_prefix='/api/binary-search-tree')
    app.register_blueprint(bfs_bp, url_prefix='/api/bfs')
    app.register_blueprint(sorting_bp, url_prefix='/api/sorting-algorithms')
    
    print("Blueprints registered")
    
    # Print registered routes
    with app.app_context():
        print("\n=== Registered Routes ===")
        for rule in app.url_map.iter_rules():
            print(f"{rule.endpoint}: {rule.methods} {rule.rule}")
        print("========================\n")
    
    return app
