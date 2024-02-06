from .app import app,db
from .models import Questionnaire, Question, create_questionnaire, delete_questionnaire, get_question_quiz, get_questionnaire, get_questionnaires, update_questionnaire, create_question, delete_question, get_questions, update_question
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

@app.route('/quiz/api/v1.0/quiz/<int:id_quiz>', methods=['GET'])
def get_quiz_by_id(id_quiz):
    q = get_questionnaire(id_quiz)
    if q is None:
        abort(404)
    return jsonify(q.to_json())

@app.route('/quiz/api/v1.0/quiz', methods=['POST'])
def create_quiz():
    if not request.json or not 'name' in request.json:
        abort(400)
    q = create_questionnaire(request.json['name'])
    return jsonify(q.to_json()), 201

@app.route('/quiz/api/v1.0/quiz/<int:id_quiz>', methods=['PUT'])
def update_quiz(id_quiz):
    if not request.json or not 'name' in request.json:
        abort(400)
    q = update_questionnaire(id_quiz, request.json['name'])
    if q is None:
        abort(404)
    return jsonify(q.to_json())

@app.route('/quiz/api/v1.0/quiz/<int:id_quiz>', methods=['DELETE'])
def delete_quiz(id_quiz):
    q = get_questionnaire(id_quiz)
    if q is None:
        abort(404)
    delete_questionnaire(id_quiz)
    return jsonify({'result': True})

# à modifier
@app.route('/quiz/api/v1.0/quiz/<int:id_quiz>/questions', methods=['GET'])
def get_questions(id_quiz):
    q = get_questionnaire(id_quiz)
    if q is None:
        abort(404)
    return jsonify(questions = [q.to_json() for q in q.questions])

@app.route('/quiz/api/v1.0/quiz/<int:id_quiz>/questions/<int:question_id>', methods=['GET'])
def get_question(id_quiz, question_id):
    q = get_questionnaire(id_quiz)
    if q is None:
        abort(404)
    question = get_question_quiz(id_quiz, question_id)
    if question is None:
        abort(404)
    return jsonify(question)

@app.route('/quiz/api/v1.0/quiz/<int:id_quiz>/questions', methods=['POST'])
def create_question_quiz(id_quiz):
    if not request.json or not 'title' in request.json or not 'questionnaireType' in request.json:
        abort(400)
    question = create_question(request.json['title'], request.json['questionnaireType'], id_quiz, request)
    if question is None:
        abort(404)
    return jsonify(question.to_json()), 201

@app.route('/quiz/api/v1.0/quiz/<int:id_quiz>/questions/<int:question_id>', methods=['PUT'])
def update_question_quiz(id_quiz, question_id):
    if not request.json:
        abort(400)
    questionAvant = get_question_quiz(id_quiz, question_id)
    question = update_question(id_quiz, question_id, request.json.get('title', questionAvant["title"]), request.json.get('questionnaireType', questionAvant["questionnaireType"]))
    if question is None:
        abort(404)
    return jsonify(question.to_json())

@app.route('/quiz/api/v1.0/quiz/<int:id_quiz>/questions/<int:question_id>', methods=['DELETE'])
def delete_question_quiz(id_quiz, question_id):
    question = get_question_quiz(id_quiz, question_id)
    if question is None:
        abort(404)
    delete_question(id_quiz, question_id)
    return jsonify({'result': True})
