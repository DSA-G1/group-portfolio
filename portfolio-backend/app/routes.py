from flask import Blueprint, jsonify, request
from app import db
from app.models import Project

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return jsonify({
        'message': 'Welcome to Portfolio API',
        'endpoints': {
            'GET /api/projects': 'Get all projects',
            'POST /api/projects': 'Create a project',
            'GET /api/projects/<id>': 'Get a specific project',
            'PUT /api/projects/<id>': 'Update a project',
            'DELETE /api/projects/<id>': 'Delete a project'
        }
    })

@main.route('/api/projects', methods=['GET'])
def get_projects():
    projects = Project.query.all()
    return jsonify([project.to_dict() for project in projects])

@main.route('/api/projects/<int:id>', methods=['GET'])
def get_project(id):
    project = Project.query.get_or_404(id)
    return jsonify(project.to_dict())

@main.route('/api/projects', methods=['POST'])
def create_project():
    data = request.get_json()
    
    new_project = Project(
        title=data['title'],
        description=data['description'],
        github_url=data.get('github_url')
    )
    
    db.session.add(new_project)
    db.session.commit()
    
    return jsonify(new_project.to_dict()), 201

@main.route('/api/projects/<int:id>', methods=['PUT'])
def update_project(id):
    project = Project.query.get_or_404(id)
    data = request.get_json()
    
    project.title = data.get('title', project.title)
    project.description = data.get('description', project.description)
    project.github_url = data.get('github_url', project.github_url)
    
    db.session.commit()
    
    return jsonify(project.to_dict())

@main.route('/api/projects/<int:id>', methods=['DELETE'])
def delete_project(id):
    project = Project.query.get_or_404(id)
    db.session.delete(project)
    db.session.commit()
    
    return jsonify({'message': 'Project deleted successfully'}), 200