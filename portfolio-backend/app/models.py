from app import db
from datetime import datetime
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy import PickleType

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    github_url = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'github_url': self.github_url,
            'created_at': self.created_at.isoformat()
        }

class QueueOperation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    queue_data = db.Column(MutableList.as_mutable(PickleType), default=[])
    
    def to_dict(self):
        return {'id': self.id, 'queue_data': self.queue_data or []}

class DequeOperation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    deque_data = db.Column(MutableList.as_mutable(PickleType), default=[])
    
    def to_dict(self):
        return {'id': self.id, 'deque_data': self.deque_data or []}