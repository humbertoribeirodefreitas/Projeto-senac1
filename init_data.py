import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models.user import db
from src.models.usuario import Usuario
from src.models.aluno import Aluno
from flask import Flask

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

def init_data():
    with app.app_context():
        # Criar todas as tabelas
        db.create_all()
        
        # Criar usuário admin padrão
        admin = Usuario.query.filter_by(username='admin').first()
        if not admin:
            admin = Usuario(
                username='admin',
                senha='admin123',
                email='admin@senac.br'
            )
            db.session.add(admin)
        
        # Criar alguns alunos de exemplo
        alunos_exemplo = [
            {
                'nome': 'João Silva',
                'cpf': '111.111.111-11',
                'matricula': 'SENAC202401',
                'curso': 'ADMINISTRAÇÃO',
                'status': 'ATIVO',
                'periodo': 'PRIMEIRO',
                'turno': 'Matutino'
            },
            {
                'nome': 'Maria Santos',
                'cpf': '222.222.222-22',
                'matricula': 'SENAC202402',
                'curso': 'GTI',
                'status': 'ATIVO',
                'periodo': 'SEGUNDO',
                'turno': 'Noturno'
            }
        ]
        
        for aluno_data in alunos_exemplo:
            aluno_existente = Aluno.query.filter_by(cpf=aluno_data['cpf']).first()
            if not aluno_existente:
                aluno = Aluno(**aluno_data)
                db.session.add(aluno)
        
        db.session.commit()
        print("Dados iniciais criados com sucesso!")

if __name__ == '__main__':
    init_data()

