from flask import Blueprint, jsonify, request, session
from src.models.usuario import Usuario
from src.models.user import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    senha = data.get('senha')
    
    if not username or not senha:
        return jsonify({'error': 'Username e senha são obrigatórios'}), 400
    
    usuario = Usuario.query.filter_by(username=username).first()
    
    if usuario and usuario.senha == senha:  # Em produção, usar hash da senha
        session['user_id'] = usuario.id
        session['username'] = usuario.username
        return jsonify({
            'message': 'Login realizado com sucesso',
            'user': usuario.to_dict()
        }), 200
    else:
        return jsonify({'error': 'Credenciais inválidas'}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout realizado com sucesso'}), 200

@auth_bp.route('/check-session', methods=['GET'])
def check_session():
    if 'user_id' in session:
        usuario = Usuario.query.get(session['user_id'])
        if usuario:
            return jsonify({
                'logged_in': True,
                'user': usuario.to_dict()
            }), 200
    
    return jsonify({'logged_in': False}), 200

@auth_bp.route('/usuarios', methods=['POST'])
def create_usuario():
    data = request.json
    
    # Verificar se o usuário já existe
    existing_user = Usuario.query.filter_by(username=data['username']).first()
    if existing_user:
        return jsonify({'error': 'Username já existe'}), 400
    
    usuario = Usuario(
        username=data['username'],
        senha=data['senha'],  # Em produção, usar hash da senha
        email=data.get('email')
    )
    
    try:
        db.session.add(usuario)
        db.session.commit()
        return jsonify(usuario.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Erro ao criar usuário'}), 400

