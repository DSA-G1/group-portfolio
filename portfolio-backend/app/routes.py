from flask import Blueprint, jsonify, request
from app import db
from app.models import Project, QueueOperation, DequeOperation

main = Blueprint('main', __name__)

# Helper functions
def get_or_create(model, **kwargs):
    instance = model.query.first()
    if not instance:
        instance = model(**kwargs)
        db.session.add(instance)
        db.session.commit()
    return instance

def validate_value(data):
    if 'value' not in data:
        return jsonify({'error': 'Value is required'}), 400
    return None

def handle_empty(data, error_msg):
    if not data:
        return jsonify({'error': error_msg}), 400
    return None

@main.route('/')
def index():
    return jsonify({'message': 'Welcome to Portfolio API'})

# Project routes
@main.route('/projects', methods=['GET'])
def get_projects():
    return jsonify([p.to_dict() for p in Project.query.all()])

@main.route('/projects/<int:id>', methods=['GET'])
def get_project(id):
    return jsonify(Project.query.get_or_404(id).to_dict())

@main.route('/projects', methods=['POST'])
def create_project():
    data = request.get_json()
    p = Project(title=data['title'], description=data['description'], github_url=data.get('github_url'))
    db.session.add(p)
    db.session.commit()
    return jsonify(p.to_dict()), 201

@main.route('/projects/<int:id>', methods=['PUT'])
def update_project(id):
    p = Project.query.get_or_404(id)
    data = request.get_json()
    p.title = data.get('title', p.title)
    p.description = data.get('description', p.description)
    p.github_url = data.get('github_url', p.github_url)
    db.session.commit()
    return jsonify(p.to_dict())

@main.route('/projects/<int:id>', methods=['DELETE'])
def delete_project(id):
    p = Project.query.get_or_404(id)
    db.session.delete(p)
    db.session.commit()
    return jsonify({'message': 'Project deleted successfully'})

# Queue routes
@main.route('/queue', methods=['GET'])
def get_queue():
    return jsonify(get_or_create(QueueOperation, queue_data=[]).to_dict())

@main.route('/queue/enqueue', methods=['POST'])
def enqueue():
    data = request.get_json() or {}
    if err := validate_value(data): return err
    q = get_or_create(QueueOperation, queue_data=[])
    q.queue_data.append(data['value'])
    db.session.commit()
    return jsonify(q.to_dict())

@main.route('/queue/dequeue', methods=['POST'])
def dequeue():
    q = get_or_create(QueueOperation, queue_data=[])
    if err := handle_empty(q.queue_data, 'Queue is empty'): return err
    removed = q.queue_data.pop(0)
    db.session.commit()
    return jsonify({'removed': removed, 'queue': q.to_dict()})

# Deque routes
@main.route('/deque', methods=['GET'])
def get_deque():
    return jsonify(get_or_create(DequeOperation, deque_data=[]).to_dict())

@main.route('/deque/enqueue', methods=['POST'])
def deque_enqueue():
    data = request.get_json() or {}
    if err := validate_value(data): return err
    d = get_or_create(DequeOperation, deque_data=[])
    d.deque_data.append(data['value'])
    db.session.commit()
    return jsonify(d.to_dict())

@main.route('/deque/dequeue', methods=['POST'])
def deque_dequeue():
    d = get_or_create(DequeOperation, deque_data=[])
    if err := handle_empty(d.deque_data, 'Deque is empty'): return err
    removed = d.deque_data.pop(0)
    db.session.commit()
    return jsonify({'removed': removed, 'deque': d.to_dict()})

@main.route('/deque/enqueue-head', methods=['POST'])
def deque_enqueue_head():
    data = request.get_json() or {}
    if err := validate_value(data): return err
    d = get_or_create(DequeOperation, deque_data=[])
    d.deque_data.insert(0, data['value'])
    db.session.commit()
    return jsonify(d.to_dict())

@main.route('/deque/dequeue-tail', methods=['POST'])
def deque_dequeue_tail():
    d = get_or_create(DequeOperation, deque_data=[])
    if err := handle_empty(d.deque_data, 'Deque is empty'): return err
    removed = d.deque_data.pop()
    db.session.commit()
    return jsonify({'removed': removed, 'deque': d.to_dict()})