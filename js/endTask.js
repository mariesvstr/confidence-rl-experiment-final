/** 
 * exports endTask() function
 * This function is called at the end of each task to reset the HTML structure and inform the participant that the task is finished.
 * It also updates the total reward in the exp object and allows the experiment_state_machine to move on to the next task.
 * */ 

import { move_on_to_next_experiment_state } from "./move_on_to_next_experiment_state.js";

function endTask(exp) {
  //debug
  // console.log(`---------------run endTask() ---------------`);

  // create shortcut for text object
  let text = exp.text_end_task;

  // reset changes to HTML structure made during task
  document.getElementById("Cont").style.maxWidth = null; // unset change made to general HTML layout during task
  document.getElementById("Cont").style.maxHeight = null; // unset change made to general HTML layout during task
  document.getElementById("ContBox").style.maxWidth = null; // unset change made to general HTML layout during task
  document.getElementById("ContBox").style.maxHeight = null; // unset change made to general HTML layout during task
  document.getElementById("ContBox").className = "col-12 mt-3 visible";
  
  document.getElementById("Top").innerHTML = ""; 
  document.getElementById("ContBox").innerHTML = ""; 
  document.getElementById("Cont2_row").innerHTML = ""; 

  // create HTML containers
  let container_Stage = "<div class = 'row justify-content-center' id = 'Stage'> </div>";
  let container_FinalButton =  "<div class = 'row justify-content-center' id = 'FinalButton'> </div>";
  $("#ContBox").html(container_Stage + container_FinalButton);

  
  // Inform that this task is finished + show the number of points
  // create HTML with text variables
  let EndText = `<p align = "center"><br> ${text.text2}<b>${exp.total_reward}</b>${text.text3}<br></p></div>`;
  let EndButton = `<div align="center"><input type="button"  class="btn btn-default myBtn" id="bEnd" value="${text.button}"></div>`;
  // add it to existing HTML containers
  $("#Stage").html( `<h4 class="row justify-content-center">${EndText}</h4>`);
  $("#FinalButton").html( `<div class="row justify-content-center">${EndButton} </div>` );

  // Inform the overall function (experiment_state_machine.js) that this task function is finished and that whatever is sheduled to be next, can now start
  // and update the total reward in exp (from CD1_ExpSettings.js) since it stores the data shared across tasks
  document.getElementById("bEnd").onclick = function () {
    $("#ContBox").empty();
    // call experiment_state_machine to start the next task
    move_on_to_next_experiment_state(1,exp); // calls experiment_state_machine with increment of 1
  }
}

export { endTask };
