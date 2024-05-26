import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from supabaseClient import supabase
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', os.urandom(24))
CORS(app)

@app.route('/')
def index():
    return "Welcome to the Golf Tournament API"

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']
    user = supabase.auth.sign_in(email=email, password=password)
    if user:
        session['user'] = user
        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'message': 'Login failed'}), 401

@app.route('/submit_score', methods=['POST'])
def submit_score():
    if 'user' in session:
        data = request.json
        player1_id = data['player1_id']
        player2_id = data['player2_id']
        score1 = data['score1']
        score2 = data['score2']
        supabase.table('scores').insert({
            'player1_id': player1_id,
            'player2_id': player2_id,
            'score1': score1,
            'score2': score2
        }).execute()
        return jsonify({'message': 'Score submitted'}), 200
    return jsonify({'message': 'Unauthorized'}), 401

@app.route('/scores')
def scores():
    scores = supabase.table('scores').select('*').execute()
    return jsonify(scores.data), 200

if __name__ == '__main__':
    app.run(debug=True)
