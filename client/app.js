$(document).ready(function(){
  $('#task-submit-form').on('submit', submitTask);
  $('.list').on('click', '.delete', deleteTask);
  $('.list').on('click', '.complete', completeTask);
  getAllTasks();
});

function submitTask(event){
  event.preventDefault();
  var task = {};
  $.each($("#task-submit-form").serializeArray(), function(i, field) {
    task[field.name] = field.value;
  });
  $.ajax({
    type:"POST",
    url: "/task",
    data: task,
    success: function(data){
      console.log(data[0]);
      getAllTasks();
    }
  });
}

function getAllTasks(){
  $.ajax({
    type:"GET",
    url: "/task",
    success: function(data){
      displayAllTasks(data);
    }
  });
}

function displayAllTasks(data){
  var taskAtHand;
  var completedTaskArray = [];
  $('.list').empty();
  for(var i = 0; i < data.length; i++){
    taskAtHand = data[i];
    if(taskAtHand.task_complete){
      completedTaskArray.push(taskAtHand);
    } else{
      appendTasks(taskAtHand);
    }
  }
  completedTaskArray.forEach(appendTasks);
}

function appendTasks(taskAtHand){
  $('.list').append('<div class="task"></div>');
  var $el = $('.list').children().last();
  $el.data("id",taskAtHand.id);
  $el.append('<h2>Task: ' + taskAtHand.task_name + '<span class="task-buttons"><button class="delete btn">Delete</button></span>' + '</h2>');
  $el.append('<p>Description: ' + taskAtHand.task_description + '</p>');
  if (taskAtHand.task_complete){
    $el.addClass("completed");
  } else{
    $el.children().first().children().prepend('<button class="complete btn">Completed</button>');
  }

}

function deleteTask(){
  var sendingObj = {};
  var $el = $(this).parent().parent().parent();
  sendingObj.deleteId = $el.data("id");
  if(confirm("Are you sure you sure you would like to delete this task?")){
      $.ajax({
        type: "DELETE",
        url: "/task",
        data: sendingObj,
        success: function(data){
            $el.slideUp(500, function(){$el.remove();});
        }
      });
  }

}
function completeTask(){
  var sendingObj = {};
  var $el = $(this).parent().parent().parent();
  sendingObj.completeId = $el.data("id");

  $.ajax({
    type: "PUT",
    url: "/task",
    data: sendingObj,
    success: function(){
      $el.fadeOut(500,function(){ $el.addClass("completed"); }).fadeIn(500);
    }
  });
}
