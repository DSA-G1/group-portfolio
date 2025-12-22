from collections import deque
import json
import os

def load_stations_data():
    json_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        '..', 'portfolio-frontend', 'src', 'data', 'stations_data.json'
    )
    with open(json_path, 'r') as f:
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