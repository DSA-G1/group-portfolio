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
        from app.binary_search_tree import models as bst_models
        print("✅ Main models imported")
        print("✅ Binary tree models imported")
        print("✅ Binary search tree models imported")
    
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

        from app.binary_search_tree.routes import bst_bp
        print("✅ Binary search tree blueprint imported")

        
        # Register blueprints with full paths
        app.register_blueprint(main, url_prefix='/api')
        app.register_blueprint(binary_tree_bp, url_prefix='/api/binary-tree')
        app.register_blueprint(bst_bp, url_prefix="/api/binary-search-tree")
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

    # In development, ensure tables exist so endpoints can be used without running migrations.
    # This is a convenience for local dev; for production prefer Alembic migrations.
    with app.app_context():
        try:
            db.create_all()
            print("✅ Ensured database tables exist (db.create_all())")
        except Exception as e:
            print(f"⚠️ Could not run db.create_all(): {e}")
    
    return app
