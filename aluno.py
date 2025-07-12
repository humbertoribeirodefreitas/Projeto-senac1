from src.models.user import db

class Aluno(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    matricula = db.Column(db.String(20), unique=True, nullable=False)
    curso = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='ATIVO')
    periodo = db.Column(db.String(20), nullable=False)
    turno = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f'<Aluno {self.nome}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'cpf': self.cpf,
            'matricula': self.matricula,
            'curso': self.curso,
            'status': self.status,
            'periodo': self.periodo,
            'turno': self.turno
        }

