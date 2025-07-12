from src.models.user import db

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    senha = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)

    def __repr__(self):
        return f'<Usuario {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }

