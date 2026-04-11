// CD1_LearningTask.js - COMPLETE VERSION WITH SEPARATED DISPLAYS
// console.log('----------------------------------- CD1_LearningTask.js -----------------------------------')
import {getRandomIntInclusive, makeInvisible, makeVisible, getDate, sleep, openFullscreen} from "./functions/usefulFunctions.js";
import {sendToDB} from "./functions/sendToDB.js";
import {create_eight_symbols, create_four_symbols, create_two_cues} from "./loadSymbols.js"; 
import {get_schedule_LearningTask, get_schedule_practice_round_LearningTask} from "./create_pair_schedules.js"; 
import {addXOverlay, addXOverlayToContainer, removeXOverlayFromContainer} from "./functions/add_X_overlay.js";
import {move_on_to_next_experiment_state} from "./move_on_to_next_experiment_state.js";
import {experiment_state_machine} from "./experiment_state_machine.js";

// ============================================================================
// LEARNING TASK OBJECT - WITH MATCHING PROBABILITY
// ============================================================================

let CD1_LearningTask = {
    text: [], // text to display during task
    trial_state: "", // tracks current state of the trial
    
    // -------------------- TASK-LEVEL SETTINGS --------------------
    settings: { 
      task_name: 'LearningTask',
      n_trials_per_pair_by_session: [10, 12, 12], // practice: 10, real1: 12, real2: 12
      n_sessions: 3, // 0 = practice, 1-2 = real tasks
      max_response_time_MS: 3000,
      feedback_time_MS: 2000,
      timeout_time_MS: 2500,
      border_time_MS: 1000,
      transition_time_MS: [500, 500],
      stimulus_presentation_time_MS: [2500, 2500],
      mask_time_MS: [0, 0],
      cue_time_MS: 2000,
      // Confidence rating settings
      confidence_display_time_MS: 99999,
      confidence_min: 50,
      confidence_max: 100,
      confidence_step: 5,
      // Outcome values
      best_outcome_GAIN: +1.00,
      worst_outcome_GAIN: +0.10,
      best_outcome_LOSS: -0.10,
      worst_outcome_LOSS: -1.00,
      maximum_outcome_probability: 0.75,
      // **Matching Probability settings**
      MP_bonus_per_session: 5, // 5 points per session
      MP_display_time_MS: 5000,
      // **Starting bonus**
      starting_bonus: 20,
    },
    
    // -------------------- SESSION-LEVEL INFORMATION --------------------
    cues: {},
    symbols: {},
    n_trials_per_session: 6666,
    session: 0,
    
    // -------------------- TRIAL-LEVEL INFORMATION --------------------
    schedule: [],
    trial: 0,
    trial_per_cycle: 0,
    isbottom: _.shuffle([0, 1]),
    isright: _.shuffle([0, 1]),
    feedback_type: '6666',
    is_gain_trial: 6666,
    feedback_color: '6666',
    key_top: '6666',
    key_bottom: '6666',
    response_key: '6666',
    responded_bottom: 6666,
    
    // Response-related information
    symbol_chosen_id: 6666,
    symbol_chosen_imageID: 6666,
    symbol_chosen_probability_best_outcome: 6666,
    symbol_chosen_best_outcome: 6666,
    symbol_chosen_worst_outcome: 6666,
    symbol_chosen_outcome: 6666,
    symbol_unchosen_id: 6666,
    symbol_unchosen_imageID: 6666,
    symbol_unchosen_probability_best_outcome: 6666,
    symbol_unchosen_best_outcome: 6666,
    symbol_unchosen_worst_outcome: 6666,
    symbol_unchosen_outcome: 6666,
    timestamp_response_countdown: 6666,
    rt: 6666,
    timeout: 6666,
    chose_highest_expected_value: 6666,
    trial_reward: 6666,
    total_reward: 0,
    is_correct_array: [],
    
    // **Track points at start of session**
    session_start_reward: 0,
    
    // -------------------- CONFIDENCE RATING INFORMATION --------------------
    confidence_rating: 6666,
    confidence_rt: 6666,
    timestamp_confidence_start: 6666,
    
    // **MATCHING PROBABILITY STORAGE**
    session_trials_data: [],
    
    // -------------------- INITIALIZATION FUNCTION --------------------
    init: function(exp) {
      console.log(`--------------------  CD1_LearningTask init() --------------------`);
      
      openFullscreen();
      
      let LT = this;
      
      // Select text based on framing
      LT.text = exp.text_LT_current.text_task;
      LT.text_confidence = exp.text_confidence_current;
      
      // Record framing condition
      LT.framing = exp.framing;
      
      // **Initialize MP tracking in exp if not already done**
      if (!exp.MP_trials_selected) {
        exp.MP_trials_selected = [];
        exp.MP_results = [];
        exp.MP_total_bonus_earned = 0;
      }
      
      // **Initialize total_reward with starting bonus**
      LT.total_reward = exp.starting_bonus || LT.settings.starting_bonus || 20;
      exp.total_reward = LT.total_reward;
      console.log(`💰 Starting with ${LT.total_reward} bonus points`);
      
      // **Save starting points for this session**
      LT.session_start_reward = LT.total_reward;
      
      // Create practice session symbols (4 symbols: 1 gain pair, 1 loss pair)
      let symbol_image_file_number = LT.session;
      LT.symbols = create_four_symbols(
        LT.settings.best_outcome_GAIN, 
        LT.settings.worst_outcome_GAIN, 
        LT.settings.best_outcome_LOSS, 
        LT.settings.worst_outcome_LOSS, 
        LT.settings.maximum_outcome_probability, 
        symbol_image_file_number
      );
      
      // Create schedule for current session
      LT.schedule = get_schedule_practice_round_LearningTask();
      
      // Set n_trials_per_session for current session
      let n_pairs = Object.keys(LT.schedule).length;
      LT.n_trials_per_session = LT.settings.n_trials_per_pair_by_session[LT.session] * n_pairs;
      
      // Create response cues
      LT.cues = create_two_cues();
      
      // **Initialize session trials storage**
      LT.session_trials_data = [];
      
      // ---------- SET UP HTML STRUCTURE ----------
      let container_Stage = "<div class='row justify-content-center' id='Stage'></div>";
      let container_Vals = "<div id='Vals'></div>";
      let container_Buttons = "<div class='row justify-content-center' id='respButtons'></div>";
      let container_FinalButton = "<div class='row justify-content-center' id='FinalButton'></div>";
      $('#ContBox').html(container_Stage + container_Vals + container_Buttons + container_FinalButton);
      $("#Stage").addClass("LTGrid");
      
      // Grid structure for stimuli and feedback
      let structure = 
        '<div class="box justify-content-center cue" id="LTcue0"></div>' +
        '<div class="box justify-content-center stim" id="LTresp0"></div>' +
        '<div class="box justify-content-center row fdb" id="LTfdb0"></div>' +
        '<div class="box justify-content-center stim" id="LTresp1"></div>' +
        '<div class="box justify-content-center row fdb" id="LTfdb1"></div>' +
        '<div class="box justify-content-center cue" id="LTcue1"></div>';
      $("#Stage").append(structure);
      
      document.getElementById("ContBox").className = "col-12 mt-3 invisible";
      
      // ---------- START TRIAL STATE MACHINE ----------
      setTimeout(function() {
        LT.trial_state = "trialChecks";
        trial_state_machine(LT, exp);
      }, 200);
    }
};

export {CD1_LearningTask};

// ============================================================================
// TRIAL STATE MACHINE
// ============================================================================

function trial_state_machine(LT, exp) {
  switch (LT.trial_state) {
    case "trialChecks":
      trialChecks(LT, exp);
      break;
    case "showStimuli":
      showStimuli(LT, exp);
      break;
    case "showMask":
      showMask(LT, exp);
      break;
    case "showCues":
      showCues(LT, exp);
      break;
    case "stimuliChoice":
      stimuliChoice(LT, exp);
      break;
    case "recordResponse":
      recordResponse(LT, exp);
      break;
    case "timeoutMessage":
      timeoutMessage(LT, exp);
      break;
    case "highlightResponse":
      highlightResponse(LT, exp);
      break;
    case "askConfidence":
      askConfidence(LT, exp);
      break;
    case "recordConfidence":
      recordConfidence(LT, exp);
      break;
    case "showFeedback":
      showFeedback(LT, exp);
      break;
    case "transitionScreen":
      transitionScreen(LT, exp);
      break;
    case "trialCounter":
      trialCounter(LT, exp);
      break;
    case "applyMatchingProbability":
      applyMatchingProbability(LT, exp);
      break;
    case "changeBlock":
      changeBlock(LT, exp);
      break;
  }
}

// ============================================================================
// TRIAL FUNCTIONS
// ============================================================================

function trialCounter(LT, exp) {
  LT.trial++;
  LT.trial_per_cycle++;
  LT.trial_state = "trialChecks";
  trial_state_machine(LT, exp);
}

function trialChecks(LT, exp) {
  if (LT.trial <= LT.n_trials_per_session - 1) {
    // Continue with trials
    if (LT.trial_per_cycle === LT.schedule.length) {
      LT.schedule = _.shuffle(LT.schedule);
      LT.trial_per_cycle = 0;
    }
    LT.trial_state = "showStimuli";
    trial_state_machine(LT, exp);
    
  } else {
    // Session completed - calculate performance
    let mean_is_correct_array = LT.is_correct_array.reduce((a, b) => a + b, 0) / LT.is_correct_array.length;
    exp.pcorrect_LearningTask = mean_is_correct_array;
    
    // Update exp variables
    exp.symbols_used_in_LearningTask = LT.symbols;
    exp.total_reward = LT.total_reward;
    
    if (LT.session === 0) {
      // END OF PRACTICE SESSION → Apply MP then go to performance check
      console.log(`Practice session complete. Performance: ${(mean_is_correct_array * 100).toFixed(1)}%`);
      console.log(`Applying MP (practice)...`);
  
      // Function to continue from MP to performance check
      window.LT_continue_from_mp_to_check = function() {
        console.log('→ Moving to performance check after practice MP');
        move_on_to_next_experiment_state(1, exp);  // Goes from State 4 → State 5
      };
  
      // Function to continue from performance check to Session 1
      window.LT_continue_after_check = function() {
        console.log('→ Starting Session 1 after performance check');
        LT.trial_state = "changeBlock";
        trial_state_machine(LT, exp);
      };
  
      LT.trial_state = "applyMatchingProbability";
      trial_state_machine(LT, exp);
      
    } else if (LT.session === (LT.settings.n_sessions - 1)) {
      // END OF LAST REAL SESSION → Apply MP then go to Transfer Task
      console.log(`Session ${LT.session} complete. Applying MP...`);
      LT.trial_state = "applyMatchingProbability";
      trial_state_machine(LT, exp);
      
    } else {
      // BETWEEN REAL SESSIONS → Apply MP then continue
      console.log(`Session ${LT.session} complete. Applying MP...`);
      LT.trial_state = "applyMatchingProbability";
      trial_state_machine(LT, exp);
    }
  }
}

function showStimuli(LT, exp) {
  let pair = LT.schedule[LT.trial_per_cycle].pair;
  LT.isbottom = _.shuffle(LT.isbottom);
  
  $('#LTresp1').empty();
  $('#LTresp0').empty();
  $(`#LTresp${LT.isbottom[0]}`).html(`<img class="stim_img" src=${LT.symbols["S" + pair[0]].image.src}></img>`);
  $(`#LTresp${LT.isbottom[1]}`).html(`<img class="stim_img" src=${LT.symbols["S" + pair[1]].image.src}></img>`);
  makeVisible("LTresp0", "LTresp1");
  
  sleep(LT.settings.stimulus_presentation_time_MS[0]).then(() => {
    LT.trial_state = "showMask";
    trial_state_machine(LT, exp);
  });
}

function showMask(LT, exp) {
  makeInvisible("LTresp0", "LTresp1");
  LT.trial_state = "showCues";
  
  let timer = getRandomIntInclusive(LT.settings.mask_time_MS[0], LT.settings.mask_time_MS[1]);
  sleep(timer).then(() => {
    LT.trial_state = "showCues";
    trial_state_machine(LT, exp);
  });
}

function showCues(LT, exp) {
  LT.isright = _.shuffle(LT.isright);
  
  $('#LTcue' + LT.isright[0]).html('<img width="100%" height="100%" src="' + LT.cues["cue0"].image.src + '"></img>');
  $('#LTcue' + LT.isright[1]).html('<img width="100%" height="100%" src="' + LT.cues["cue1"].image.src + '"></img>');
  
  makeVisible("LTcue0", "LTcue1");
  
  LT.trial_state = "stimuliChoice";
  trial_state_machine(LT, exp);
}

function stimuliChoice(LT, exp) {
  if (LT.session == 0) {
    let text = '<div class="col"><H4 align="center" style="color:grey">' + LT.text.choiceIndication + '</H4></div>';
    $('#LTfdb0').html(text);
    makeVisible("LTfdb0");
  }
  
  document.addEventListener('keydown', handleKeyPress);
  LT.timestamp_response_countdown = Date.now();
  
  function handleKeyPress(event) {
    let key = event.key.toLowerCase();
    
    if (key == "s" || key == "k") {
      if (LT.session == 0) {
        makeInvisible("LTfdb0");
      }
      
      document.removeEventListener('keydown', handleKeyPress);
      
      LT.timeout = 0;
      LT.rt = Date.now() - LT.timestamp_response_countdown;
      LT.response_key = key;
      
      LT.trial_state = "recordResponse";
      trial_state_machine(LT, exp);
    }
  }
}

function recordResponse(LT, exp) {
  let pair = LT.schedule[LT.trial_per_cycle].pair;
  let symbolA = LT.symbols['S' + pair[0]];
  let symbolB = LT.symbols['S' + pair[1]];
  
  LT.feedback_type = LT.schedule[LT.session].fdb;
  LT.is_gain_trial = symbolA.best_outcome > 0 ? 1 : 0;
  
  let symbol_top = ((LT.isbottom[0] == 0 ? symbolA : symbolB));
  let symbol_bottom = ((LT.isbottom[0] == 0 ? symbolB : symbolA));
  
  LT.key_top = ((LT.isright[0] == 0 ? "s" : "k"));
  LT.key_bottom = ((LT.isright[0] == 0 ? "k" : "s"));
  
  let random_number_for_top_outcome = Math.random();
  let random_number_for_bottom_outcome = Math.random();
  let symbol_top_outcome = (random_number_for_top_outcome) <= symbol_top.probability_best_outcome ? symbol_top.best_outcome : symbol_top.worst_outcome;
  let symbol_bottom_outcome = (random_number_for_bottom_outcome) <= symbol_bottom.probability_best_outcome ? symbol_bottom.best_outcome : symbol_bottom.worst_outcome;
  
  if (LT.timeout == 0) {
    if (LT.key_bottom == "s") {
      LT.responded_bottom = parseInt((LT.response_key == "s" ? 1 : 0));
    } else if (LT.key_bottom == "k") {
      LT.responded_bottom = parseInt((LT.response_key == "k" ? 1 : 0));
    }
  }
  
  let symbol_chosen = ((LT.responded_bottom == 1 ? symbol_bottom : symbol_top));
  let symbol_unchosen = ((LT.responded_bottom == 1 ? symbol_top : symbol_bottom));
  
  let symbol_chosen_expected_value = symbol_chosen.probability_best_outcome * symbol_chosen.best_outcome + (1 - symbol_chosen.probability_best_outcome) * symbol_chosen.worst_outcome;
  let symbol_unchosen_expected_value = symbol_unchosen.probability_best_outcome * symbol_unchosen.best_outcome + (1 - symbol_unchosen.probability_best_outcome) * symbol_unchosen.worst_outcome;
  LT.chose_highest_expected_value = (symbol_chosen_expected_value > symbol_unchosen_expected_value ? 1 : 0);
  
  LT.symbol_chosen_id = symbol_chosen.id;
  LT.symbol_chosen_imageID = symbol_chosen.imageID;
  LT.symbol_chosen_best_outcome = symbol_chosen.best_outcome;
  LT.symbol_chosen_worst_outcome = symbol_chosen.worst_outcome;
  LT.symbol_chosen_probability_best_outcome = symbol_chosen.probability_best_outcome;
  LT.symbol_unchosen_id = symbol_unchosen.id;
  LT.symbol_unchosen_imageID = symbol_unchosen.imageID;
  LT.symbol_unchosen_best_outcome = symbol_unchosen.best_outcome;
  LT.symbol_unchosen_worst_outcome = symbol_unchosen.worst_outcome;
  LT.symbol_unchosen_probability_best_outcome = symbol_unchosen.probability_best_outcome;
  
  LT.symbol_chosen_outcome = (LT.responded_bottom == 1 ? symbol_bottom_outcome : symbol_top_outcome);
  LT.symbol_unchosen_outcome = (LT.responded_bottom == 1 ? symbol_top_outcome : symbol_bottom_outcome);
  
  // Computing is_correct depends on framing
  let is_correct = 6666;
  if (exp.framing == 0) { // WORST group
    is_correct = 1 - LT.chose_highest_expected_value;
  } else if (exp.framing == 1) { // BEST group
    is_correct = LT.chose_highest_expected_value;
  }
  LT.is_correct_array.push(is_correct);
  
  // Computing trial reward depends on framing
  if (exp.framing == 0) { // WORST group - get outcome of unchosen option
    LT.trial_reward = LT.symbol_unchosen_outcome;
  } else { // BEST group - get outcome of chosen option
    LT.trial_reward = LT.symbol_chosen_outcome;
  }
  
  let total_reward_temp = LT.total_reward + LT.trial_reward;
  LT.total_reward = Math.round((total_reward_temp + Number.EPSILON) * 100) / 100;
  
  if (LT.timeout == 0) {
    LT.trial_state = "highlightResponse";
  } else if (LT.timeout == 1) {
    LT.trial_state = "timeoutMessage";
  }
  trial_state_machine(LT, exp);
}

function timeoutMessage(LT, exp) {
  makeInvisible("LTcue0", "LTresp0", "LTresp1", "LTcue1");
  
  let fdb_timeout = '<div class="col"><H4 align="center" style="color:red">' + LT.text.timeout1 + '</H4><p align="center" style="color:red">' + LT.text.timeout2 + '</p></div>';
  $('#LTfdb0').html(fdb_timeout);
  makeVisible("LTfdb0");
  
  sleep(LT.settings.timeout_time_MS).then(() => {
    $('#LTfdb0').empty();
    makeInvisible("LTfdb0");
    LT.trial_state = "highlightResponse";
    trial_state_machine(LT, exp);
  });
}

function highlightResponse(LT, exp) {
  let position_chosen_symbol = LT.responded_bottom;
  let container_chosen_option = document.getElementById('LTresp' + position_chosen_symbol);
  
  if (exp.framing == 1) { // BEST group - border around chosen
    let borderColor = '#000000';
    container_chosen_option.style.borderColor = borderColor;
  } else if (exp.framing == 0) { // WORST group - X over chosen
    let color = 'black';
    let thickness = 3;
    addXOverlayToContainer(container_chosen_option, color, thickness);
  }
  
  makeVisible("LTcue0", "LTresp0", "LTresp1", "LTcue1");
  
  sleep(LT.settings.border_time_MS).then(() => {
    if (exp.framing == 1) {
      document.getElementById('LTresp0').style.borderColor = "transparent";
      document.getElementById('LTresp1').style.borderColor = "transparent";
    } else if (exp.framing == 0) {
      removeXOverlayFromContainer(container_chosen_option);
    }
    
    LT.trial_state = "askConfidence";
    trial_state_machine(LT, exp);
  });
}

// ============================================================================
// CONFIDENCE RATING FUNCTIONS
// ============================================================================

function askConfidence(LT, exp) {
  console.log('--- askConfidence()');
  
  makeInvisible("LTcue0", "LTcue1");
  
  let confidenceHTML = '<div class="confidence-container">';
  
  confidenceHTML += '<div class="confidence-question">';
  confidenceHTML += '<h3>' + LT.text_confidence.question + '</h3>';
  confidenceHTML += '<p>' + LT.text_confidence.scale_instruction + '</p>';
  confidenceHTML += '</div>';
  
  confidenceHTML += '<div class="confidence-scale">';
  confidenceHTML += '<input type="range" id="confidence-slider" ';
  confidenceHTML += 'min="' + LT.settings.confidence_min + '" ';
  confidenceHTML += 'max="' + LT.settings.confidence_max + '" ';
  confidenceHTML += 'step="' + LT.settings.confidence_step + '" ';
  confidenceHTML += 'value="75">';
  confidenceHTML += '</div>';
  
  confidenceHTML += '<div class="confidence-value-display">';
  confidenceHTML += '<span id="confidence-value">75</span>%';
  confidenceHTML += '</div>';
  
  confidenceHTML += '<div class="confidence-labels">';
  confidenceHTML += '<span>' + LT.text_confidence.scale_min_label + '</span>';
  confidenceHTML += '<span>' + LT.text_confidence.scale_max_label + '</span>';
  confidenceHTML += '</div>';
  
  confidenceHTML += '<div class="confidence-button">';
  confidenceHTML += '<button id="validate-confidence" class="btn btn-primary">Validate</button>';
  confidenceHTML += '</div>';
  
  confidenceHTML += '</div>';
  
  $('#Vals').html(confidenceHTML);
  makeVisible("Vals");
  
  LT.timestamp_confidence_start = Date.now();
  
  document.getElementById('confidence-slider').addEventListener('input', function(e) {
    document.getElementById('confidence-value').textContent = e.target.value;
  });
  
  document.getElementById('validate-confidence').addEventListener('click', function() {
    let confidence_value = parseInt(document.getElementById('confidence-slider').value);
    let confidence_rt = Date.now() - LT.timestamp_confidence_start;
    
    LT.confidence_rating = confidence_value;
    LT.confidence_rt = confidence_rt;
    
    console.log(`Confidence rating: ${confidence_value}% (RT: ${confidence_rt}ms)`);
    
    LT.trial_state = "recordConfidence";
    trial_state_machine(LT, exp);
  });
}

function recordConfidence(LT, exp) {
  console.log('--- recordConfidence()');
  
  $('#Vals').empty();
  makeInvisible("Vals");
  
  // **Store trial data for MP selection**
  let is_correct_on_this_trial;
  if (exp.framing == 0) { // WORST group
    is_correct_on_this_trial = (1 - LT.chose_highest_expected_value) === 1;
  } else { // BEST group
    is_correct_on_this_trial = LT.chose_highest_expected_value === 1;
  }
  
  LT.session_trials_data.push({
    trial_number: LT.trial,
    confidence: LT.confidence_rating / 100, // Convert to 0.50-1.00 scale
    was_correct: is_correct_on_this_trial,
    chose_highest_EV: LT.chose_highest_expected_value
  });
  
  let date_start = exp.date_start.toLocaleString();
  
  // Send complete trial data to database
  if (!exp.test_mode_do_NOT_send_data) {
    sendToDB(0, {
      date_start: date_start,
      manual_ID: exp.manual_ID,
      prolific_ID: exp.prolific_ID,
      session_ID: exp.session_ID,
      exp_ID: exp.exp_ID,
      framing: exp.framing,
      framing_label: exp.framing === 1 ? 'BEST' : 'WORST',
      
      task_name: LT.settings.task_name,
      n_trials_per_session: LT.n_trials_per_session,
      n_sessions: LT.settings.n_sessions,
      
      session: LT.session,
      trial: LT.trial,
      trial_per_cycle: LT.trial_per_cycle,
      feedback_type: LT.feedback_type,
      is_gain_trial: LT.is_gain_trial,
      key_top: LT.key_top,
      key_bottom: LT.key_bottom,
      
      response_key: LT.response_key,
      responded_bottom: LT.responded_bottom,
      symbol_chosen_id: LT.symbol_chosen_id,
      symbol_chosen_imageID: LT.symbol_chosen_imageID,
      symbol_chosen_probability_best_outcome: LT.symbol_chosen_probability_best_outcome,
      symbol_chosen_best_outcome: LT.symbol_chosen_best_outcome,
      symbol_chosen_worst_outcome: LT.symbol_chosen_worst_outcome,
      symbol_chosen_outcome: LT.symbol_chosen_outcome,
      symbol_unchosen_id: LT.symbol_unchosen_id,
      symbol_unchosen_imageID: LT.symbol_unchosen_imageID,
      symbol_unchosen_probability_best_outcome: LT.symbol_unchosen_probability_best_outcome,
      symbol_unchosen_best_outcome: LT.symbol_unchosen_best_outcome,
      symbol_unchosen_worst_outcome: LT.symbol_unchosen_worst_outcome,
      symbol_unchosen_outcome: LT.symbol_unchosen_outcome,
      rt: LT.rt,
      timeout: LT.timeout,
      chose_highest_expected_value: LT.chose_highest_expected_value,
      trial_reward: LT.trial_reward,
      total_reward: LT.total_reward,
      
      confidence_rating: LT.confidence_rating,
      confidence_rt: LT.confidence_rt
    },
    'php/InsertDB_CD1_LearningTask.php');
  }
  
  LT.trial_state = "showFeedback";
  trial_state_machine(LT, exp);
}

function showFeedback(LT, exp) {
  console.log('--- showFeedback()');
  
  let feedback_color_code;
  let sign;
  if (LT.is_gain_trial == 1) {
    feedback_color_code = '#14c914';
    sign = '+';
  } else {
    feedback_color_code = '#FF0000';
    sign = '';
  }
  
  let fdb_ch = '<div class="col"><H2 id="fdb_num" style="color:' + feedback_color_code + '">' + sign + LT.symbol_chosen_outcome + '</H2></div>';
  let fdb_un = '<div class="col"><H2 id="fdb_num" style="color:' + feedback_color_code + '">' + sign + LT.symbol_unchosen_outcome + '</H2></div>';
  
  if (LT.responded_bottom == 1) {
    $('#LTfdb0').html(fdb_un);
    $('#LTfdb1').html(fdb_ch);
  } else if (LT.responded_bottom == 0) {
    $('#LTfdb0').html(fdb_ch);
    $('#LTfdb1').html(fdb_un);
  }
  makeVisible("LTfdb0", "LTfdb1");
  
  let feedback_outcome_chosen = Math.abs(LT.symbol_chosen_outcome);
  let feedback_outcome_unchosen = Math.abs(LT.symbol_unchosen_outcome);
  let path_feedback_image_chosen = 'images/rewards/' + feedback_outcome_chosen + '.png';
  let path_feedback_image_unchosen = 'images/rewards/' + feedback_outcome_unchosen + '.png';
  
  let position_chosen = LT.responded_bottom;
  let position_unchosen = 1 - LT.responded_bottom;
  
  $('#LTresp0').empty();
  $('#LTresp1').empty();
  $('#LTresp' + position_chosen).html('<img class="money_img" src=' + path_feedback_image_chosen + '></img>');
  $('#LTresp' + position_unchosen).html('<img class="money_img" src=' + path_feedback_image_unchosen + '></img>');
  
  let borderColor;
  if (LT.is_gain_trial == 1) {
    borderColor = '#14c914';
  } else {
    borderColor = '#FF0000';
  }
  
  let position_received_outcome;
  let position_chosen_symbol = LT.responded_bottom;
  let position_unchosen_symbol = 1 - LT.responded_bottom;
  
  if (exp.framing == 0) {
    position_received_outcome = position_unchosen_symbol;
  } else {
    position_received_outcome = position_chosen_symbol;
  }
  
  document.getElementById('LTresp' + position_received_outcome).style.borderColor = borderColor;
  
  let position_not_received_outcome = 1 - position_received_outcome;
  let container_not_received_outcome = document.getElementById('LTresp' + position_not_received_outcome);
  let color = borderColor;
  let thickness = 3;
  addXOverlayToContainer(container_not_received_outcome, color, thickness);

  sleep(LT.settings.feedback_time_MS).then(() => {
    document.getElementById('LTresp' + position_received_outcome).style.borderColor = "transparent";
    removeXOverlayFromContainer(container_not_received_outcome);
    
    LT.trial_state = "transitionScreen";
    trial_state_machine(LT, exp);
  });
}

function transitionScreen(LT, exp) {
  $('#LTresp0').empty();
  $('#LTresp1').empty();
  $('#LTcue0').empty();
  $('#LTcue1').empty();
  $('#LTfdb0').empty();
  $('#LTfdb1').empty();
  $('#Vals').empty();
  
  makeInvisible("LTcue0", "LTresp0", "LTfdb0", "LTresp1", "LTfdb1", "LTcue1", "Vals");
  document.getElementById("ContBox").className = "col-12 mt-3 invisible";
  
  sleep(LT.settings.transition_time_MS[0]).then(() => {
    LT.trial_state = "trialCounter";
    trial_state_machine(LT, exp);
  });
}

// ============================================================================
// **MATCHING PROBABILITY MECHANISM**
// ============================================================================

function applyMatchingProbability(LT, exp) {
  console.log('=== APPLYING MATCHING PROBABILITY MECHANISM ===');
  console.log('Session:', LT.session);
  console.log('session_trials_data length:', LT.session_trials_data.length);
  
  // **VÉRIFICATION: Si pas de données, erreur et continuer**
  if (!LT.session_trials_data || LT.session_trials_data.length === 0) {
    console.error('ERROR: No trial data available for MP mechanism!');
    handleMPContinuation(LT, exp);
    return;
  }
  
  // 1. Select random trial from this session
  let n_trials_this_session = LT.session_trials_data.length;
  let random_trial_index = Math.floor(Math.random() * n_trials_this_session);
  let selected_trial = LT.session_trials_data[random_trial_index];
  
  console.log(`Selected trial ${selected_trial.trial_number} (index ${random_trial_index} of ${n_trials_this_session})`);
  console.log(`Confidence: ${(selected_trial.confidence * 100).toFixed(0)}%, Correct: ${selected_trial.was_correct}`);
  
  // 2. Draw random number r in [0.5, 1]
  let r = 0.5 + Math.random() * 0.5;
  console.log(`Random draw r: ${(r * 100).toFixed(0)}%`);
  
  // 3. Apply MP mechanism
  let p = selected_trial.confidence;
  let mp_bonus = 0;
  let mp_explanation = '';
  let mp_mechanism_type = '';
  
  if (p >= r) {
    mp_mechanism_type = 'direct';
    if (selected_trial.was_correct) {
      mp_bonus = LT.settings.MP_bonus_per_session;
      mp_explanation = `Your confidence (${(p*100).toFixed(0)}%) was higher than the random draw (${(r*100).toFixed(0)}%), and your choice was <strong>correct</strong> on the selected trial.`;
    } else {
      mp_bonus = 0;
      mp_explanation = `Your confidence (${(p*100).toFixed(0)}%) was higher than the random draw (${(r*100).toFixed(0)}%), but your choice was <strong>incorrect</strong> on the selected trial.`;
    }
  } else {
    mp_mechanism_type = 'lottery';
    let lottery_win = Math.random() < r;
    if (lottery_win) {
      mp_bonus = LT.settings.MP_bonus_per_session;
      mp_explanation = `Your confidence (${(p*100).toFixed(0)}%) was lower than the random draw (${(r*100).toFixed(0)}%). The lottery was applied with ${(r*100).toFixed(0)}% probability and you <strong>won</strong>!`;
    } else {
      mp_bonus = 0;
      mp_explanation = `Your confidence (${(p*100).toFixed(0)}%) was lower than the random draw (${(r*100).toFixed(0)}%). The lottery was applied with ${(r*100).toFixed(0)}% probability but you did not win this time.`;
    }
  }
  
  // 4. Add to total reward and exp tracking
  LT.total_reward += mp_bonus;
  exp.total_reward = LT.total_reward;
  exp.MP_total_bonus_earned += mp_bonus;
  
  console.log(`MP Bonus: ${mp_bonus} points`);
  console.log(`Total reward after MP: ${LT.total_reward}`);
  
  // 5. Store MP result for display at end
  let mp_result = {
    session: LT.session,
    session_label: LT.session === 0 ? 'Practice' : `Session ${LT.session}`,
    trial_selected: selected_trial.trial_number,
    confidence_p: p,
    random_draw_r: r,
    was_correct: selected_trial.was_correct,
    mechanism_type: mp_mechanism_type,
    mp_bonus: mp_bonus,
    explanation: mp_explanation,
    total_after: LT.total_reward
  };
  
  exp.MP_results.push(mp_result);
  exp.MP_trials_selected.push(selected_trial.trial_number);
  
  console.log('MP result stored:', mp_result);
  
  // 6. Send MP data to database
  if (!exp.test_mode_do_NOT_send_data) {
    let date_start = exp.date_start.toLocaleString();
    sendToDB(0, {
      date_start: date_start,
      manual_ID: exp.manual_ID,
      prolific_ID: exp.prolific_ID,
      session_ID: exp.session_ID,
      exp_ID: exp.exp_ID,
      framing: exp.framing,
      framing_label: exp.framing === 1 ? 'BEST' : 'WORST',
      
      task_name: 'MatchingProbability',
      session: LT.session,
      trial_selected: selected_trial.trial_number,
      confidence_p: p,
      random_draw_r: r,
      was_correct: selected_trial.was_correct ? 1 : 0,
      mechanism_type: mp_mechanism_type,
      mp_bonus: mp_bonus,
      total_reward_after_mp: LT.total_reward,
      explanation: mp_explanation
    },
    'php/InsertDB_CD1_MatchingProbability.php');
  }
  
  // 7. **DÉCISION: Afficher ou passer?**
  if (LT.session === 0) {
    // PRACTICE: Show result immediately (pedagogical) ✅
    console.log('Practice session → Displaying MP result');
    displayMPResult(LT, exp, mp_result);
  } else {
    // REAL SESSIONS: Skip display, continue silently 🤫
    console.log(`Session ${LT.session} MP calculated but NOT displayed (will show at end)`);
    handleMPContinuation(LT, exp);
  }
}

// **NEW: Helper function for continuation after MP**
function handleMPContinuation(LT, exp) {
  if (LT.session === 0) {
    // After practice MP → Performance check
    console.log('→ Moving to Performance Check (State 5)');
    if (window.LT_continue_from_mp_to_check) {
      window.LT_continue_from_mp_to_check();
    }
  } else if (LT.session === (LT.settings.n_sessions - 1)) {
    // After last session → Transfer Task
    console.log('→ All sessions complete. Moving to Transfer Task (State 7)');
    exp.experiment_state = 7;
    experiment_state_machine(exp);
  } else {
    // Between sessions → Next session
    console.log(`→ Moving to next session (${LT.session + 1})`);
    LT.trial_state = "changeBlock";
    trial_state_machine(LT, exp);
  }
}

function displayMPResult(LT, exp, mp_result) {
  console.log('--- Displaying MP result screen');
  
  $('#ContBox').empty();
  
  let container_Stage = "<div class='row justify-content-center' id='Stage'></div>";
  $('#ContBox').html(container_Stage);
  
  document.getElementById("ContBox").className = "col-12 mt-3 visible";
  
  // **Calculate points gained/lost during session**
  let points_at_start = LT.session_start_reward;
  let points_before_mp = LT.total_reward - mp_result.mp_bonus;
  let points_change = points_before_mp - points_at_start;
  let is_gain = points_change >= 0;
  
  let mpHTML = '<div class="mp-result-container" style="max-width: 700px; margin: 0 auto; padding: 30px; background-color: #f8f9fa; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">';
  
  // **Title**
  mpHTML += `<h2 style="text-align: center; color: #2c3e50; margin-bottom: 25px;">Session ${LT.session} - Confidence Bonus</h2>`;
  
  // **Trial information (simplified bullet points)**
  mpHTML += '<div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">';
  mpHTML += '<ul style="font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">';
  mpHTML += `<li><strong>Trial selected:</strong> Trial #${mp_result.trial_selected + 1}</li>`;
  mpHTML += `<li><strong>Your reported confidence:</strong> ${(mp_result.confidence_p * 100).toFixed(0)}%</li>`;
  mpHTML += `<li><strong>Computer's lottery offer:</strong> ${(mp_result.random_draw_r * 100).toFixed(0)}% chance of winning</li>`;
  mpHTML += '</ul>';
  mpHTML += '</div>';
  
  // **System Decision (explanation)**
  mpHTML += '<div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">';
  mpHTML += '<p style="font-size: 16px; margin: 0;"><strong>System Decision:</strong> ';
  
  if (mp_result.mechanism_type === 'direct') {
    // p >= r → Direct payment based on correctness
    if (mp_result.was_correct) {
      mpHTML += `Your confidence (${(mp_result.confidence_p * 100).toFixed(0)}%) was higher than the computer's offer (${(mp_result.random_draw_r * 100).toFixed(0)}%). Your choice was checked and was correct.`;
    } else {
      mpHTML += `Your confidence (${(mp_result.confidence_p * 100).toFixed(0)}%) was higher than the computer's offer (${(mp_result.random_draw_r * 100).toFixed(0)}%). Your choice was checked but was incorrect.`;
    }
  } else {
    // p < r → Lottery
    mpHTML += `The computer gave you the lottery because it offered a better chance (${(mp_result.random_draw_r * 100).toFixed(0)}%) than your own choice (${(mp_result.confidence_p * 100).toFixed(0)}%).`;
  }
  
  mpHTML += '</p></div>';
  
  // **Result (with colored box)**
  mpHTML += '<div style="text-align: center; padding: 25px; border-radius: 8px; ' + 
            (mp_result.mp_bonus > 0 ? 'background-color: #d4edda; border: 2px solid #28a745;' : 'background-color: #f8d7da; border: 2px solid #dc3545;') + '">';
  
  mpHTML += '<p style="font-size: 16px; margin-bottom: 10px;"><strong>Result:</strong> ';
  
  if (mp_result.mechanism_type === 'direct') {
    if (mp_result.mp_bonus > 0) {
      mpHTML += `Your choice was correct! You receive <strong>${mp_result.mp_bonus} bonus points</strong>.`;
    } else {
      mpHTML += `Your choice was incorrect. You receive <strong>0 bonus points</strong>.`;
    }
  } else {
    // Lottery
    if (mp_result.mp_bonus > 0) {
      mpHTML += `The lottery won! You receive <strong>${mp_result.mp_bonus} bonus points</strong>.`;
    } else {
      mpHTML += `The lottery did not win this time. You receive <strong>0 bonus points</strong>.`;
    }
  }
  
  mpHTML += '</p>';
  
  // **Session summary**
  mpHTML += '<hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;">';
  mpHTML += `<p style="font-size: 15px; margin: 5px 0;"><strong>MP bonus earned so far:</strong> ${exp.MP_total_bonus_earned} points</p>`;
  mpHTML += `<p style="font-size: 15px; margin: 5px 0;"><strong>Points gained/lost this session:</strong> <span style="color: ${is_gain ? '#28a745' : '#dc3545'}; font-weight: bold;">${is_gain ? '+' : ''}${Math.round(points_change * 10) / 10} points</span></p>`;
  mpHTML += `<p style="font-size: 16px; margin: 5px 0; color: #2c3e50;"><strong>Total points:</strong> ${Math.round(LT.total_reward * 10) / 10} points</p>`;
  
  mpHTML += '</div>';

   // **Practice round reminder (only for Session 0)**
  if (LT.session === 0) {
    mpHTML += '<p style="font-size: 14px; margin-top: 15px; margin-bottom: 0; color: #856404; font-style: italic;">As this is the practice round, your score will be reset before the real sessions.</p>';
  }
  
  mpHTML += '</div>';
  
  // **Continue button**
  mpHTML += '<div style="text-align: center; margin-top: 30px;">';
  mpHTML += '<button id="mp-continue-btn" class="btn btn-primary btn-lg" style="padding: 12px 40px; font-size: 18px;">Continue</button>';
  mpHTML += '</div>';
  
  mpHTML += '</div>';
  
  $('#Stage').html(mpHTML);
  
  // **Button click handler**
  document.getElementById('mp-continue-btn').onclick = function() {
    console.log('MP result acknowledged, continuing...');
    handleMPContinuation(LT, exp);
  };
}

// ============================================================================
// SESSION TRANSITION
// ============================================================================

function changeBlock(LT, exp) {
  console.log(`--------------- changeBlock() ---------------`);
  
  // **Reset to starting bonus after practice, otherwise keep accumulating**
  if (LT.session == 0) {
    LT.total_reward = exp.starting_bonus || LT.settings.starting_bonus || 20;
    exp.total_reward = LT.total_reward;
  
    // **Also reset MP bonus earned (practice doesn't count)**
    exp.MP_total_bonus_earned = 0;
    console.log(`Practice complete. Resetting to starting bonus: ${LT.total_reward} points`);
    console.log(`Resetting MP bonus earned to 0 (practice doesn't count)`);
  }
  
  // Update tracking values
  LT.session++;
  LT.trial = 0;
  LT.trial_per_cycle = 0;
  LT.is_correct_array = [];
  
  // **Reset session trials data**
  LT.session_trials_data = [];
  
  // **Save starting points for next session**
  LT.session_start_reward = LT.total_reward;
  console.log(`Session ${LT.session} starting with: ${LT.session_start_reward} points`);
  
  // Create new symbols for each session
  let symbol_image_file_number = LT.session;
  LT.symbols = create_eight_symbols(
    LT.settings.best_outcome_GAIN,
    LT.settings.worst_outcome_GAIN,
    LT.settings.best_outcome_LOSS,
    LT.settings.worst_outcome_LOSS,
    LT.settings.maximum_outcome_probability,
    symbol_image_file_number
  );
  console.log(`Created new 8 symbols for session ${LT.session} (image set ${symbol_image_file_number})`);
  
  LT.schedule = get_schedule_LearningTask();
  
  let n_pairs = Object.keys(LT.schedule).length;
  LT.n_trials_per_session = LT.settings.n_trials_per_pair_by_session[LT.session] * n_pairs;
  
  // Rebuild HTML structure
  $('#ContBox').empty();
  
  let container_Stage = "<div class='row justify-content-center' id='Stage'></div>";
  let container_Vals = "<div id='Vals'></div>";
  let container_Buttons = "<div class='row justify-content-center' id='respButtons'></div>";
  let container_FinalButton = "<div class='row justify-content-center' id='FinalButton'></div>";
  $('#ContBox').html(container_Stage + container_Vals + container_Buttons + container_FinalButton);
  $("#Stage").addClass("LTGrid");
  
  let structure = 
    '<div class="box justify-content-center cue" id="LTcue0"></div>' +
    '<div class="box justify-content-center stim" id="LTresp0"></div>' +
    '<div class="box justify-content-center row fdb" id="LTfdb0"></div>' +
    '<div class="box justify-content-center stim" id="LTresp1"></div>' +
    '<div class="box justify-content-center row fdb" id="LTfdb1"></div>' +
    '<div class="box justify-content-center cue" id="LTcue1"></div>';
  $("#Stage").append(structure);
  
  document.getElementById("ContBox").className = "col-12 mt-3 visible";
  
  // Display transition message
  let text_structure = 
    '<div class="box justify-content-center" id="LTchangeBlock"></div>' +
    '<div class="box justify-content-center" id="LTchangeBlock_btn"></div>';
  $("#Stage").append(text_structure);
  
  let block_text;
  if (LT.session === 1) {
    block_text = LT.text.blockChange_practice;
  } else if (LT.session === 2) {
    block_text = LT.text.blockChange_session1;
  }

  let text = '<p style="color:black"><br>' + block_text + '<br></p>';
  document.getElementById('LTchangeBlock').innerHTML += text;
  
  let button = '<input type="button" align="center" class="btn btn-default m-0 rounded myBtn" id="ContinueButton2" value=' + LT.text.blockChange_button + '>';
  document.getElementById('LTchangeBlock_btn').innerHTML += button;
  
  makeVisible("LTchangeBlock", "LTchangeBlock_btn");
  
  document.getElementById("ContinueButton2").onclick = function() {
    let parent = document.getElementById("Stage");
    let text_elem = document.getElementById("LTchangeBlock");
    let btn_elem = document.getElementById("LTchangeBlock_btn");
    
    if (text_elem) parent.removeChild(text_elem);
    if (btn_elem) parent.removeChild(btn_elem);
    
    LT.trial_state = "trialChecks";
    trial_state_machine(LT, exp);
  };
}

// ============================================================================
// **NEW: SEPARATED DISPLAY FUNCTIONS (State 9 & State 10)**
// ============================================================================

// **STATE 9: SESSION PERFORMANCE SUMMARY (Points per session)**
window.displaySessionPerformanceSummary = function(exp) {
    console.log('--- State 9: Session Performance Summary ---');
    
    // Clear screen
    $('#ContBox').empty();
    $('#container-exp').empty();
    $('#Stage').empty();
    
    let html = `
        <div class="performance-summary-container" style="max-width: 800px; margin: 50px auto; padding: 40px; background-color: white; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.15);">
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 30px; font-size: 28px;">
                📊 Session Performance Summary
            </h2>
            
            <p style="text-align: center; font-size: 18px; margin-bottom: 40px; color: #555;">
                Here's how many points you earned in each session based on your choices:
            </p>
    `;
    
    // Calculer les points pour chaque session depuis MP_results
    let session1Result = exp.MP_results.find(r => r.session === 1);
    let session2Result = exp.MP_results.find(r => r.session === 2);
    let transferResult = exp.MP_results.find(r => r.session === 'transfer');
    
    let starting_bonus = exp.starting_bonus || 20;
    
    // Session 1 points (excluding MP bonus)
    let session1_start = starting_bonus;
    let session1_end = session1Result ? session1Result.total_after - session1Result.mp_bonus : starting_bonus;
    let session1_points = session1_end - session1_start;
    
    // Session 2 points (excluding MP bonus)
    let session2_start = session1_end;
    let session2_end = session2Result ? session2Result.total_after - session2Result.mp_bonus : session2_start;
    let session2_points = session2_end - session2_start;
    
    // Transfer Task points (should be 0)
    let transfer_start = session2_end;
    let transfer_end = transferResult ? transferResult.total_after - transferResult.mp_bonus : transfer_start;
    let transfer_points = transfer_end - transfer_start;
    
    // Afficher chaque session
    const sessions = [
        { name: 'Session 1', points: session1_points, color: '#3498db' },
        { name: 'Session 2', points: session2_points, color: '#9b59b6' },
        { name: 'Transfer Task', points: transfer_points, color: '#e67e22' }
    ];
    
    sessions.forEach(session => {
        html += `
            <div style="background: white; border-radius: 12px; padding: 25px; 
                        margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        border-left: 5px solid ${session.color};">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="font-size: 24px; margin-right: 10px;">${session.icon}</span>
                        <span style="font-size: 20px; font-weight: 600; color: #2c3e50;">
                            ${session.name}
                        </span>
                    </div>
                    <div style="font-size: 28px; font-weight: bold; color: ${session.points >= 0 ? '#27ae60' : '#e74c3c'};">
                        ${session.points >= 0 ? '+' : ''}${Math.round(session.points * 10) / 10} points
                    </div>
                </div>
            </div>
        `;
    });
    
    // Total des points
    const totalTaskPoints = session1_points + session2_points + transfer_points;
    const totalPoints = starting_bonus + totalTaskPoints;
    
    html += `
        <div style="background: #ecf0f1; border-radius: 12px; padding: 30px; 
                    margin-top: 30px; border: 3px solid #3498db;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="font-size: 20px; color: #2c3e50;">
                    Starting Bonus:
                </span>
                <span style="font-size: 24px; font-weight: bold; color: #27ae60;">
                    +${starting_bonus} points
                </span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="font-size: 20px; color: #2c3e50;">
                    Total Task Points:
                </span>
                <span style="font-size: 24px; font-weight: bold; color: ${totalTaskPoints >= 0 ? '#27ae60' : '#e74c3c'};">
                    ${totalTaskPoints >= 0 ? '+' : ''}${Math.round(totalTaskPoints * 10) / 10} points
                </span>
            </div>
            <hr style="border-top: 2px solid #bdc3c7; margin: 15px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 24px; font-weight: bold; color: #2c3e50;">
                    Total Points:
                </span>
                <span style="font-size: 32px; font-weight: bold; color: #2980b9;">
                    ${Math.round(totalPoints * 10) / 10} points
                </span>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 40px;">
            <p style="font-size: 16px; color: #7f8c8d; margin-bottom: 20px;">
                Next, you'll see the results of the confidence lottery for each session.
            </p>
            <button id="continue-to-lottery" class="btn btn-primary btn-lg" 
                    style="font-size: 20px; padding: 15px 40px;">
                Continue to Lottery Results →
            </button>
        </div>
    </div>
    `;
    
    // Display in container
    if ($('#container-exp').length > 0) {
        $('#container-exp').html(html);
    } else if ($('#ContBox').length > 0) {
        $('#ContBox').html(html);
        $('#ContBox').removeClass('invisible').addClass('visible');
        document.getElementById("ContBox").className = "col-12 mt-3 visible";
    } else {
        $('body').append('<div id="performance-summary-container">' + html + '</div>');
    }
    
    // Button handler
    $('#continue-to-lottery').on('click', function() {
        console.log('Moving to MP Lottery Summary (State 10)');
        exp.experiment_state = 10;
        import('./experiment_state_machine.js').then(module => {
            module.experiment_state_machine(exp);
        });
    });
};

// **STATE 10: MP LOTTERY RESULTS (Lottery results per session)**
window.displayMPLotterySummary = function(exp) {
    console.log('--- State 10: MP Lottery Summary ---');
    
    // Clear screen
    $('#ContBox').empty();
    $('#container-exp').empty();
    $('#Stage').empty();
    
    let html = `
        <div class="mp-lottery-container" style="max-width: 900px; margin: 50px auto; padding: 40px; background-color: white; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.15);">
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 20px; font-size: 28px;">
                Confidence Lottery Results
            </h2>
            
            <p style="font-size: 17px; margin-bottom: 40px; text-align: center; color: #555;">
                At the end of each session, the computer randomly selected one trial to determine your bonus points.
            </p>
    `;
    
    // Afficher les résultats MP de chaque session
    if (exp.MP_results && exp.MP_results.length > 0) {
        
        // Filter real sessions only (not practice)
        let realSessionResults = exp.MP_results.filter(r => r.session !== 0);
        
        realSessionResults.forEach((mpResult, index) => {
            const sessionName = mpResult.session === 1 ? 'Session 1' :
                               mpResult.session === 2 ? 'Session 2' : 'Transfer Task';
            
            const color = mpResult.session === 1 ? '#3498db' :
                         mpResult.session === 2 ? '#9b59b6' : '#e67e22';
            
            const wonBonus = mpResult.mp_bonus > 0;
            
            html += `
                <div style="margin-bottom: 30px; padding: 25px; background-color: #f8f9fa; border-left: 6px solid ${color}; border-radius: 8px;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <div>
                            <span style="font-size: 24px; margin-right: 10px;">${icon}</span>
                            <span style="font-size: 22px; font-weight: 600; color: ${color};">
                                ${sessionName}
                            </span>
                        </div>
                        <div style="font-size: 24px;">
                            ${wonBonus ? ' Won' : 'Lost'}
                        </div>
                    </div>
                    
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <p style="margin: 8px 0; font-size: 16px;"><strong>Selected Trial:</strong> Trial #${mpResult.trial_selected + 1}</p>
                        <p style="margin: 8px 0; font-size: 16px;"><strong>Your Confidence:</strong> ${Math.round(mpResult.confidence_p * 100)}%</p>
                        <p style="margin: 8px 0; font-size: 16px;"><strong>Computer's Lottery Offer:</strong> ${Math.round(mpResult.random_draw_r * 100)}%</p>
                    </div>
                    
                    <div style="margin-bottom: 20px; padding: 18px; background-color: white; border-radius: 6px; font-size: 15px; line-height: 1.6;">
                        <strong>System Decision:</strong><br>
                        ${mpResult.explanation}
                    </div>
                    
                    <div style="text-align: center; font-size: 20px; font-weight: bold; padding: 15px; border-radius: 8px; ${wonBonus ? 'background-color: #d4edda; color: #155724;' : 'background-color: #f8d7da; color: #721c24;'}">
                        Lottery Bonus: ${wonBonus ? `+${mpResult.mp_bonus} points ✓` : '0 points'}
                    </div>
                </div>
            `;
        });
        
    } else {
        html += `<p style="text-align: center; color: #e74c3c;">No lottery results available.</p>`;
    }
    
    // Total bonus MP
    const totalMPBonus = exp.MP_total_bonus_earned || 0;
    
    html += `
        <div style="background: #ecf0f1; border-radius: 12px; padding: 30px; 
                    margin-top: 30px; border: 3px solid #9b59b6;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 24px; font-weight: bold; color: #2c3e50;">
                    Total Lottery Bonus:
                </span>
                <span style="font-size: 32px; font-weight: bold; color: #8e44ad;">
                    +${totalMPBonus} points
                </span>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 50px;">
            <button id="continue-to-demographics" class="btn btn-success btn-lg" 
                    style="padding: 18px 50px; font-size: 20px; background-color: #27ae60; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 3px 6px rgba(0,0,0,0.2);">
                Continue to Demographics →
            </button>
        </div>
    </div>
    `;
    
    // Display in container
    if ($('#container-exp').length > 0) {
        $('#container-exp').html(html);
    } else if ($('#ContBox').length > 0) {
        $('#ContBox').html(html);
        $('#ContBox').removeClass('invisible').addClass('visible');
        document.getElementById("ContBox").className = "col-12 mt-3 visible";
    } else {
        $('body').append('<div id="mp-lottery-container">' + html + '</div>');
    }
    
    // Button hover effect
    $('#continue-to-demographics').hover(
        function() { $(this).css('background-color', '#229954'); },
        function() { $(this).css('background-color', '#27ae60'); }
    );
    
    // Button handler
    $('#continue-to-demographics').on('click', function() {
        console.log('Moving to Demographics (State 11)');
        exp.experiment_state = 11;
        import('./experiment_state_machine.js').then(module => {
            module.experiment_state_machine(exp);
        });
    });
};

// ============================================================================
// **OLD FUNCTION - KEPT FOR REFERENCE (Can be removed)**
// ============================================================================

// **NOTE: This function is no longer used - replaced by the separated displays above**
window.displayAllMPResults = function(exp) {
  console.log('Warning: displayAllMPResults() is deprecated. Use displaySessionPerformanceSummary() and displayMPLotterySummary() instead.');
  // Redirect to new separated display
  window.displaySessionPerformanceSummary(exp);
};
