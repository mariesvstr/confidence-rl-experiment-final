// console.log('----------------------------------- CD1_startExperiments.js -----------------------------------')

// this script exports functions used to start the first few steps of the task: getID(), checkCompatibility(), displayConsent()
import {move_on_to_next_experiment_state} from "./move_on_to_next_experiment_state.js";
import {checkIsMobile} from "./functions/usefulFunctions.js";     

function checkCompatibility(exp){
  // console.log(`--------------------  checkCompatibility() --------------------`)
  // if (navigator.maxTouchPoints)
  // check that participants are not on mobile

  let isMobile = false
  isMobile = checkIsMobile()
  
  if (isMobile) {
    // console.log(`using mobile/tablet: ${isMobile}`)
    let Prompt =   '<div class="form-group"> <p><strong> Due to technical requirements, this task cannot be done on phones, tablets, or computers with touchscreens.</strong></p>  </div>'
    $('#Stage').html(Prompt);
  } else {
    // move on to next step in experiment
    move_on_to_next_experiment_state(1,exp);
  } 
}

function getID(exp) {
  // console.log(`--------------------  getID() --------------------`)

  // Define main containers needed
  let c_Stage =  "<div class = 'row justify-content-center mt-4' id = 'Stage'> </div>";
  let c_Buttons =  "<div class = 'row justify-content-center' id = 'GameButton'> </div>";

  $('#ContBox').html(c_Stage+c_Buttons);

  let Prompt =  '<form >'+
              '<div class="form-group">'+
              '<label for="formPartID">'+ exp.text_start_experiment.getID_title +'</label>'+
              '<input type="text" class="form-control" id="formPartID" placeholder="' + exp.text_start_experiment.getID_description + '" maxlength="24" style="width: 27ch;">'+
              '<div class="invalid-feedback"> '+ exp.text_start_experiment.getID_error +' </div>'+
              '</div>'+
              '<form>';

  let Buttons = '<input align="left" type="button"  class="btn btn-default rounded myBtn" id="bStart" value="'+ exp.text_buttons.continue +'">';

  $('#Stage').html(Prompt);
  $('#GameButton').html(Buttons);

  // if going through Prolific, can get Prolific ID from URL
	let params = new URLSearchParams(location.search);
  if (params.has("PROLIFIC_PID")) {
    // update prolific ID in exp variable
    exp.prolific_ID = params.get('PROLIFIC_PID');
    exp.session_ID = params.get('SESSION_ID');
    // fill in automatically if URL parameters provide prolific ID
    document.getElementById('formPartID').value = exp.prolific_ID;
  }

  $('#bStart').click(function() {
                                  if(document.getElementById('formPartID').value.length===24){
                                    exp.manual_ID = document.getElementById('formPartID').value;
                                    $('#ContBox').empty();
                                    // move on to next step in experiment
                                    move_on_to_next_experiment_state(1,exp);
                                  } else { 
                                    formPartID.classList.add('is-invalid');
                                  }
  })
}

function displayConsent(exp) {

  // console.log('----------------------------------- displayConsent -----------------------------------');

  //exp.times[0] = (new Date()).getTime() - exp.initTime;
  
  $('#ContBox').empty();
  let c_Stage =  "<div class = 'row' id = 'Stage'> </div>";
  let c_Buttons =  "<div class = 'row justify-content-center' id = 'GameButton'> </div>";

  $('#ContBox').html(c_Stage+c_Buttons);

 let structure = '' + exp.text_start_experiment.consent_text + 
                  // checkbox 1
                  '<input type="checkbox" id="age-checkbox">'+
                  '<label for="age-checkbox" id="age-label"> <strong>'+exp.text_start_experiment.age_checkbox+'</strong></label><br>'+
                  // checkbox 2
                  '<input type="checkbox" id="voluntary-checkbox">'+
                  '<label for="read-checkbox" id="voluntary-label"><strong>'+exp.text_start_experiment.voluntary_checkbox+'</strong></label><br>'+
                  // checkbox 3
                  '<input type="checkbox" id="rights-checkbox">'+
                  '<label for="consent-checkbox" id="rights-label"><strong>'+exp.text_start_experiment.consent_checkbox+'</strong></label><br></br>'

 let Buttons = '<div align="col m-5"><input align="left" type="button"  class="btn btn-default rounded myBtn" id="bStart" value="'+ exp.text_buttons.start +'"></div>';


$("#Stage").append(structure);
  
$('#GameButton').html(Buttons);

$('#bStart').click(function() {
  if ($("input:checkbox:not(:checked)").length > 0) {
    let structure_Incorrect =   '<div class="box justify-content-center">'+  
    '<p class="errorText" >'+exp.text_start_experiment.errorMsg+'</p>'+
      '</div>'
    $("#Stage").append(structure_Incorrect);
  } else {
      $('#ContBox').empty();
      // move on to next step in experiment
      move_on_to_next_experiment_state(1,exp);
  }
})

}
export {checkCompatibility,getID,displayConsent}
