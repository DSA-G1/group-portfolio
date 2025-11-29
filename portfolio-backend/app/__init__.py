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
    # This ensures Flask-Migrate knows about all tables
    with app.app_context():
        from app import models
        from app.binary_tree import models as binary_models
        print("✅ Main models imported")
        print("✅ Binary tree models imported")
    
    migrate.init_app(app, db)
    
    # Configure CORS properly
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:8080", "http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type"],
            "supports_credentials": True
        }
    })
    
    try:
        from app.routes import main
        print("✅ Main routes imported")
        
        from app.binary_tree import binary_tree_bp
        print("✅ Binary tree blueprint imported")
        
        # Register blueprints with full paths
        app.register_blueprint(main, url_prefix='/api')
        app.register_blueprint(binary_tree_bp, url_prefix='/api/binary-tree')
        print("✅ Blueprints registered")
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
    
    # Print all registered routes
    with app.app_context():
        print("\n=== Registered Routes ===")
        for rule in app.url_map.iter_rules():
            print(f"{rule.endpoint}: {rule.methods} {rule.rule}")
        print("========================\n")
    
    return app
