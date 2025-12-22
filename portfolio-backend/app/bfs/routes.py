from flask import Blueprint, jsonify, request
from app import db
from app.bfs.models import BFSOperation
from app.bfs.utils import load_stations_data, build_graph, bfs_shortest_path, path_to_segments

bfs_bp = Blueprint('bfs', __name__)

_graph_cache = None
_current_path_state = None

def get_graph():
    global _graph_cache
    if _graph_cache is None:
        stations_data = load_stations_data()
        _graph_cache = build_graph(stations_data)
    return _graph_cache

@bfs_bp.route('/search', methods=['POST'])
def search_path():
    global _current_path_state
    
    data = request.get_json()
    start = data.get('start')
    end = data.get('end')
    
    if not start or not end:
        return jsonify({'error': 'start and end required'}), 400
    
    graph = get_graph()
    path = bfs_shortest_path(graph, start, end)
    
    if not path:
        return jsonify({'error': 'No path found'}), 404
    
    _current_path_state = path
    segments = path_to_segments(path)
    
    operation = BFSOperation(
        start_station=start,
        end_station=end,
        path=path,
        segments=segments
    )
    db.session.add(operation)
    db.session.commit()
    
    return jsonify({
        'path': path,
        'segments': segments,
        'operation_id': operation.id
    })

@bfs_bp.route('/reset', methods=['POST'])
def reset_path():
    global _current_path_state
    _current_path_state = None
    return jsonify({'message': 'Reset'})

@bfs_bp.route('/current', methods=['GET'])
def get_current():
    global _current_path_state
    if not _current_path_state:
        return jsonify({'path': None, 'segments': []})
    return jsonify({
        'path': _current_path_state,
        'segments': path_to_segments(_current_path_state)
    })

@bfs_bp.route('/stations', methods=['GET'])
def get_stations():
    graph = get_graph()
    return jsonify({'stations': sorted(list(graph.keys()))})

@bfs_bp.route('/history', methods=['GET'])
def get_history():
    operations = BFSOperation.query.order_by(BFSOperation.created_at.desc()).limit(10).all()
    return jsonify([op.to_dict() for op in operations])