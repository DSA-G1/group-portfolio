from app import db

class BinaryTreeOperation(db.Model):
    __tablename__ = 'binary_tree_operation'
    
    id = db.Column(db.Integer, primary_key=True)
    tree_data = db.Column(db.JSON, default=None)
    next_id = db.Column(db.Integer, default=1)
    
    def to_dict(self):
        return {
            'id': self.id,
            'tree_data': self.tree_data,
            'next_id': self.next_id
        }