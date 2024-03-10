$(function() {

    $("#button").click(refreshQuizList);

    $("#tools #add").on("click", formQuiz);
    $('#tools #del').on('click', delQuiz);

    function refreshQuizList(){
        $("#currentquiz").empty();
        requete = "http://localhost:5000/quiz/api/v1.0/quiz";
        fetch(requete)
        .then( response => {
                  if (response.ok) return response.json();
                  else throw new Error('Problème ajax: '+response.status);
                }
            )
        .then(remplirQuiz)
        .catch(onerror);
    }

    function remplirQuiz(repjson) {
      $('#liste-quiz').empty();
      $('#liste-quiz').append($('<h2>').text("Liste des quiz"));
      $('#liste-quiz').append($('<ul>'));
      for(questionnaire of repjson.questionnaires){
          $('#liste-quiz ul')
                .append($('<li>')
                .append($('<a>')
                .text(questionnaire.name)
                    ).on("click", questionnaire, detailsQuiz)
            );
        }
    }

    function detailsQuiz(event){
        $("#currentquiz").empty();
        formQuiz();
        fillFormQuiz(event.data);
    }

    function formQuiz(){
        $("#currentquiz").empty();
        $("#currentquiz")
            .append($('<div id="liste-questions">'))
            .append($('<div id="question">'))
        $("#currentquiz #liste-questions")
            .append($('<span>Questionnaire: <input type="text" id="questionnaire"><br></span>'))
            .append("<ul id='questions'></ul>")
            .append($('<input type="hidden" id="turi">'))
            .append($('<input type="button" value="modify quiz">'))
            .append($('<input type="button" value="delete quiz">'));
        $("#currentquiz #question")
            .append($('<span>Question: <input type="text" id="questionSelectionnee"><br></span>'))
            .append($('<input type="button" value="modify question">'))
            .append($('<input type="button" value="delete question">'));
    }

    function fillFormQuiz(t){
        $("#currentquiz #questionnaire").val(t.name);
        $("#currentquiz #turi").val(t.uri);
        for (var i = 0; i < t.questions.length; i++){
            fetch(t.questions[i])
            .then(response => {
                if (response.ok) return response.json();
                else throw new Error('Problème ajax: '+response.status);
            })
            .then(response => {
                $("#currentquiz #questions")
                .append($('<li>')
                .append($('<hidden>').val(response.uri))
                .append($('<a id="'+response.uri+'">')
                .text(response.title))
                .on("click", (function(question) {return function() {detailsQuestion(question);};})(response.uri))
                )
            })
        }
    }
    
    function detailsQuestion(uri){
        fetch(uri)
        .then(response => {
                  if (response.ok) return response.json();
                  else throw new Error('Problème ajax: '+response.status);
                }
            )
        .then(remplirQuestion)
        .catch(onerror);
    }

    function remplirQuestion(repjson) {
        $("#currentquiz #question").empty();
        $("#currentquiz #question")
            .append($('<span>Question: <input type="text" id="questionSelectionnee" value="' + repjson.title + '"><br></span>'));
        if (repjson.questionnaireType == "simplequestion"){
            $("#currentquiz #question")
                .append($('<span>Reponse: <input type="text" id="reponse" value="' + repjson.reponse + '"><br></span>'));
        } else if (repjson.questionnaireType == "multiplequestion"){
            $("#currentquiz #question")
            .append($('<span>Reponse: <input type="text" id="reponse" value="' + repjson.reponse + '"><br></span>'))
                .append($('<span>Choix 1: <input type="text" id="choix1" value="' + repjson.choix1 + '"><br></span>'))
                .append($('<span>Choix 2: <input type="text" id="choix2" value="' + repjson.choix2 + '"><br></span>'));
        }
        $("#currentquiz #question")
            .append($('<input type="button" value="modify question">'))
            .append($('<input type="button" value="delete question">'));
    }

    function onerror(err) {
        $("#quiz").html("<b>Impossible de récupérer les quiz à réaliser !</b>"+err);
    }

    class Task{
        constructor(title, description, done, uri){
            this.title = title;
            this.description = description;
            this.done = done;
            this.uri = uri;
            console.log(this.uri);
        }
    }

    class Quiz{
        constructor(title, uri, questions){
            this.title = title;
            this.uri = uri;
            this.questions = questions;
        }
    }

    class Question{
        constructor(title, uri){
            this.title = title;
            this.uri = uri;
        }
    }

    class SimpleQuestion extends Question{
        constructor(title, uri, reponse){
            super(title, uri);
            this.reponse = reponse;
        }
    }

    class MultipleQuestion extends Question{
        constructor(title, uri, reponse, choix1, choix2){
            super(title, uri);
            this.reponse = reponse;
            this.choix1 = choix1;
            this.choix2 = choix2;
        }
    }

    function saveNewQuiz(){
        //var questions = [];
        //for (var i = 0; i < $("#currentquiz #questions").children().length; i++){
        //    var question = new Question(
        //        $("#currentquiz #questions").children().eq(i).children().eq(1).val(),
        //        $("#currentquiz #questions").children().eq(i).children().eq(0).val()
        //    );
        //    questions.push(question);
        //}
        var quiz = new Quiz(
            $("#currentquiz #questionnaire").val(),
            []
        );
        console.log(JSON.stringify(quiz));
        fetch("http://localhost:5000/quiz/api/v1.0/quiz",{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(quiz)
        })
        .then(res => {console.log('Save Success') ;
            $("#result").text(res['contenu']);
            refreshQuizList();
        })
        .catch( res => { console.log(res) });
    }

    function saveNewQuiz1(){
        var task = new Task(
            $("#currentquiz #titre").val(),
            $("#currentquiz #descr").val(),
            $("#currentquiz #done").is(':checked')
            );
        console.log(JSON.stringify(task));
        fetch("http://localhost:5000/todo/api/v1.0/tasks",{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(task)
            })
        .then(res => { console.log('Save Success') ;
                       $("#result").text(res['contenu']);
                       refreshQuizList();
                   })
        .catch( res => { console.log(res) });
    }

    function saveModifiedQuiz(){
        var task = new Task(
            $("#currentquiz #titre").val(),
            $("#currentquiz #descr").val(),
            $("#currentquiz #done").is(':checked'),
            $("#currentquiz #turi").val()
            );
        console.log("PUT");
        console.log(task.uri);
        console.log(JSON.stringify(task));
        fetch(task.uri,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "PUT",
        body: JSON.stringify(task)
            })
        .then(res => { console.log('Update Success');  refreshQuizList();} )
        .catch( res => { console.log(res) });
    }

    function delQuiz(){
        if ($("#currentquiz #turi").val()){
        url = $("#currentquiz #turi").val();
        fetch(url,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "DELETE"
            })
        .then(res => { console.log('Delete Success:' + res); } )
        .then(refreshQuizList)
        .catch( res => { console.log(res);  });
    }
  }
});
