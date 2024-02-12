$(function() {

    $("#button").click(refreshQuizList);

    function remplirQuiz(repjson) {
      console.log(JSON.stringify(repjson));
      $('#liste-quiz').empty();
      $('#liste-quiz').append($('<ul>'));
      for(questionnaire of repjson.questionnaires){
          console.log(questionnaire);
          $('#liste-quiz ul')
                .append($('<li>')
                .append($('<a>')
                .text(questionnaire.name)
                    ).on("click", questionnaire, details)
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


    function details(event){
        $("#currentquiz").empty();
        formTask();
        fillFormTask(event.data);
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


    $("#tools #add").on("click", formTask);
    $('#tools #del').on('click', delTask);

    function formTask(isnew){
        $("#currentquiz").empty();
        $("#currentquiz")
            .append($('<span>Titre<input type="text" id="titre"><br></span>'))
            .append($('<span>Description<input type="text" id="descr"><br></span>'))
            .append($('<span>Done<input type="checkbox" id="done"><br></span>'))
            .append($('<span><input type="hidden" id="turi"><br></span>'))
            .append(isnew?$('<span><input type="button" value="Save Task"><br></span>').on("click", saveNewTask)
                         :$('<span><input type="button" value="Modify Task"><br></span>').on("click", saveModifiedTask)
                );
        }

    function fillFormTask(t){
        $("#currentquiz #titre").val(t.title);
        $("#currentquiz #descr").val(t.description);
         t.uri=(t.uri == undefined)?"http://localhost:5000/todo/api/v1.0/tasks"+t.id:t.uri;
         $("#currentquiz #turi").val(t.uri);
        t.done?$("#currentquiz #done").prop('checked', true):
        $("#currentquiz #done").prop('checked', false);
    }

    function saveNewTask(){
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

    function saveModifiedTask(){
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

    function delTask(){
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
