# Client-serveur RESTful avec Flask - Quiz

## Commandes pour lancer le serveur et le client

### Lancer le serveur

flask run

### Lancer le client

mettre le chemin du fichier quiz.html dans le navigateur

## Commandes curl pour interagir avec le serveur

### Afficher la liste des quiz

GET http://localhost:5000/quiz/api/v1.0/quiz

### Afficher un quiz

GET http://localhost:5000/quiz/api/v1.0/quiz/id_quiz

### Ajouter un quiz

POST http://localhost:5000/quiz/api/v1.0/quiz

### Supprimer un quiz

DELETE http://localhost:5000/quiz/api/v1.0/quiz/id_quiz

### Modifier un quiz

PUT http://localhost:5000/quiz/api/v1.0/quiz/id_quiz

### Afficher la liste des questions d'un quiz

GET http://localhost:5000/quiz/api/v1.0/quiz/id_quiz/questions

### Afficher une question d'un quiz

GET http://localhost:5000/quiz/api/v1.0/quiz/id_quiz/questions/id_question

### Ajouter une question à un quiz

POST http://localhost:5000/quiz/api/v1.0/quiz/id_quiz/questions

### Supprimer une question d'un quiz

DELETE http://localhost:5000/quiz/api/v1.0/quiz/id_quiz/questions/id_question

### Modifier une question d'un quiz

PUT http://localhost:5000/quiz/api/v1.0/quiz/id_quiz/questions/id_question

## Fonctionnalités implantées

- [x] Afficher la liste des quiz
- [x] Afficher un quiz
- [x] Ajouter un quiz
- [x] Supprimer un quiz
- [x] Modifier un quiz
- [x] Afficher la liste des questions d'un quiz
- [x] Afficher une question d'un quiz
- [x] Ajouter une question à un quiz
- [x] Supprimer une question d'un quiz
- [x] Modifier une question d'un quiz
