from flask import url_for
from .app import db

class Questionnaire(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))

    def __init__(self, name):
        self.name = name
    
    def __repr__(self):
        return '<Questionnaire (%d) %s>' % (self.id, self.name)
    
    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'uri': url_for('get_quiz_by_id', id_quiz=self.id, _external=True),
            'questions': [q.to_json()['uri'] for q in self.questions]
        }
    
class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120))
    questionnaireType = db.Column(db.String(120))
    questionnaire_id = db.Column(db.Integer, db.ForeignKey('questionnaire.id'))
    questionnaire = db.relationship('Questionnaire', backref=db.backref('questions', lazy='dynamic'))
    __mapper_args__ = {
        'polymorphic_identity': 'question',
        'with_polymorphic': '*',
        'polymorphic_on': questionnaireType
    }

    def __init__(self, title, questionnaireType, questionnaire_id):
        self.title = title
        self.questionnaireType = questionnaireType
        self.questionnaire_id = questionnaire_id

    def __repr__(self):
        return '<Question (%d) %s>' % (self.id, self.title)
    
    def to_json(self):
        return {
            'id': self.id,
            'title': self.title,
            'questionnaireType': self.questionnaireType,
            'questionnaire_id': self.questionnaire_id,
            'uri': url_for('get_question', id_quiz=self.questionnaire_id, question_id=self.id, _external=True)
        }

class SimpleQuestion(Question):
    id = db.Column(db.Integer, db.ForeignKey('question.id'), primary_key=True)
    reponse = db.Column(db.String(120))
    __mapper_args__ = {
        'polymorphic_identity': 'simplequestion',
        'with_polymorphic': '*',
        'polymorphic_load': 'inline'
    }
    
    def __repr__(self):
        return '<SimpleQuestion (%d) %s>' % (self.id, self.title)
    
    def to_json(self):
        return {
            'id': self.id,
            'title': self.title,
            'questionnaireType': self.questionnaireType,
            'questionnaire_id': self.questionnaire_id,
            'reponse': self.reponse,
            'uri': url_for('get_question', id_quiz=self.questionnaire_id, question_id=self.id, _external=True)
        }

class MultipleQuestion(Question):
    id = db.Column(db.Integer, db.ForeignKey('question.id'), primary_key=True)
    reponse = db.Column(db.Integer)
    __mapper_args__ = {
        'polymorphic_identity': 'multiplequestion',
        'with_polymorphic': '*',
        'polymorphic_load': 'inline'
    }

    def __repr__(self):
        return '<MultipleQuestion (%d) %s>' % (self.id, self.title)
    
    def to_json(self):
        return {
            'id': self.id,
            'title': self.title,
            'questionnaireType': self.questionnaireType,
            'questionnaire_id': self.questionnaire_id,
            'reponse': self.reponse,
            'uri': url_for('get_question', id_quiz=self.questionnaire_id, question_id=self.id, _external=True)
        }

# questionnaire

def get_questionnaires():
    return [q.to_json() for q in Questionnaire.query.all()]

def get_questionnaire(id_quiz):
    return Questionnaire.query.get(id_quiz)

def create_questionnaire(name):
    q = Questionnaire(name)
    db.session.add(q)
    db.session.commit()
    return q

def update_questionnaire(id_quiz, name):
    q = Questionnaire.query.get(id_quiz)
    q.name = name
    db.session.commit()
    return q

def delete_questionnaire(id_quiz):
    q = Questionnaire.query.get(id_quiz)
    db.session.delete(q)
    db.session.commit()

# question

def get_questions(id_quiz):
    return [q.to_json() for q in Question.query.filter_by(questionnaire_id=id_quiz).all()]

def get_question_quiz(id_quiz, question_id):
    return Question.query.filter_by(questionnaire_id=id_quiz, id=question_id).first().to_json()

def create_question(title, questionnaireType, questionnaire_id):
    q = Question(title, questionnaireType, questionnaire_id)
    db.session.add(q)
    db.session.commit()
    return q

def delete_question(id_quiz, question_id):
    q = Question.query.filter_by(questionnaire_id=id_quiz, id=question_id).first()
    db.session.delete(q)
    db.session.commit()

def update_question(id_quiz, question_id, title, questionnaireType):
    q = Question.query.filter_by(questionnaire_id=id_quiz, id=question_id).first()
    q.title = title
    q.questionnaireType = questionnaireType
    db.session.commit()
    return q
