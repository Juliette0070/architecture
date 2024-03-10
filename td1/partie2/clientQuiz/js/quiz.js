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
      $('#liste-quiz')
        .append($('<h2>').text("Liste des quiz"))
        .append($('<input type="button" value="add quiz">').on("click", formNewQuiz));
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

    function formNewQuiz(){
        formQuiz();
        $("#currentquiz #liste-questions").append($('<input type="button" value="save quiz">').on("click", saveNewQuiz));
        $("#currentquiz #liste-questions").children("input[value='modify quiz']").remove();
        $("#currentquiz #liste-questions").children("input[value='delete quiz']").remove();
    }

    function detailsQuiz(event){
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
            .append($('<input type="button" value="add question">').on("click", addQuestion))
            .append($('<input type="button" value="modify quiz">').on("click", saveModifiedQuiz))
            .append($('<input type="button" value="delete quiz">').on("click", delQuiz));
        $("#currentquiz #question")
            .append($('<span>Question: <input type="text" id="questionSelectionnee"><br></span>'))
            .append($('<hidden id="quri">'))
            .append($('<div id="type">'))
            .append($('<div>')
                .append($('<input type="button" value="simplequestion">').on("click", simpleSelected))
                .append($('<input type="button" value="multiplequestion">').on("click", multipleSelected))
                .append($('<input type="button" value="autre">').on("click", autreSelected))
            )
            .append($('<input type="button" value="save question">').on("click", saveNewQuestion));
    }

    function addQuestion(){
        $("#currentquiz #question #type").empty();
        $("#currentquiz #question #questionSelectionnee").val("");
        $("#currentquiz #question input[value='simplequestion']").css("color", "black");
        $("#currentquiz #question input[value='multiplequestion']").css("color", "black");
        $("#currentquiz #question input[value='autre']").css("color", "blue");
    }

    function simpleSelected(){
        $("#currentquiz #question #type")
            .empty()
            .append($('<span>Reponse: <input type="text" id="reponse"><br></span>'));
        $("#currentquiz #question input[value='simplequestion']").css("color", "blue");
        $("#currentquiz #question input[value='multiplequestion']").css("color", "black");
        $("#currentquiz #question input[value='autre']").css("color", "black");
    }

    function multipleSelected(){
        $("#currentquiz #question #type")
            .empty()
            .append($('<span>Reponse: <input type="text" id="reponse"><br></span>'))
            .append($('<span>Choix 1: <input type="text" id="choix1"><br></span>'))
            .append($('<span>Choix 2: <input type="text" id="choix2"><br></span>'));
        $("#currentquiz #question input[value='simplequestion']").css("color", "black");
        $("#currentquiz #question input[value='multiplequestion']").css("color", "blue");
        $("#currentquiz #question input[value='autre']").css("color", "black");
    }

    function autreSelected(){
        $("#currentquiz #question #type").empty();
        $("#currentquiz #question input[value='simplequestion']").css("color", "black");
        $("#currentquiz #question input[value='multiplequestion']").css("color", "black");
        $("#currentquiz #question input[value='autre']").css("color", "blue");
    }

    function saveNewQuestion(){
        if ($("#currentquiz #question #type").children().length == 1){
            var question = new SimpleQuestion(
                $("#currentquiz #questionSelectionnee").val(),
                $("#currentquiz #reponse").val()
            );
        } else if ($("#currentquiz #question #type").children().length == 3){
            var question = new MultipleQuestion(
                $("#currentquiz #questionSelectionnee").val(),
                $("#currentquiz #reponse").val(),
                $("#currentquiz #choix1").val(),
                $("#currentquiz #choix2").val()
            );
        } else {
            var question = new Question(
                $("#currentquiz #questionSelectionnee").val()
            );
        }
        console.log(JSON.stringify(question));
        uri = $("#currentquiz #turi").val();
        fetch(uri + "/questions",{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(question)
        })
        .then(res => {console.log('Save Success') ;
            $("#result").text(res['contenu']);
            refreshQuizList();
        })
        .catch( res => { console.log(res) });
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
            .append($('<span>Question: <input type="text" id="questionSelectionnee" value="' + repjson.title + '"><br></span>'))
            .append($('<div id="type">'));
        $("#currentquiz #question")
            .append($('<div>')
                .append($('<input type="button" value="simplequestion">').on("click", simpleSelected))
                .append($('<input type="button" value="multiplequestion">').on("click", multipleSelected))
                .append($('<input type="button" value="autre">').on("click", autreSelected))
            )
            .append($('<input type="button" value="modify question">').on("click", saveModifiedQuestion))
            .append($('<input type="button" value="delete question">').on("click", delQuestion));
        $("#currentquiz #question")
            .append($('<input type="hidden" id="quri" value="' + repjson.uri + '">'));
        if (repjson.questionnaireType == "simplequestion"){
            $("#currentquiz #question #type")
                .append($('<span>Reponse: <input type="text" id="reponse" value="' + repjson.reponse + '"><br></span>'));
            $("#currentquiz #question input[value='simplequestion']").css("color", "blue");
        } else if (repjson.questionnaireType == "multiplequestion"){
            $("#currentquiz #question #type")
                .append($('<span>Reponse: <input type="text" id="reponse" value="' + repjson.reponse + '"><br></span>'))
                .append($('<span>Choix 1: <input type="text" id="choix1" value="' + repjson.choix1 + '"><br></span>'))
                .append($('<span>Choix 2: <input type="text" id="choix2" value="' + repjson.choix2 + '"><br></span>'));
            $("#currentquiz #question input[value='multiplequestion']").css("color", "blue");
        } else {
            $("#currentquiz #question input[value='autre']").css("color", "blue");
        }
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
        constructor(name, uri, questions){
            this.name = name;
            this.uri = uri;
            this.questions = questions;
        }
    }

    class Question{
        constructor(title, uri){
            this.title = title;
            this.uri = uri;
            this.questionnaireType = "question";
        }
    }

    class SimpleQuestion extends Question{
        constructor(title, uri, reponse){
            super(title, uri);
            this.questionnaireType = "simplequestion";
            this.reponse = reponse;
        }
    }

    class MultipleQuestion extends Question{
        constructor(title, uri, reponse, choix1, choix2){
            super(title, uri);
            this.questionnaireType = "multiplequestion";
            this.reponse = reponse;
            this.choix1 = choix1;
            this.choix2 = choix2;
        }
    }

    function saveNewQuiz(){
        var quiz = new Quiz(
            $("#currentquiz #questionnaire").val()
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

    function saveModifiedQuiz(){
        var quiz = new Quiz(
            $("#currentquiz #questionnaire").val(),
            $("#currentquiz #turi").val()
        );
        console.log("PUT");
        console.log(quiz.uri);
        console.log(JSON.stringify(quiz));
        fetch(quiz.uri,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "PUT",
        body: JSON.stringify(quiz)
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

    function saveModifiedQuestion(){
        if ($("#currentquiz #question #type").children().length == 1){
            var question = new SimpleQuestion(
                $("#currentquiz #questionSelectionnee").val(),
                $("#currentquiz #reponse").val()
            );
        } else if ($("#currentquiz #question #type").children().length == 3){
            var question = new MultipleQuestion(
                $("#currentquiz #questionSelectionnee").val(),
                $("#currentquiz #reponse").val(),
                $("#currentquiz #choix1").val(),
                $("#currentquiz #choix2").val()
            );
        } else {
            var question = new Question(
                $("#currentquiz #questionSelectionnee").val()
            );
        }
        console.log(JSON.stringify(question));
        uri = $("#currentquiz #turi").val();
        fetch(uri,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify(question)
        })
        .then(res => {console.log('Save Success') ;
            $("#result").text(res['contenu']);
            refreshQuizList();
        })
        .catch( res => { console.log(res) });
    }

    function delQuestion(){
        if ($("#currentquiz #questionSelectionnee").val()){
            url = $("#currentquiz #quri").val();
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
