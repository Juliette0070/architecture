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
