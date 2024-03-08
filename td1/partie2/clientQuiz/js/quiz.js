$(function() {

    $("#button").click(refreshQuizList);

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

      function onerror(err) {
          $("#quiz").html("<b>Impossible de récupérer les quiz à réaliser !</b>"+err);
      }

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


    function detailsQuiz(event){
        $("#currentquiz").empty();
        formQuiz();
        fillFormQuiz(event.data);
    }
    
    function detailsQuestion(uri){
        requete = uri;
        fetch(requete)
        .then( response => {
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
            .append($('<input type="text" id="questionSelectionnee" value="' + repjson.title + '"><br>'))
            .append($('<input type="button" value="modify question">'));
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
        constructor(title){
            this.title = title;
        }
    }


    $("#tools #add").on("click", formQuiz);
    $('#tools #del').on('click', delQuiz);

    function formQuiz(isnew){
        $("#currentquiz").empty();
        $("#currentquiz")
            .append($('<div id="liste-questions">'))
            .append($('<div id="question">'))
        $("#currentquiz #liste-questions")
            .append($('<span>Questionnaire: <input type="text" id="questionnaire"><br></span>'))
            .append("<ul id='questions'></ul>")
            .append($('<input type="hidden" id="turi">'))
            .append($('<input type="button" value="modify quiz">'));
        $("#currentquiz #question")
            .append($('<span>Question<input type="text" id="question"><br></span>'))
            .append($('<input type="button" value="modify question">'));
        }

    function fillFormQuiz(t){
        $("#currentquiz #questionnaire").val(t.name);
        for (var i = 0; i < t.questions.length; i++){
            $("#currentquiz #questions")
            .append($('<li>')
            .append($('<a>')
            .text(t.questions[i]))
            .on("click", (function(question) {return function() {detailsQuestion(question);};})(t.questions[i]))
            );
        }

        $("#currentquiz #titre").val(t.title);
        $("#currentquiz #descr").val(t.description);
         t.uri=(t.uri == undefined)?"http://localhost:5000/todo/api/v1.0/tasks"+t.id:t.uri;
         $("#currentquiz #turi").val(t.uri);
        t.done?$("#currentquiz #done").prop('checked', true):
        $("#currentquiz #done").prop('checked', false);
    }

    function saveNewQuiz(){
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
