def find_node_by_value(node, value):
    """Recursively find a node by value"""
    if not node:
        return None
    if node['value'] == value:
        return node
    
    left_result = find_node_by_value(node.get('left'), value)
    if left_result:
        return left_result
    
    return find_node_by_value(node.get('right'), value)


def find_node_by_id(node, node_id):
    """Recursively find a node by ID"""
    if not node:
        return None
    if node['id'] == node_id:
        return node
    
    left_result = find_node_by_id(node.get('left'), node_id)
    if left_result:
        return left_result
    
    return find_node_by_id(node.get('right'), node_id)


def remove_node_by_id(node, node_id):
    """Remove a node by ID from the tree"""
    if not node:
        return False
    
    if node.get('left') and node['left']['id'] == node_id:
        node['left'] = None
        return True
    
    if node.get('right') and node['right']['id'] == node_id:
        node['right'] = None
        return True
    
    return (remove_node_by_id(node.get('left'), node_id) or 
            remove_node_by_id(node.get('right'), node_id))


def compute_postorder(node, result):
    """Compute post-order traversal (Left -> Right -> Root)"""
    if not node:
        return
    compute_postorder(node.get('left'), result)
    compute_postorder(node.get('right'), result)
    result.append(node['value'])