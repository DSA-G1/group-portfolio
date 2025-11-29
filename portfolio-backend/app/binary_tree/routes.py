from flask import Blueprint, jsonify, request
from app import db
from app.binary_tree.models import BinaryTreeOperation
from app.binary_tree.utils import (
    find_node_by_value, 
    find_node_by_id, 
    remove_node_by_id, 
    compute_postorder
)
import copy

binary_tree_bp = Blueprint('binary_tree', __name__)


def get_or_create():
    """Get or create a binary tree operation instance"""
    instance = BinaryTreeOperation.query.first()
    if not instance:
        instance = BinaryTreeOperation(tree_data=None, next_id=1)
        db.session.add(instance)
        db.session.commit()
    return instance


@binary_tree_bp.route('', methods=['GET'])
def get_binary_tree():
    """Get the current binary tree state"""
    bt = get_or_create()
    return jsonify(bt.to_dict())


@binary_tree_bp.route('/create-root', methods=['POST'])
def create_root():
    """Create a new root node (clears existing tree)"""
    data = request.get_json()
    value = data.get('value')
    if value is None:
        return jsonify({'error': 'value is required'}), 400
    
    bt = get_or_create()
    bt.tree_data = {
        'id': bt.next_id,
        'value': value,
        'left': None,
        'right': None
    }
    bt.next_id += 1
    db.session.commit()
    
    return jsonify(bt.to_dict())


@binary_tree_bp.route('/search', methods=['POST'])
def search_node():
    """Search for a node by value and return its ID"""
    data = request.get_json()
    value = data.get('value')
    if value is None:
        return jsonify({'error': 'value is required'}), 400
    
    bt = get_or_create()
    if not bt.tree_data:
        return jsonify({'error': 'Tree is empty'}), 404
    
    node = find_node_by_value(bt.tree_data, value)
    if not node:
        return jsonify({'error': 'Node not found'}), 404
    
    return jsonify({'node_id': node['id'], 'value': node['value']})


@binary_tree_bp.route('/insert', methods=['POST'])
def insert_node():
    """Insert a new node as left or right child of a parent"""
    data = request.get_json()
    parent_id = data.get('parent_id')
    value = data.get('value')
    direction = data.get('direction')
    
    if parent_id is None or value is None or direction not in ['left', 'right']:
        return jsonify({'error': 'parent_id, value, and direction (left/right) required'}), 400
    
    bt = get_or_create()
    if not bt.tree_data:
        return jsonify({'error': 'Tree is empty, create root first'}), 400
    
    # CRITICAL: Deep copy the tree to ensure proper mutation tracking
    tree_copy = copy.deepcopy(bt.tree_data)
    
    parent = find_node_by_id(tree_copy, parent_id)
    if not parent:
        return jsonify({'error': 'Parent node not found'}), 404
    
    # Check if child already exists
    if direction == 'left' and parent.get('left'):
        return jsonify({'error': 'Left child already exists'}), 400
    if direction == 'right' and parent.get('right'):
        return jsonify({'error': 'Right child already exists'}), 400
    
    new_node = {
        'id': bt.next_id,
        'value': value,
        'left': None,
        'right': None
    }
    
    parent[direction] = new_node
    bt.next_id += 1
    
    # Assign the modified copy back
    bt.tree_data = tree_copy
    
    # Force SQLAlchemy to detect the change
    db.session.merge(bt)
    db.session.commit()
    
    print(f"✅ Inserted node {value} as {direction} child of parent {parent_id}")
    print(f"✅ Updated tree: {bt.tree_data}")
    
    return jsonify(bt.to_dict())


@binary_tree_bp.route('/delete', methods=['POST'])
def delete_node():
    """Delete a node and all its descendants"""
    data = request.get_json()
    node_id = data.get('node_id')
    if node_id is None:
        return jsonify({'error': 'node_id is required'}), 400
    
    bt = get_or_create()
    if not bt.tree_data:
        return jsonify({'error': 'Tree is empty'}), 404
    
    # Can't delete root
    if bt.tree_data['id'] == node_id:
        bt.tree_data = None
        bt.next_id = 1
        db.session.commit()
        return jsonify(bt.to_dict())
    
    # CRITICAL: Deep copy before modification
    tree_copy = copy.deepcopy(bt.tree_data)
    
    if not remove_node_by_id(tree_copy, node_id):
        return jsonify({'error': 'Node not found'}), 404
    
    bt.tree_data = tree_copy
    db.session.merge(bt)
    db.session.commit()
    
    return jsonify(bt.to_dict())


@binary_tree_bp.route('/clear', methods=['POST'])
def clear_tree():
    """Clear the entire tree"""
    bt = get_or_create()
    bt.tree_data = None
    bt.next_id = 1
    db.session.commit()
    return jsonify(bt.to_dict())


@binary_tree_bp.route('/postorder', methods=['GET'])
def get_postorder():
    """Get post-order traversal of the tree"""
    bt = get_or_create()
    if not bt.tree_data:
        return jsonify({'postorder': []})
    
    result = []
    compute_postorder(bt.tree_data, result)
    return jsonify({'postorder': result})