/*
This script exports 2 functions used to run the comprehension quizzes following the instruction for the Learning Task and Pair Choice task respectively
- Quiz_LearningTask()
- Quiz_PairChoice()
Each function creates HTML to display the quiz, including a Submit button, and evaluates the answers following submission. 
If answers are incorrect participants are brought back to the beginning of the instructions.
*/
import {move_on_to_next_experiment_state} from "./move_on_to_next_experiment_state.js";
import {openFullscreen} from "./functions/usefulFunctions.js";

function Quiz_LearningTask(exp) {

  // Select text based on framing (BEST or WORST)
  // CHANGEMENT ICI : au lieu de exp.click_desired, on utilise exp.text_LT_current
  let text = exp.text_LT_current.text_quiz;
  
  // debug
  //console.log(`-------------- Quiz_LearningTask ---------------`)
  
  // make full screen
  openFullscreen()

  // Define main HTML containers needed for the quiz
  $('#ContBox').empty();
  let c_Stage =  "<div class='row' id='Stage'> </div>";
  $('#ContBox').html(c_Stage);
     
  // set grid structure in which to put stimuli
  let structure =  // Intro
                  '<div class="titleInstruction">'+text.intro_title+'</div>'+
                  '<div class="box justify-content-center" id="LTquiz_intro">'+
                    '<p>'+text.intro1+'</p>'+
                    '<p>'+text.intro2+'</p>' +
                  '</div>'+

                  // Question 1
                  '<div class="box justify-content-center LTQuiz" id="LTquiz_Q1">'+
                    '<h4>QUESTION 1</h4>'+
                    '<p>'+text.q1_1+'</p>'+
                  '<div class="imageInstruction justify-content-center"> <img src='+text.path_img_1+' class = "img-fluid"> </div>'+ 
                  '<p>'+text.q1_2+'</p>'+
                  '</div>'+
                  // Text input 1
                  '<div class="box justify-content-center" id="LTquiz_R1">'+ 
                    '<p>'+text.q1_3+'</p>'+
                    text.answerBox+'<input type="text" class="quiz_textbox" id ="LTQuiz_input1"> </input> </p>'+
                  '</div>'+

                  // Question 2
                  '<div class="box justify-content-center LTQuiz" id="LTquiz_Q2">'+
                    '<h4>QUESTION 2</h4>'+
                    '<p>'+text.q2_1+'</p>'+
                    '<div class="imageInstruction justify-content-center"> <img src='+text.path_img_2+' class = "img-fluid"> </div>'+ 
                    '<p>'+text.q2_2+'</p>'+
                  '</div>'+
                  // Text input 2
                  '<div class="box justify-content-center" id="LTquiz_R2">'+ 
                    '<p>'+text.q2_3+'</p>'+
                    text.answerBox+'<input type="text" class="quiz_textbox" id ="LTQuiz_input2"> </input> </p>'+
                  '</div>'+

                  // Question 3
                  '<div class="box justify-content-center LTQuiz" id="LTquiz_Q3">'+
                    '<h4>QUESTION 3</h4>'+
                    '<p>'+text.q3_1+'</p>'+
                    '<div class="imageInstruction justify-content-center"> <img src='+text.path_img_3+' class = "img-fluid"> </div>'+ 
                    '<p>'+text.q3_2+'</p>'+
                  '</div>'+
                  // Text input 3
                  '<div class="box justify-content-center" id="LTquiz_R3">'+ 
                    '<p>'+text.q3_3+'</p>'+
                    text.answerBox+'<input type="text" class="quiz_textbox" id ="LTQuiz_input3"> </input> </p>'+
                  '</div>'+
                  
                  // Question 4
                  '<div class="box justify-content-center LTQuiz" id="LTquiz_Q4">'+
                    '<h4>QUESTION 4</h4>'+
                    '<p>'+text.q4_1+'</p>'+
                  '<div class="imageInstruction justify-content-center"> <img src='+text.path_img_4+' class = "img-fluid"> </div>'+ 
                  '<p>'+text.q4_2+'</p>'+
                  '</div>'+
                  // Radio buttons                  
                  '<div class="box  justify-content-center LT_radio_btn_container" id="LTquiz_R4">'+ 
                      '<div > <input type="radio" name="LTquiz_q4" value="1" />  <label for="LTquiz_btn1">   +1.00 ECU   </label> </div>'+  
                      '<div > <input type="radio" name="LTquiz_q4" value="2" />  <label for="LTquiz_btn1">   -0.10 ECU   </label> </div>'+
                      '<div > <input type="radio" name="LTquiz_q4" value="2" />  <label for="LTquiz_btn1">   -1.00 ECU   </label> </div>'+
                      '<div > <input type="radio" name="LTquiz_q4" value="2" />  <label for="LTquiz_btn1">   +0.10 ECU   </label> </div>'+
                      '<div class="row justify-content-center"> </div>'+
                  '</div>'
                  
                  

  // add submit button, when pressed leads to checkAnswers()
  let SubmitBtn = `<div class="col centered_btn_container" <div class="col centered_btn_container">
                     <input type="button" class="btn btn-default m-2 rounded myBtn" id="SubmitBtn" value=${exp.text_buttons.submit}>
                  </div>
                  `;
  // add quiz and submit button to existing HTML containers
  $("#Stage").append(structure + SubmitBtn );
  // add event listener to submit button
  let btn = document.getElementById('SubmitBtn');
  btn.addEventListener('click', checkAnswers);

  // checkAnswers() checks whether all answers are correct, if so, move on to task, if not, go back to instructions
  function checkAnswers() {

    // process answers to each question
    // text boxes (Question 1, 2, 3)
    let input_1 = (document.getElementById("LTQuiz_input1").value).toLowerCase();
    let input_2 = (document.getElementById("LTQuiz_input2").value).toLowerCase();
    let input_3 = (document.getElementById("LTQuiz_input3").value).toLowerCase();
    //console.log(` input_1 = ${input_1} (correct: s); input_2 = ${input_2} (correct: s); input_3 = ${input_3} (correct: k)`)
    // radio buttons (Question 4)
    const radioButtons4 = document.querySelectorAll("input[name='LTquiz_q4']");
    let input_4;
    for (const btn of radioButtons4) {
        if (btn.checked) {
          input_4 = btn.value;
          //console.log(`radioButton (value = ${input_4}) is checked`)
          break;
        }
    }

    // empty HTML containers (now that no longer need raw response variables)
    $('#Stage').empty(); 

    if (input_1 == 's' && input_2 == 's' && input_3 == 'k' && input_4 == "1") {
      //console.log(`all answers correct`)      
      // create HTML for feedback
      let structure_Correct = `<div class="box justify-content-center"> 
                                <p>${text.feedbackCorrect}</p>
                              </div>
                              `;
      // create HTML for button                        
      let start_btn = `<div class="row centered_btn_container">
                        <input type="button" class="btn btn-default m-2 rounded myBtn" id="StartTask" value=${exp.text_buttons.start}>
                      </div>
                      `;
      // add feedback and start button to existing HTML containers                
      $("#Stage").append(structure_Correct + start_btn);
      // add listener to button
      let get_start_btn= document.getElementById('StartTask');
      get_start_btn.addEventListener('click', goToTask);

      function goToTask() {
        // empty HTML containers
        $('#Stage').empty();
        // move on to next step in experiment
        move_on_to_next_experiment_state(1,exp); // calls experiment_state_machine with increment of 1
      }

    } else {
      //console.log(`NOT all answers correct`)
      // create HTML for feedback
      let structure_Incorrect =   `<div class="box justify-content-center">
                                    <p>${text.feedbackIncorrect}</p>
                                  </div>
                                  `;
      // create HTML for button                        
      let review_btn = `<div class="col centered_btn_container">
                          <input type="button" class="btn btn-default m-2 rounded myBtn" id="ReviewInstructions" value=${text.button_review}>
                        </div>
                        `;
      // add feedback and button to existing HTML containers   
      $("#Stage").append(structure_Incorrect + review_btn);     

      // add listener to button
      let get_review_btn = document.getElementById('ReviewInstructions');
      get_review_btn.addEventListener('click', goToInstructions);

      function goToInstructions() {
        // empty HTML containers
        $('#Stage').empty();
        // return to previous step in experiment
        move_on_to_next_experiment_state(-1,exp); // calls experiment_state_machine with increment of 1
      }
    }
  }
}



function Quiz_PairChoice(exp) {
  // debug
  //console.log(`-------------- Quiz_PairChoice ---------------`)
  // make full screen
  openFullscreen()

  // select language file to be used given the current version
  let text
  if (exp.identify_best==0){
    text = exp.text_PC_identify_best_0.text_quiz;
  } else { // exp.identify_best==1
    text = exp.text_PC_identify_best_1.text_quiz;
  }

  // Define main HTML containers
  $('#ContBox').empty();
  let c_Stage =  "<div class = 'row' id = 'Stage'> </div>";
  $('#ContBox').html(c_Stage);
     
  // create HTML with quiz content
  let structure = // Intro
                  '<div class="titleInstruction">'+text.intro_title+'</div>'+
                  '<div class="box justify-content-center" id="`PCquiz_intro">'+
                    '<p>'+text.intro1+'</p>'+
                    '<p>'+text.intro2+'</p>' +
                  '</div>'+

                 // PART 1
                 // Question 1
                 '<div class="box justify-content-center LTQuiz" id="PCquiz_Q1"> <br>'+
                   '<h4>PART 1</h4>'+
                   '<p>'+text.q1_2+'</p>'+
                   '<p>'+text.q1_3+'</p>'+
                 '<div class="imageInstruction justify-content-center"> <img src='+text.path_img_1+' class = "img-fluid PCquiz_img2"> </div>'+  
                 '</div>'+
                 // provide answer: text box  
                 '<div class="box justify-content-center">'+ 
                   '<p>'+text.q1_4+'</p>'+
                   '<p>'+text.answerBox+'<input type="text" class="quiz_textbox" id ="PC_quiz_input_1"> </input> </p>'+
                 '</div>' +

                  // Question 2 
                  '<div class="box justify-content-center LTQuiz" id="PCquiz_Q2"> <br>'+
                    '<p>'+text.q2_1+'</p>'+
                  '</div>'+
                  // provide answer: text box  
                  '<div class="box justify-content-center">'+ 
                    '<p>'+text.q2_2+'</p>'+
                    '<p>'+text.answerBox+'<input type="text" class="quiz_textbox" id ="PC_quiz_input_2"> </input> </p>'+
                  '</div>' +

                  // Question 3 
                    '<div class="box justify-content-center LTQuiz" id="PCquiz_Q3"> <br>'+
                    '<p>'+text.q3_1+'</p>'+
                  '</div>'+
                  // provide answer: text box  
                  '<div class="box justify-content-center">'+ 
                    '<p>'+text.q3_2+'</p>'+
                    '<p>'+text.answerBox+'<input type="text" class="quiz_textbox" id ="PC_quiz_input_3"> </input> </p>'+
                  '</div>' +

                  // PART 2
                  // Question 4
                  '<div class="box justify-content-center LTQuiz" id="PCquiz_Q4"> <br>'+
                    '<h4>PART 2</h4>'+
                    '<p>'+text.q4_2+'</p>'+
                    '<p>'+text.q4_3+'</p>'+
                    '<div class="imageInstruction justify-content-center"> <img src='+text.path_img_2+' class = "img-fluid PCquiz_img2"> </div>'+  
                  '</div>'+             
                    // provide answer: text box   
                  '<div class="box justify-content-center">'+ 
                    '<p>'+text.q4_4+'</p>'+
                    '<p>'+text.answerBox+'<input type="text" class="quiz_textbox" id ="PC_quiz_input_4"> </input> </p>'+
                  '</div>'+

                  // Question 5 
                  '<div class="box justify-content-center LTQuiz" id="PCquiz_Q5"> <br>'+
                    '<p>'+text.q5_1+'</p>'+
                  '</div>'+
                  // provide answer: text box  
                  '<div class="box justify-content-center">'+ 
                    '<p>'+text.q5_2+'</p>'+
                    '<p>'+text.answerBox+'<input type="text" class="quiz_textbox" id ="PC_quiz_input_5"> </input> </p>'+
                  '</div>' +

                  // Question 6                
                  '<div class="box justify-content-center LTQuiz" id="PCquiz_Q6"> <br>'+
                    '<p>'+text.q6_1+'</p>'+
                  '</div>'+
                  // provide answer: text box  
                  '<div class="box justify-content-center">'+ 
                    '<p>'+text.q6_2+'</p>'+
                    '<p>'+text.answerBox+'<input type="text" class="quiz_textbox" id ="PC_quiz_input_6"> </input> </p>'+
                  '</div>' +
                
                  // PART 3
                  // Question 7 
                  '<div class="box justify-content-center LTQuiz" id="PCquiz_Q1"> <br>'+
                    '<h4>PART 3</h4>'+
                    '<p>'+text.q7_1+'</p>'+             
                  '</div>'+
                  // provide answer: buttons  
                  '<div class="box justify-content-center" id="">'+ //create grid
                    '<div > <input type="radio" name="PCquiz_btn7" value="1" />  <label for="PCquiz_btn1"> <strong>Option A</strong>:'+text.q7_2+'</label> </div>'+  
                    '<div > <input type="radio" name="PCquiz_btn7" value="2" />  <label for="PCquiz_btn1"> <strong>Option B</strong>:'+text.q7_3+'</label>  </div>'+
                  '</div>'+
                    
                  // PART 4
                  // Question 8
                  '<div class="box justify-content-center LTQuiz" id="8"> <br>'+
                    '<h4>PART 4</h4>'+
                    '<p>'+text.q8_1+'</strong></p>'+
                  '<div class="imageInstruction justify-content-center"> <img src='+text.path_img_6+' class = "img-fluid PCquiz_img2"> </div>'+
                  '</div>'+
                  // provide answer: text box
                  '<div class="box justify-content-center">'+
                    '<p>'+text.q8_2+'</p>'+
                    '<p>'+text.answerBox+'<input type="text" class="quiz_textbox" id ="PC_quiz_input_8"> </input> </p>'+
                  '</div>' 
                  
  // create HTML for button
  // add submit button, when pressed leads to checkAnswers()
  let SubmitBtn = `<div class="col centered_btn_container">
                     <input type="button" class="btn btn-default m-2 rounded myBtn" id="SubmitBtn" value=${exp.text_buttons.submit}>
                  </div> `;
  // add quiz content and button to existing HTML containers
  $("#Stage").append(structure + SubmitBtn );
  // add event listener to submit button
  let btn = document.getElementById('SubmitBtn');
  btn.addEventListener('click', checkAnswers);

  // checkAnswers() checks whether all answers are correct, if so, move on to task, if not, go back to instructions
  function checkAnswers() {
    //console.log(`function checkAnswers()`)

    // event listener for buttons in Question 7
    const radioButtons7 = document.querySelectorAll("input[name='PCquiz_btn7']");
    let selectedButton_Q7;
    for (const radioButton7 of radioButtons7) {
        if (radioButton7.checked) {
          selectedButton_Q7 = radioButton7.value;
          //console.log(`radioButton (value = ${selectedButton_Q7}) is checked`)
          break;
        }
    }

    // event listeners for text box
    let input_1 = (document.getElementById("PC_quiz_input_1").value).toLowerCase();
    let input_2 = (document.getElementById("PC_quiz_input_2").value).toLowerCase();    
    let input_3 = (document.getElementById("PC_quiz_input_3").value).toLowerCase();    
    let input_4 = (document.getElementById("PC_quiz_input_4").value).toLowerCase();    
    let input_5 = (document.getElementById("PC_quiz_input_5").value).toLowerCase();
    let input_6 = (document.getElementById("PC_quiz_input_6").value).toLowerCase();
    let input_8 = (document.getElementById("PC_quiz_input_8").value).toLowerCase();

    $('#Stage').empty();

    // check if input to event listeners are correct
    if ( input_1 == 's' && input_2 == 9 && input_3 == 0 && input_4 == 'k' && input_5 == 9 && input_6 == 0 && selectedButton_Q7 == 1 && input_8 == 'k') {
      console.log(`all answers correct`)
      // create HTML for feedback
      let structure_Correct = `<div class="box justify-content-center"> 
                                <p>${text.feedbackCorrect}</p>
                              </div>
                              `;
      // create HTML for button                        
      let start_btn = `<div class="row centered_btn_container">
                        <input type="button" class="btn btn-default m-2 rounded myBtn" id="StartTask" value=${exp.text_buttons.start}>
                      </div>
                      `;
      // add feedback and start button to existing HTML containers                
      $("#Stage").append(structure_Correct + start_btn);
      // add listener to button
      let get_start_btn= document.getElementById('StartTask');
      get_start_btn.addEventListener('click', goToTask);
      function goToTask() {
        $('#Stage').empty();
        // move on to next step in the experiment
        move_on_to_next_experiment_state(1,exp); // calls experiment_state_machine with increment of 1
      }

    } else {
      //console.log(`NOT all answers correct`)

      // create HTML for feedback
      let structure_Incorrect =   `<div class="box justify-content-center">
                                    <p>${text.feedbackIncorrect}</p>
                                  </div>
                                  `;
      // create HTML for button                        
      let review_btn = `<div class="col centered_btn_container">
                        <input type="button" class="btn btn-default m-2 rounded myBtn" id="ReviewInstructions" value=${text.button_review}>
                      </div>
                      `;
      // add feedback and button to existing HTML containers   
      $("#Stage").append(structure_Incorrect + review_btn);             
      // add listener to button
      let get_review_btn = document.getElementById('ReviewInstructions');
      get_review_btn.addEventListener('click', goToInstructions);
      function goToInstructions() {
        $('#Stage').empty();
        // return to previous step in experiment
        move_on_to_next_experiment_state(-1,exp); // calls experiment_state_machine with increment of -1
      }
    }
  }
}



export{Quiz_LearningTask, Quiz_PairChoice}
