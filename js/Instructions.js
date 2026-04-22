/**
 * Includes several functions:
 *  - create_instructions_for_task()
 *      - creates specific instructions objects for each task and fills them with the text appropriate for the current experiment version.
 *  - showInstructions() 
 *      - helper function
 *      - displays HTML/text stored in instructions object, page by page.
 *  - Instructions class
 *      - helper function
 *      - includes constructor function init(): initializes the instructions object and sets up the main containers needed for the task.
 * 
 */

import { openFullscreen } from "./functions/usefulFunctions.js";
import { move_on_to_next_experiment_state } from "./move_on_to_next_experiment_state.js";


// console.log('----------------------------------- Instructions.js -----------------------------------')


function create_instructions_for_task(exp, task_name){
  /* 
  GOAL
   Creates instances/objects of the Instructions class for each task and fills them with the text appropriate for the current experiment version.
  INPUT
  - exp variable containing info about current experiment version
  - all language files relevant for the instructions
  OUTPUT
  - instruction object for a specific task (instance of the class Instructions), which contains pages and buttons
  */

  // Select text based on framing (BEST or WORST)
  // exp.text_LT_current has already been assigned in Main.js based on exp.framing
  var text_LT_instructions = exp.text_LT_current.text_instructions;

  var task_instructions_object;
  
  if (task_name == "LearningTask") {
    task_instructions_object = new Instructions({
      text_instructions: text_LT_instructions, 
      text_button_next: exp.text_buttons.next, 
      text_button_back: exp.text_buttons.back, 
      text_button_start: exp.text_buttons.start
    });
  } else {
    console.log('The task name "' + task_name + '" is not associated with a set of instructions yet. Check the spelling?');
  }
  
  return task_instructions_object;
}

export {create_instructions_for_task}


// ---------------------------- helper functions ----------------------------


export class Instructions {
  constructor({
    text_instructions,
    text_button_next,
    text_button_back,
    text_button_start,
  } = {}) {
    this.text_instructions = text_instructions;
    this.text_button_next = text_button_next; // text to display on the next button
    this.text_button_back = text_button_back; // text to display on the back button
    this.text_button_start = text_button_start; // text to display on the final (start) button
  }

  init(exp) {
    document.getElementById("ContBox").className = "col-12 mt-3 visible";
    // Define main containers needed for the task
    $("#ContBox").empty();
    let c_Stage = "<div class = 'row' id = 'Stage'> </div>";
    $("#ContBox").html(c_Stage);
    //Add button container
    var btn_container = '<div class="extremities_btn_container"></div>';
    $("#Bottom").html(btn_container);
    //Add buttons
    var buttonNext =
      '<div class="right-wrapper"><input align="center" type="button"  class="btn btn-default invisible myBtn" id="bNext" value=' +
      this.text_button_next +
      "></div>";
    var buttonBack =
      '<div class="left-wrapper" ><input align="center" type="button"  class="btn btn-default invisible myBtn" id="bBack" value=' +
      this.text_button_back +
      "></div>";

    $(".extremities_btn_container").html(buttonBack + buttonNext);

    let instructions_object = this;

    showInstructions(0, instructions_object, exp);
  }
}


function showInstructions(page, instructions_object, exp) {
  /* 
  GOAL
  - displays HTML/text stored in instructions instructions_object, page by page
  - creates buttons to navigate through the pages 
  - at the end, calls move_on_to_next_experiment_state() which calls main controlling function : experiment_state_machine 
  
  INPUT
  - page number with which to start
  - Instructions instructions_object (instance of the class above)
  - exp instructions_object, in order to use it as an input when call move_on_to_next_experiment_state()

  OUTPUT
  - just impacts display
  */

  // make full screen
  // openFullscreen()

  let new_text_instructions = "";
  // loop through existing text/HTML and wrap it in new HTML
  for (let i = 0; i < instructions_object.text_instructions[page].length; i++) {
    if (/img/i.test(instructions_object.text_instructions[page][i]) == 1) {
      // if there is an image
      new_text_instructions =
        new_text_instructions +
        '<ul class="no-bullets">' +
        instructions_object.text_instructions[page][i] +
        "</ul>";
    } else {
      // if there is no image
      /*
      new_text_instructions =
        new_text_instructions +
        "<li>" +
        instructions_object.text_instructions[page][i] +
        "</li>";
      */
      new_text_instructions =
        new_text_instructions +
        '<ul class="no-bullets">' +
        instructions_object.text_instructions[page][i] +
        "</ul>";
    }
  }
  $("#Stage").html(
    '<div class="col"><ul>' + new_text_instructions + "</ul></div>"
  );

  // When to display "back" button - only if there is a page to go back to
  if (page == 0) {
    document.getElementById("bBack").className =
      "btn btn-default m-2 rounded  invisible myBtn";
  } else if (page > 0) {
    document.getElementById("bBack").onclick = function () {
      $("#Stage").empty();
      showInstructions(page - 1, instructions_object, exp);
    };
    document.getElementById("bBack").value = instructions_object.text_button_back;
    document.getElementById("bBack").className =
      "btn btn-default m-2 rounded  visible myBtn";
  }

  // When to display "next" button - only if there is a next page to go to
  if (page < instructions_object.text_instructions.length - 1) {
    document.getElementById("bNext").onclick = function () {
      $("#Stage").empty();
      showInstructions(page + 1, instructions_object, exp);
    };
    document.getElementById("bNext").value = instructions_object.text_button_next;
    document.getElementById("bNext").className = "btn btn-default m-2 rounded  visible myBtn";
    // When to display "start" button - if reach the end of the instructions (so before starting actual task)
  } else if (page == instructions_object.text_instructions.length - 1) {
    document.getElementById("bNext").className = "btn btn-default m-2 rounded  visible myBtn";
    document.getElementById("bNext").value = instructions_object.text_button_start;
    document.getElementById("bNext").onclick = function () {
      // end instructions
      document.getElementById("bNext").className = "btn btn-default m-2 rounded  invisible myBtn";
      $("#Stage").empty();
      $("#ContBox").empty();
      $("#Bottom").empty();
      // move on to next step in the experiment
      move_on_to_next_experiment_state(1, exp);
    };
  }
}
