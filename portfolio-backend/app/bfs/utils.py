from collections import deque
import json
import os

def load_stations_data():
    # Get the backend root directory (portfolio-backend/)
    backend_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    # Navigate to the frontend data folder
    json_path = os.path.join(
        backend_root, '..', 'portfolio-frontend', 'src', 'data', 'stations_data.json'
    )
    json_path = os.path.abspath(json_path)
    
    if not os.path.exists(json_path):
        raise FileNotFoundError(f"stations_data.json not found at: {json_path}")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def build_graph(stations_data):
    graph = {}
    for line_name, line_data in stations_data.items():
        segments = line_data.get('segments', [])
        for segment in segments:
            from_station = segment['from']
            to_station = segment['to']
            distance = segment['distance_km']
            
            if from_station not in graph:
                graph[from_station] = []
            if to_station not in graph:
                graph[to_station] = []
            
            graph[from_station].append((to_station, distance))
            graph[to_station].append((from_station, distance))
    
    return graph

def bfs_shortest_path(graph, start, end):
    if start not in graph or end not in graph:
        return None
    
    if start == end:
        return [start]
    
    queue = deque([(start, [start])])
    visited = {start}
    
    while queue:
        current, path = queue.popleft()
        
        for neighbor, _ in graph[current]:
            if neighbor in visited:
                continue
            
            new_path = path + [neighbor]
            
            if neighbor == end:
                return new_path
            
            visited.add(neighbor)
            queue.append((neighbor, new_path))
    
    return None

def path_to_segments(path):
    if not path or len(path) < 2:
        return []
    
    return [{'from': path[i], 'to': path[i + 1]} for i in range(len(path) - 1)]