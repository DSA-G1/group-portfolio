from app import db

class SortingAlgorithmOperation(db.Model):
    __tablename__ = 'sorting_algorithm_operation'
    
    id = db.Column(db.Integer, primary_key=True)
    algorithm_name = db.Column(db.String(100), nullable=False)
    input_array = db.Column(db.JSON, nullable=False)
    output_array = db.Column(db.JSON, nullable=False)
    steps = db.Column(db.JSON, nullable=False)  # Array of steps showing algorithm progression
    complexity_time = db.Column(db.String(50))
    complexity_space = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=db.func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'algorithm_name': self.algorithm_name,
            'input_array': self.input_array,
            'output_array': self.output_array,
            'steps': self.steps,
            'complexity_time': self.complexity_time,
            'complexity_space': self.complexity_space,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
