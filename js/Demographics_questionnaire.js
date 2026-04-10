// console.log('----------------------------------- Questionnaires.js -----------------------------------')

import {makeInvisible,makeVisible,getDate,sleep,openFullscreen} from "./functions/usefulFunctions.js";
import {move_on_to_next_experiment_state} from "./move_on_to_next_experiment_state.js"; 
import {sendToDB} from "./functions/sendToDB.js";

function run_demographics_questionnaire(exp) {
  console.log(`------------------- run_demographics_questionnaire() ---------------------`);
  
  // make full screen
  openFullscreen();

  // set variables that come from "global" variable: exp
  const text = exp.text_demographics;

  // Define main containers needed for the task
  $('#ContBox').empty();
  $('#Bottom').empty();

  document.getElementById("ContBox").className = "col-12 mt-3 visible";
  
  let c_Stage = "<div class='row' id='Stage'></div>";
  $('#ContBox').html(c_Stage);

  // Build age options
  let ageOptions = '<option value="">- Select -</option>';
  for (let i = 18; i <= 80; i++) {
    ageOptions += `<option value="${i}">${i}</option>`;
  }

  // set grid structure in which to put stimuli
  let structure = `
  <div id="questionnaire_box">
    <!-- Intro -->
    <div class="titleInstruction">${text.title}</div>
    <div class="box justify-content-center">
      <p>${text.description1}</p>
      <p>${text.description2}</p>
    </div>
    
    <!-- Get age -->
    <div class="box justify-content-center">
      <p>
        <label for="age">${text.age}</label><br>
        <select name="age" id="age" style="font-size: 16px; padding: 5px; margin-top: 10px;">
          ${ageOptions}
        </select>
      </p>
    </div>
    
    <!-- Get gender -->
    <div class="box justify-content-center">
      <p>
        <label for="gender">${text.gender1}</label><br>
        <select name="gender" id="gender" style="font-size: 16px; padding: 5px; margin-top: 10px;">
          <option value="">- Select -</option>
          <option value="Female">${text.gender2}</option>
          <option value="Male">${text.gender3}</option>
          <option value="Other">${text.gender4}</option>
        </select>
      </p>
    </div>
    
    <!-- Error message -->
    <div id="errorMessage" style="color:red; text-align: center; margin-top: 20px;">${text.error}</div>
  </div>
  `;
  
  $("#Stage").html(structure);
  makeInvisible('errorMessage');

  // add submit button
  let SubmitBtn = `<div class="col centered_btn_container"> 
                     <input type="button" class="btn btn-default rounded myBtn" id="SubmitBtn" value="${exp.text_buttons.submit}"> 
                   </div>`;
  $("#Bottom").html(SubmitBtn);
  
  var btn = document.getElementById('SubmitBtn');
  btn.addEventListener('click', checkAnswers);

  function checkAnswers() {
    console.log('Checking demographics answers...');
    
    var a_age = document.getElementById("age").value;
    var a_gender = document.getElementById("gender").value;
    
    console.log('Age:', a_age, 'Gender:', a_gender);
    
    // check if values were submitted
    if (a_age === '' || a_gender === '') {
      console.log('Participant did not answer all questions');
      makeVisible('errorMessage');
    } else {
      console.log('All questions answered');
      
      // transform age type from string to int
      a_age = parseInt(a_age);
      
      // clear display
      $('#Stage').empty();
      $('#Bottom').empty();

      // transform dates to strings
      let date_start = exp.date_start.toLocaleString();
      
      if (!exp.test_mode_do_NOT_send_data) {
        sendToDB(0, {
          date_start: date_start,
          manual_ID: exp.manual_ID,
          prolific_ID: exp.prolific_ID,
          session_ID: exp.session_ID,
          exp_ID: exp.exp_ID,
          framing: exp.framing,
          framing_label: exp.framing === 1 ? 'BEST' : 'WORST',
          task_name: 'Demographics',
          age: a_age,
          gender: a_gender
        }, 'php/InsertDB_CD1_Demographics.php');
      }
      
      // Move to next state
      move_on_to_next_experiment_state(1, exp);  
    }
  }
}

export {run_demographics_questionnaire}