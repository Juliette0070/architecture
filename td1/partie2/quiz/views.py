from .app import app,db
from .models import Questionnaire,Question, create_questionnaire, get_questionnaire, get_questionnaires
from flask import jsonify, abort, make_response, request, redirect

@app.errorhandler(400)
def bad_request(error):
    return make_response(jsonify({'error': 'Bad request'}), 400)

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.route('/')
def accueil():
    return redirect('/quiz/api/v1.0/quiz')

@app.route('/quiz/api/v1.0/quiz', methods=['GET'])
def get_quiz():
    return jsonify(questionnaires = get_questionnaires())

@app.route('/quiz/api/v1.0/quiz/<int:quiz_id>', methods=['GET'])
def get_quiz_by_id(quiz_id):
    q = get_questionnaire(quiz_id)
    if q is None:
        abort(404)
    return jsonify(q.to_json())

@app.route('/quiz/api/v1.0/quiz', methods=['POST'])
def create_quiz():
    if not request.json or not 'name' in request.json:
        abort(400)
    q = create_questionnaire(request.json['name'])
    db.session.add(q)
    db.session.commit()
    return jsonify(q.to_json()), 201
