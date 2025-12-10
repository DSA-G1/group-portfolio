from flask import Blueprint, jsonify, request
from app import db
from app.binary_search_tree.models import BinarySearchTreeOperation
from app.binary_search_tree.utils import (
    find_node_by_value,
    find_node_by_id,
    insert_bst_node,
    delete_bst_node,
    compute_height,
    find_max
)
import copy

bst_bp = Blueprint("binary_search_tree", __name__)

def get_or_create():
    instance = BinarySearchTreeOperation.query.first()
    if not instance:
        instance = BinarySearchTreeOperation(tree_data=None, next_id=1)
        db.session.add(instance)
        db.session.commit()
    return instance

@bst_bp.route("", methods=["GET"])
def get_tree():
    bt = get_or_create()
    return jsonify(bt.to_dict())

@bst_bp.route("/create-root", methods=["POST"])
def create_root():
    data = request.get_json()
    value = data.get("value")

    if value is None:
        return jsonify({"error": "value is required"}), 400

    try:
        value = float(value)
    except (ValueError, TypeError):
        return jsonify({"error": "value must be a number"}), 400

    bt = get_or_create()

    if bt.tree_data:
        return jsonify({"error": "Root already exists. Clear tree first."}), 400

    bt.tree_data = {
        "id": bt.next_id,
        "value": value,
        "left": None,
        "right": None
    }
    bt.next_id += 1
    db.session.commit()

    return jsonify(bt.to_dict())

@bst_bp.route("/search", methods=["POST"])
def search_node():
    data = request.get_json()
    value = data.get("value")

    if value is None:
        return jsonify({"error": "value is required"}), 400

    try:
        value = float(value)
    except (ValueError, TypeError):
        return jsonify({"error": "value must be a number"}), 400

    bt = get_or_create()

    if not bt.tree_data:
        return jsonify({"error": "Tree is empty"}), 404

    node = find_node_by_value(bt.tree_data, value)

    if not node:
        return jsonify({"error": "Node not found"}), 404

    return jsonify({"node_id": node["id"], "value": node["value"]})

@bst_bp.route("/insert", methods=["POST"])
def insert_node():
    data = request.get_json()
    value = data.get("value")

    if value is None:
        return jsonify({"error": "value is required"}), 400

    try:
        value = float(value)
    except (ValueError, TypeError):
        return jsonify({"error": "value must be a number"}), 400

    bt = get_or_create()

    if not bt.tree_data:
        bt.tree_data = {
            "id": bt.next_id,
            "value": value,
            "left": None,
            "right": None
        }
        bt.next_id += 1
        db.session.commit()
        return jsonify(bt.to_dict())

    tree_copy = copy.deepcopy(bt.tree_data)

    updated_tree, new_next_id, success = insert_bst_node(tree_copy, value, bt.next_id)

    if not success:
        return jsonify({"error": "Duplicate value. BST cannot contain duplicate values."}), 400

    bt.tree_data = updated_tree
    bt.next_id = new_next_id

    db.session.merge(bt)
    db.session.commit()

    return jsonify(bt.to_dict())

@bst_bp.route("/delete", methods=["POST"])
def delete_node():
    data = request.get_json()
    value = data.get("value")

    if value is None:
        return jsonify({"error": "value is required"}), 400

    bt = get_or_create()

    if not bt.tree_data:
        return jsonify({"error": "Tree is empty"}), 404

    tree_copy = copy.deepcopy(bt.tree_data)
    updated_tree, deleted = delete_bst_node(tree_copy, value)

    if not deleted:
        return jsonify({"error": "Node not found"}), 404

    bt.tree_data = updated_tree
    db.session.commit()

    return jsonify(bt.to_dict())

@bst_bp.route("/clear", methods=["POST"])
def clear_tree():
    bt = get_or_create()
    bt.tree_data = None
    bt.next_id = 1
    db.session.commit()

    return jsonify(bt.to_dict())

@bst_bp.route("/max", methods=["GET"])
def get_max():
    bt = get_or_create()

    if not bt.tree_data:
        return jsonify({"error": "Tree is empty"}), 404

    node = find_max(bt.tree_data)

    return jsonify({
        "max_value": node["value"],
        "node_id": node["id"]
    })

@bst_bp.route("/height", methods=["POST"])
def get_node_height():
    data = request.get_json()
    node_id = data.get("node_id")

    if node_id is None:
        return jsonify({"error": "node_id is required"}), 400

    bt = get_or_create()

    if not bt.tree_data:
        return jsonify({"error": "Tree is empty"}), 404

    target = find_node_by_id(bt.tree_data, node_id)
    if not target:
        return jsonify({"error": "Node not found"}), 404

    height = compute_height(target)

    return jsonify({
        "node_id": node_id,
        "height": height
    })

@bst_bp.route("/debug", methods=["GET"])
def debug_tree():
    """Debug endpoint to see what's in the tree."""
    bt = get_or_create()
    return jsonify({
        "tree_data": bt.tree_data,
        "next_id": bt.next_id
    })
@bst_bp.route("/height-by-value", methods=["POST"])
def get_node_height_by_value():
    """Search for a node by value and return its height in one call."""
    data = request.get_json()
    value = data.get("value")

    if value is None:
        return jsonify({"error": "value is required"}), 400

    try:
        value = float(value)
    except (ValueError, TypeError):
        return jsonify({"error": "value must be a number"}), 400

    bt = get_or_create()

    if not bt.tree_data:
        return jsonify({"error": "Tree is empty"}), 404

    # Search for the node by value
    target = find_node_by_value(bt.tree_data, value)
    if not target:
        return jsonify({"error": f"Node with value {value} not found"}), 404

    # Calculate height of that node
    height = compute_height(target)

    return jsonify({
        "node_id": target["id"],
        "value": target["value"],
        "height": height
    })
