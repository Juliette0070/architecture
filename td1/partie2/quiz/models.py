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
            'name': self.name
        }
    
class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120))
    questionnaireType = db.Column(db.String(120))
    questionnaire_id = db.Column(db.Integer, db.ForeignKey('questionnaire.id'))
    questionnaire = db.relationship('Questionnaire', backref=db.backref('questions', lazy='dynamic'))

def get_questionnaires():
    return [q.to_json() for q in Questionnaire.query.all()]

def get_questionnaire(quiz_id):
    return Questionnaire.query.get(quiz_id)

def create_questionnaire(name):
    q = Questionnaire(name)
    db.session.add(q)
    db.session.commit()
    return q

def create_question(title, questionnaireType, questionnaire_id):
    q = Question(title, questionnaireType, questionnaire_id)
    db.session.add(q)
    db.session.commit()
    return q

def get_questions(quiz_id):
    return [q.to_json() for q in Question.query.filter_by(questionnaire_id=quiz_id).all()]

def get_question(quiz_id, question_id):
    return Question.query.filter_by(questionnaire_id=quiz_id, id=question_id).first()

def delete_question(quiz_id, question_id):
    q = Question.query.filter_by(questionnaire_id=quiz_id, id=question_id).first()
    db.session.delete(q)
    db.session.commit()

def update_question(quiz_id, question_id, title, questionnaireType):
    q = Question.query.filter_by(questionnaire_id=quiz_id, id=question_id).first()
    q.title = title
    q.questionnaireType = questionnaireType
    db.session.commit()
    return q

def update_questionnaire(quiz_id, name):
    q = Questionnaire.query.get(quiz_id)
    q.name = name
    db.session.commit()
    return q

def delete_questionnaire(quiz_id):
    q = Questionnaire.query.get(quiz_id)
    db.session.delete(q)
    db.session.commit()
