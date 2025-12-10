"""Binary Search Tree helper utilities."""

def find_node_by_value(node, value):
    """Search for a value in BST using BST rules."""
    if not node:
        return None

    # Ensure comparison is between same types (floats)
    node_val = float(node["value"]) if node["value"] is not None else None
    search_val = float(value) if value is not None else None

    if node_val == search_val:
        return node
    elif search_val < node_val:
        return find_node_by_value(node.get("left"), search_val)
    else:
        return find_node_by_value(node.get("right"), search_val)


def find_node_by_id(node, node_id):
    if not node:
        return None
    if node["id"] == node_id:
        return node
    return (find_node_by_id(node.get("left"), node_id) or
            find_node_by_id(node.get("right"), node_id))


def insert_bst_node(node, value, next_id):
    """Insert a value into BST following BST rules.

    Returns (updated_node, next_id_after_insertion, success).
    """
    # Ensure value is float
    value = float(value)
    
    if not node:
        return {
            "id": next_id,
            "value": value,
            "left": None,
            "right": None
        }, next_id + 1, True

    node_val = float(node["value"])
    
    if value < node_val:
        new_left, new_next, success = insert_bst_node(node["left"], value, next_id)
        node["left"] = new_left
        return node, new_next, success

    elif value > node_val:
        new_right, new_next, success = insert_bst_node(node["right"], value, next_id)
        node["right"] = new_right
        return node, new_next, success

    # Duplicate value - reject insertion
    return node, next_id, False


def find_max(node):
    """Return rightmost (maximum value) node in BST."""
    current = node
    while current and current.get("right"):
        current = current["right"]
    return current


def find_min(node):
    """Return leftmost (minimum value) node in BST."""
    current = node
    while current and current.get("left"):
        current = current["left"]
    return current


def compute_subtree_height(node):
    """Height of subtree starting from this node (edges count).

    Returns -1 for an empty subtree (so a leaf has height 0).
    """
    if not node:
        return -1

    left_h = compute_subtree_height(node.get("left"))
    right_h = compute_subtree_height(node.get("right"))

    return 1 + max(left_h, right_h)


def get_max_depth_from_node(node):
    """Get the maximum depth from this node to any leaf in the tree.
    
    This is the distance to the deepest leaf below this node.
    Leaf nodes return 0, nodes with children return max depth below them.
    """
    if not node:
        return -1
    
    left_depth = get_max_depth_from_node(node.get("left"))
    right_depth = get_max_depth_from_node(node.get("right"))
    
    return 1 + max(left_depth, right_depth)


def get_tree_max_depth(node):
    """Get the maximum depth from root to any leaf in the entire tree."""
    if not node:
        return -1
    
    left_depth = get_tree_max_depth(node.get("left"))
    right_depth = get_tree_max_depth(node.get("right"))
    
    return 1 + max(left_depth, right_depth)


def compute_height(node, tree_root):
    """Get height as distance from this node to the deepest leaf in the entire tree.
    
    The deepest leaf in the tree has height 0.
    Each ancestor is 1 level higher.
    """
    if not node:
        return -1
    
    # Get max depth in entire tree
    max_tree_depth = get_tree_max_depth(tree_root)
    
    # Get depth of this specific node from root
    def get_node_depth(current, target, depth=0):
        if not current:
            return None
        if current["id"] == target["id"]:
            return depth
        
        left_result = get_node_depth(current.get("left"), target, depth + 1)
        if left_result is not None:
            return left_result
        
        return get_node_depth(current.get("right"), target, depth + 1)
    
    node_depth = get_node_depth(tree_root, node)
    if node_depth is None:
        return -1
    
    # Height = max_depth - node_depth
    return max_tree_depth - node_depth


def delete_bst_node(node, value):
    """
    Delete a node by VALUE (not ID!) following BST delete rules.
    Returns (updated_node, deletion_successful).
    """
    if not node:
        return None, False

    value = float(value)
    node_val = float(node["value"])

    if value < node_val:
        node["left"], deleted = delete_bst_node(node["left"], value)
        return node, deleted

    elif value > node_val:
        node["right"], deleted = delete_bst_node(node["right"], value)
        return node, deleted

    # Node found → handle deletion
    else:
        # Case 1: No children
        if not node["left"] and not node["right"]:
            return None, True

        # Case 2: One child (right only)
        if not node["left"]:
            return node["right"], True

        # Case 3: One child (left only)
        if not node["right"]:
            return node["left"], True

        # Case 4: Two children → replace value with inorder successor (minimum in right subtree)
        successor = find_min(node["right"])
        node["value"] = successor["value"]
        # Keep the current node's id to avoid duplicate ids in the tree
        node["right"], _ = delete_bst_node(node["right"], successor["value"])
        return node, True
