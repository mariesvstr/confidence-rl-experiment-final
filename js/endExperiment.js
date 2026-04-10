// console.log("----------------------------------- endExperiment.js -----------------------------------");

import { record_general_participant_info } from "./record_general_participant_info.js";

var endExperiment = {
  init: function (exp) {
    console.log(`--------------- endExperiment.init() ---------------`);

    // Compute total score 
    let final_points = exp.total_reward;

    console.log(`Final score: ${final_points} points`);

    // Record info about participant bonus, navigator, and task durations
    // Only if this function exists and is needed
    if (typeof record_general_participant_info === 'function') {
      record_general_participant_info(exp);
    }

    // Clear containers
    $('#ContBox').empty();
    $('#Bottom').empty();
    
    // IMPORTANT: Make ContBox visible
    document.getElementById("ContBox").className = "col-12 mt-3 visible";

    // Set up HTML structure
    let c_Stage = "<div class='row justify-content-center' id='Stage'></div>";
    let c_FinalButton = '<div class="col justify-content-center align-items-center" id="FinalButton"></div>';
    $("#ContBox").html(c_Stage + c_FinalButton);
    
    let final_points_text = final_points.toFixed(2);    

    // Create shortcut for text object
    let text = exp.text_end_experiment;
    
    // Fill in with text
    let EndText = `
      <div class="col">
        <h3 align="center" style="color: #3C455C;"><br>${text.title}</h3>
        <div class="col">
          <h3 align="center"><br></h3>
          <p align="center"><br>${text.text1}<br></p>
          <p align="center"><b>${text.text2} ${final_points_text} points.</b></p>
          <p align="center">${text.text3}</p><br><br>
        </div>
      </div>
    `;
    $("#Stage").html(EndText);
    
    let Buttons = `<div class="btn btn-default myBtn" style="background-color: #28a745;">Study complete – you can close this window</div>`;
    $("#FinalButton").html(Buttons);
  },
};

export { endExperiment };