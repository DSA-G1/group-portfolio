from app import db
from datetime import datetime

class BFSOperation(db.Model):
    __tablename__ = 'bfs_operation'
    
    id = db.Column(db.Integer, primary_key=True)
    start_station = db.Column(db.String(100))
    end_station = db.Column(db.String(100))
    path = db.Column(db.JSON)
    segments = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'start_station': self.start_station,
            'end_station': self.end_station,
            'path': self.path,
            'segments': self.segments,
            'created_at': self.created_at.isoformat()
        }


class TrainGraph(db.Model):
    __tablename__ = 'train_graph'
    
    id = db.Column(db.Integer, primary_key=True)
    graph_data = db.Column(db.JSON)  # Adjacency list representation
    stations_list = db.Column(db.JSON)  # All station names
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'graph_data': self.graph_data,
            'stations_list': self.stations_list,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }