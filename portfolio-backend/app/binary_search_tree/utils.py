"""Binary Search Tree helper utilities."""

def find_node_by_value(node, value):
    """Search for a value in BST using BST rules."""
    if not node:
        return None

    if node["value"] == value:
        return node
    elif value < node["value"]:
        return find_node_by_value(node.get("left"), value)
    else:
        return find_node_by_value(node.get("right"), value)


def find_node_by_id(node, node_id):
    if not node:
        return None
    if node["id"] == node_id:
        return node
    return (find_node_by_id(node.get("left"), node_id) or
            find_node_by_id(node.get("right"), node_id))


def insert_bst_node(node, value, next_id):
    """Insert a value into BST following BST rules.

    Returns (updated_node, next_id_after_insertion).
    """
    if not node:
        return {
            "id": next_id,
            "value": value,
            "left": None,
            "right": None
        }, next_id + 1

    if value < node["value"]:
        new_left, new_next = insert_bst_node(node["left"], value, next_id)
        node["left"] = new_left
        return node, new_next

    elif value > node["value"]:
        new_right, new_next = insert_bst_node(node["right"], value, next_id)
        node["right"] = new_right
        return node, new_next

    return node, next_id


def find_max(node):
    """Return rightmost (maximum value) node in BST."""
    current = node
    while current and current.get("right"):
        current = current["right"]
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


def compute_height(node):
    """Compatibility alias for compute_subtree_height.

    Other modules may import `compute_height` — keep that name supported.
    """
    return compute_subtree_height(node)


def delete_bst_node(node, value):
    """
    Delete a node by VALUE (not ID!) following BST delete rules.
    Returns (updated_node, deletion_successful).
    """
    if not node:
        return None, False

    if value < node["value"]:
        node["left"], deleted = delete_bst_node(node["left"], value)
        return node, deleted

    elif value > node["value"]:
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

        # Case 4: Two children → replace with inorder successor
        successor = find_max(node["right"])
        node["value"] = successor["value"]  
        node["right"], _ = delete_bst_node(node["right"], successor["value"])
        return node, True
