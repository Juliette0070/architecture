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

@app.route('/quiz/api/v1.0/quiz/<int:quiz_id>', methods=['PUT'])
def update_quiz(quiz_id):
    q = get_questionnaire(quiz_id)
    if q is None:
        abort(404)
    if not request.json:
        abort(400)
    q.name = request.json.get('name', q.name)
    db.session.commit()
    return jsonify(q.to_json())

@app.route('/quiz/api/v1.0/quiz/<int:quiz_id>', methods=['DELETE'])
def delete_quiz(quiz_id):
    q = get_questionnaire(quiz_id)
    if q is None:
        abort(404)
    db.session.delete(q)
    db.session.commit()
    return jsonify({'result': True})

@app.route('/quiz/api/v1.0/quiz/<int:quiz_id>/questions', methods=['GET'])
def get_questions(quiz_id):
    q = get_questionnaire(quiz_id)
    if q is None:
        abort(404)
    return jsonify(questions = [q.to_json() for q in q.questions])

@app.route('/quiz/api/v1.0/quiz/<int:quiz_id>/questions/<int:question_id>', methods=['GET'])
def get_question(quiz_id, question_id):
    q = get_questionnaire(quiz_id)
    if q is None:
        abort(404)
    question = q.questions.filter_by(id=question_id).first()
    if question is None:
        abort(404)
    return jsonify(question.to_json())

@app.route('/quiz/api/v1.0/quiz/<int:quiz_id>/questions', methods=['POST'])
def create_question(quiz_id):
    q = get_questionnaire(quiz_id)
    if q is None:
        abort(404)
    if not request.json or not 'title' in request.json or not 'questionnaireType' in request.json:
        abort(400)
    question = Question(request.json['title'], request.json['questionnaireType'], quiz_id)
    db.session.add(question)
    db.session.commit()
    return jsonify(question.to_json()), 201

@app.route('/quiz/api/v1.0/quiz/<int:quiz_id>/questions/<int:question_id>', methods=['PUT'])
def update_question(quiz_id, question_id):
    q = get_questionnaire(quiz_id)
    if q is None:
        abort(404)
    question = q.questions.filter_by(id=question_id).first()
    if question is None:
        abort(404)
    if not request.json:
        abort(400)
    question.title = request.json.get('title', question.title)
    question.questionnaireType = request.json.get('questionnaireType', question.questionnaireType)
    db.session.commit()
    return jsonify(question.to_json())

@app.route('/quiz/api/v1.0/quiz/<int:quiz_id>/questions/<int:question_id>', methods=['DELETE'])
def delete_question(quiz_id, question_id):
    q = get_questionnaire(quiz_id)
    if q is None:
        abort(404)
    question = q.questions.filter_by(id=question_id).first()
    if question is None:
        abort(404)
    db.session.delete(question)
    db.session.commit()
    return jsonify({'result': True})
