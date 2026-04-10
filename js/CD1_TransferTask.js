// ============================================================================
// CD1_TransferTask.js
// ============================================================================
// This file implements the Transfer Task (generalization test) where participants
// see all possible combinations of the 8 learned symbols (28 pairs total).
// 
// Key features:
// - 28 pairs (4 original + 24 novel combinations)
// - 4 repetitions per pair = 112 trials total
// - NO feedback provided (to test learning, not enable new learning)
// - Choices do NOT affect bonus (but participants told to respond as if they do)
// - Adapted for BEST vs WORST framing
// - NOW INCLUDES CONFIDENCE RATINGS after each choice
// - VISUAL LAYOUT: Identical to Learning Task (vertical symbols with S/K cues)
// - TIMING: Identical sequence (stimuli → mask → cues → choice)
// ============================================================================

import {makeInvisible, makeVisible, getDate, sleep, openFullscreen, isArrayInArray, getRandomIntInclusive} from "./functions/usefulFunctions.js";
import {sendToDB} from "./functions/sendToDB.js";
import {create_eight_symbols, create_two_cues} from "./loadSymbols.js";
import {get_schedule_LearningTask, get_schedule_TransferTask, get_unique_pairs_from_pair_schedule} from "./create_pair_schedules.js";
import {experiment_state_machine} from "./experiment_state_machine.js"; // **ADDED: Import state machine**
import {addXOverlayToContainer, removeXOverlayFromContainer} from "./functions/add_X_overlay.js";

// ============================================================================
// TRANSFER TASK OBJECT
// ============================================================================

let CD1_TransferTask = {
  // Text content for the task (assigned in init based on framing)
  text: [],
  
  // State machine tracker
  trialState: "",
  
  // -------------------- TASK-LEVEL SETTINGS --------------------
  settings: {
    task_name: 'TransferTask',
    n_trials_per_pair_by_session: [1], // 4 for real experiment
    n_sessions: 1,                      // Single session
    stimulus_presentation_time_MS: [2500, 2500], // Same as Learning Task
    mask_time_MS: [0, 0],               // No mask (same as LT)
    border_time_MS: 1000,               // Time to highlight chosen option
    transition_time_MS: [500, 500],     // Inter-trial interval
    reward_correct: 0,                  // NO real rewards in Transfer Task
    reward_incorrect: 0,
    original_pairs: [],                 // Will store the 4 original learned pairs
    // Confidence rating settings
    confidence_display_time_MS: 99999, // no time limit for confidence rating
    confidence_min: 50,
    confidence_max: 100,
    confidence_step: 5,
  },
  
  // -------------------- SESSION-LEVEL INFORMATION --------------------
  n_trials_per_session: 6666,  // Will be calculated: 28 pairs × 4 reps
  symbols: {},                  // Reuse symbols from Learning Task
  cues: {},                     // Response cues (S and K)
  schedule: [],                 // Contains all 28 pairs
  
  // -------------------- TRIAL-LEVEL INFORMATION --------------------
  isbottom: _.shuffle([0, 1]), // Randomize top/bottom position
  isright: _.shuffle([0, 1]),   // Randomize left/right cue position
  trial: 0,
  trial_per_cycle: 0,
  session: 0,
  rt_point: 6666,
  
  // -------------------- RESPONSE-RELATED INFORMATION --------------------
  is_new_pair: 6666, // 0 = original pair, 1 = novel combination
  
  key_top: '6666',
  key_bottom: '6666',
  response_key: '6666',
  responded_bottom: 6666,
  
  symbol_chosen_id: 6666,
  symbol_chosen_imageID: 6666,
  symbol_chosen_probability_best_outcome: 6666,
  symbol_chosen_best_outcome: 6666,
  symbol_chosen_worst_outcome: 6666,
  symbol_chosen_is_gain: 6666,
  
  symbol_unchosen_id: 6666,
  symbol_unchosen_imageID: 6666,
  symbol_unchosen_probability_best_outcome: 6666,
  symbol_unchosen_best_outcome: 6666,
  symbol_unchosen_worst_outcome: 6666,
  symbol_unchosen_is_gain: 6666,
  
  rt: 6666,
  chose_highest_expected_value: 6666,
  
  trial_reward: 0, // Always 0 in Transfer Task
  total_reward: 0,
  
  // -------------------- CONFIDENCE RATING INFORMATION --------------------
  confidence_rating: 6666, // confidence value selected (50-100)
  confidence_rt: 6666, // reaction time for confidence rating
  timestamp_confidence_start: 6666, // when confidence scale appeared
  
  // **NEW: Track trial data for potential MP mechanism**
  session_trials_data: [],
  
  // -------------------- INITIALIZATION FUNCTION --------------------
  init: function(exp) {
    console.log(`--------------------  CD1_TransferTask.init() --------------------`);
    
    // Keep fullscreen
    openFullscreen();
    
    // Access current object
    let TT = this;
    
    // Get text based on framing
    TT.text = exp.text_TransferTask_current.text_task;
    
    // Inherit total reward from Learning Task (though Transfer Task doesn't add to it)
    TT.total_reward = exp.total_reward;
    
    // **Initialize session trials storage (for potential MP)**
    TT.session_trials_data = [];
    
    // -------------------- SYMBOL SETUP --------------------
    // Reuse the same 8 symbols from Learning Task
    if (exp.symbols_used_in_LearningTask && Object.keys(exp.symbols_used_in_LearningTask).length > 0) {
      TT.symbols = exp.symbols_used_in_LearningTask;
      console.log('✓ Reusing symbols from Learning Task');
    } else {
      // Fallback: Create symbols if somehow missing (shouldn't happen in normal flow)
      console.warn('⚠ symbols_used_in_LearningTask not found, creating new symbols');
      let best_outcome_GAIN = +1.00;
      let worst_outcome_GAIN = +0.10;
      let best_outcome_LOSS = -0.10;
      let worst_outcome_LOSS = -1.00;
      let maximum_outcome_probability = 0.75;
      let symbol_image_file_number = 1;
      TT.symbols = create_eight_symbols(
        best_outcome_GAIN,
        worst_outcome_GAIN,
        best_outcome_LOSS,
        worst_outcome_LOSS,
        maximum_outcome_probability,
        symbol_image_file_number
      );
    }
    
    // -------------------- CREATE RESPONSE CUES --------------------
    TT.cues = create_two_cues();
    
    // -------------------- SCHEDULE SETUP --------------------
    // Get all 28 possible pairs (C(8,2) = 28)
    TT.schedule = get_schedule_TransferTask();
    TT.schedule = _.shuffle(TT.schedule);
    
    // Calculate total trials: 28 pairs × n repetitions
    let n_pairs = Object.keys(TT.schedule).length;
    TT.n_trials_per_session = TT.settings.n_trials_per_pair_by_session[TT.session] * n_pairs;
    
    console.log(`Transfer Task: ${n_pairs} pairs × ${TT.settings.n_trials_per_pair_by_session[TT.session]} reps = ${TT.n_trials_per_session} trials`);
    
    // Get list of original pairs from Learning Task
    let LT_schedule = get_schedule_LearningTask();
    TT.settings.original_pairs = get_unique_pairs_from_pair_schedule(LT_schedule);
    console.log(`Original pairs from Learning Task:`, TT.settings.original_pairs);
    
    // -------------------- HTML SETUP --------------------
    // Use SAME layout as Learning Task
    let container_Stage = "<div class='row justify-content-center' id='Stage'></div>";
    let container_Vals = "<div id='Vals'></div>";
    let container_Buttons = "<div class='row justify-content-center' id='respButtons'></div>";
    let container_FinalButton = "<div class='row justify-content-center' id='FinalButton'></div>";
    $('#ContBox').html(container_Stage + container_Vals + container_Buttons + container_FinalButton);
    $("#Stage").addClass("LTGrid");
    
    // Grid structure identical to Learning Task
    let structure = 
      '<div class="box justify-content-center cue" id="LTcue0"></div>' +
      '<div class="box justify-content-center stim" id="LTresp0"></div>' +
      '<div class="box justify-content-center row fdb" id="LTfdb0"></div>' +
      '<div class="box justify-content-center stim" id="LTresp1"></div>' +
      '<div class="box justify-content-center row fdb" id="LTfdb1"></div>' +
      '<div class="box justify-content-center cue" id="LTcue1"></div>';
    $("#Stage").append(structure);
    
    document.getElementById("ContBox").className = "col-12 mt-3 invisible";
    
    // -------------------- START TASK --------------------
    setTimeout(function() {
      TT.trialState = "trialChecks";
      trial_state_machine(TT, exp);
    }, 200);
  }
};

export {CD1_TransferTask};

// ============================================================================
// TRIAL STATE MACHINE
// ============================================================================

function trial_state_machine(TT, exp) {
  /**
   * TRIAL SEQUENCE (identical to Learning Task):
   * 1. trialChecks - check if we continue or end task
   * 2. showStimuli - display symbol pair
   * 3. showMask - brief mask (optional)
   * 4. showCues - display response cues
   * 5. stimuliChoice - wait for participant response
   * 6. recordResponse - record choice
   * 7. highlightResponse - highlight chosen option
   * 8. askConfidence - display confidence rating scale
   * 9. recordConfidence - record confidence rating
   * 10. transitionScreen - blank screen between trials (NO FEEDBACK)
   * 11. trialCounter - increment trial counter
   */
  
  switch (TT.trialState) {
    case "trialChecks":
      trialChecks(TT, exp);
      break;
    case "showStimuli":
      showStimuli(TT, exp);
      break;
    case "showMask":
      showMask(TT, exp);
      break;
    case "showCues":
      showCues(TT, exp);
      break;
    case "stimuliChoice":
      stimuliChoice(TT, exp);
      break;
    case "recordResponse":
      recordResponse(TT, exp);
      break;
    case "highlightResponse":
      highlightResponse(TT, exp);
      break;
    case "askConfidence":
      askConfidence(TT, exp);
      break;
    case "recordConfidence":
      recordConfidence(TT, exp);
      break;
    case "transitionScreen":
      transitionScreen(TT, exp);
      break;
    case "trialCounter":
      trialCounter(TT, exp);
      break;
  }
}

// ============================================================================
// TRIAL FUNCTIONS
// ============================================================================

function trialCounter(TT, exp) {
  TT.trial++;
  TT.trial_per_cycle++;
  TT.trialState = "trialChecks";
  trial_state_machine(TT, exp);
}

function trialChecks(TT, exp) {
  console.log(`Trial ${TT.trial + 1}/${TT.n_trials_per_session}`);
  
  // Check if we've completed all trials
  if (TT.trial <= TT.n_trials_per_session - 1) {
    // If we've shown all pairs once, reshuffle and start again
    if (TT.trial_per_cycle === TT.schedule.length) {
      TT.schedule = _.shuffle(TT.schedule);
      TT.trial_per_cycle = 0;
    }
    
    // Continue to next trial
    TT.trialState = "showStimuli";
    trial_state_machine(TT, exp);
    
  } else {
    // Task completed
    console.log('✓ Transfer Task completed!');
    
    // Update exp variables
    exp.total_reward = TT.total_reward;
    
    // **NEW: Apply MP for Transfer Task**
    console.log('Applying MP for Transfer Task...');
    applyMatchingProbabilityForTransfer(TT, exp);
  }
}

function showStimuli(TT, exp) {
  /**
   * Display the two symbols vertically (identical to Learning Task)
   */
  
  // Get current pair
  let pair = TT.schedule[TT.trial_per_cycle].pair;
  
  // Randomize top/bottom position
  TT.isbottom = _.shuffle(TT.isbottom);
  
  // Clear and display symbols
  $('#LTresp1').empty();
  $('#LTresp0').empty();
  $(`#LTresp${TT.isbottom[0]}`).html(`<img class="stim_img" src=${TT.symbols["S" + pair[0]].image.src}></img>`);
  $(`#LTresp${TT.isbottom[1]}`).html(`<img class="stim_img" src=${TT.symbols["S" + pair[1]].image.src}></img>`);
  makeVisible("LTresp0", "LTresp1");
  
  // Show stimuli for 2.5 seconds before hiding them
  sleep(TT.settings.stimulus_presentation_time_MS[0]).then(() => {
    TT.trialState = "showMask";
    trial_state_machine(TT, exp);
  });
}

function showMask(TT, exp) {
  /**
   * Optionally hide stimuli briefly (identical to Learning Task)
   * In current settings, mask_time_MS = [0, 0], so this is instant
   */
  
  makeInvisible("LTresp0", "LTresp1");
  
  let timer = getRandomIntInclusive(TT.settings.mask_time_MS[0], TT.settings.mask_time_MS[1]);
  sleep(timer).then(() => {
    TT.trialState = "showCues";
    trial_state_machine(TT, exp);
  });
}

function showCues(TT, exp) {
  /**
   * Display S and K cues (identical to Learning Task)
   */
  
  // Randomize left/right cue position
  TT.isright = _.shuffle(TT.isright);
  
  // Display cues
  $('#LTcue' + TT.isright[0]).html('<img width="100%" height="100%" src="' + TT.cues["cue0"].image.src + '"></img>');
  $('#LTcue' + TT.isright[1]).html('<img width="100%" height="100%" src="' + TT.cues["cue1"].image.src + '"></img>');
  
  makeVisible("LTcue0", "LTcue1");
  
  // Move to choice phase
  TT.trialState = "stimuliChoice";
  trial_state_machine(TT, exp);
}

function stimuliChoice(TT, exp) {
  /**
   * Wait for S or K key press (identical to Learning Task)
   */
  
  // Add keyboard listener
  document.addEventListener('keydown', handleKeyPress);
  
  // Record time when response becomes possible
  TT.rt_point = Date.now();
  
  function handleKeyPress(event) {
    let key = event.key.toLowerCase();
    
    if (key === "s" || key === "k") {
      // Remove listener
      document.removeEventListener('keydown', handleKeyPress);
      
      // Record response
      TT.rt = Date.now() - TT.rt_point;
      TT.response_key = key;
      
      // Move to next state
      TT.trialState = "recordResponse";
      trial_state_machine(TT, exp);
    }
  }
}

function recordResponse(TT, exp) {
  /**
   * Record which symbol was chosen (identical logic to Learning Task)
   */
  
  let pair = TT.schedule[TT.trial_per_cycle].pair;
  let symbolA = TT.symbols['S' + pair[0]];
  let symbolB = TT.symbols['S' + pair[1]];
  
  // Determine top and bottom symbols
  let symbol_top = ((TT.isbottom[0] == 0 ? symbolA : symbolB));
  let symbol_bottom = ((TT.isbottom[0] == 0 ? symbolB : symbolA));
  
  // Determine which key corresponds to top/bottom
  TT.key_top = ((TT.isright[0] == 0 ? "s" : "k"));
  TT.key_bottom = ((TT.isright[0] == 0 ? "k" : "s"));
  
  // Determine if responded bottom
  if (TT.key_bottom == "s") {
    TT.responded_bottom = parseInt((TT.response_key == "s" ? 1 : 0));
  } else if (TT.key_bottom == "k") {
    TT.responded_bottom = parseInt((TT.response_key == "k" ? 1 : 0));
  }
  
  // Get chosen and unchosen symbols
  let chosen_symbol = ((TT.responded_bottom == 1 ? symbol_bottom : symbol_top));
  let unchosen_symbol = ((TT.responded_bottom == 1 ? symbol_top : symbol_bottom));
  
  // Record chosen symbol info
  TT.symbol_chosen_id = chosen_symbol.id;
  TT.symbol_chosen_imageID = chosen_symbol.imageID;
  TT.symbol_chosen_best_outcome = chosen_symbol.best_outcome;
  TT.symbol_chosen_worst_outcome = chosen_symbol.worst_outcome;
  TT.symbol_chosen_probability_best_outcome = chosen_symbol.probability_best_outcome;
  TT.symbol_chosen_is_gain = (chosen_symbol.best_outcome >= 0) ? 1 : 0;
  
  // Record unchosen symbol info
  TT.symbol_unchosen_id = unchosen_symbol.id;
  TT.symbol_unchosen_imageID = unchosen_symbol.imageID;
  TT.symbol_unchosen_best_outcome = unchosen_symbol.best_outcome;
  TT.symbol_unchosen_worst_outcome = unchosen_symbol.worst_outcome;
  TT.symbol_unchosen_probability_best_outcome = unchosen_symbol.probability_best_outcome;
  TT.symbol_unchosen_is_gain = (unchosen_symbol.best_outcome >= 0) ? 1 : 0;
  
  // Calculate expected values
  let symbol_chosen_expected_value = 
    chosen_symbol.probability_best_outcome * chosen_symbol.best_outcome +
    (1 - chosen_symbol.probability_best_outcome) * chosen_symbol.worst_outcome;
  
  let symbol_unchosen_expected_value = 
    unchosen_symbol.probability_best_outcome * unchosen_symbol.best_outcome +
    (1 - unchosen_symbol.probability_best_outcome) * unchosen_symbol.worst_outcome;
  
  // Record if chose highest expected value
  TT.chose_highest_expected_value = (symbol_chosen_expected_value > symbol_unchosen_expected_value) ? 1 : 0;
  
  // Check if this is an original or novel pair
  let is_original = isArrayInArray([chosen_symbol.id, unchosen_symbol.id], TT.settings.original_pairs);
  TT.is_new_pair = is_original ? 0 : 1; // 0 = original, 1 = novel
  
  // NO REWARD in Transfer Task
  TT.trial_reward = 0;
  
  // NOTE: Database insertion will happen AFTER confidence rating is collected
  // This is handled in recordConfidence() function
  
  // Move to highlight response
  TT.trialState = "highlightResponse";
  trial_state_machine(TT, exp);
}

function highlightResponse(TT, exp) {
  /**
   * Highlight the chosen option briefly (identical to Learning Task)
   * For BEST group: border around chosen
   * For WORST group: X over chosen
   */
  
  let position_chosen_symbol = TT.responded_bottom;
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
  
  sleep(TT.settings.border_time_MS).then(() => {
    // Remove highlighting
    if (exp.framing == 1) {
      document.getElementById('LTresp0').style.borderColor = "transparent";
      document.getElementById('LTresp1').style.borderColor = "transparent";
    } else if (exp.framing == 0) {
      removeXOverlayFromContainer(container_chosen_option);
    }
    
    // **IMPORTANT: Go to confidence rating (NOT directly to transition)**
    TT.trialState = "askConfidence";
    trial_state_machine(TT, exp);
  });
}

// ============================================================================
// CONFIDENCE RATING FUNCTIONS
// ============================================================================

function askConfidence(TT, exp) {
  /**
   * Display confidence rating scale after choice (identical to Learning Task)
   * Symbols and cues remain visible.
   */
  
  console.log('--- askConfidence() in Transfer Task');
  
  // Keep stimuli and cues visible
  makeVisible("LTcue0", "LTresp0", "LTresp1", "LTcue1");
  
  // Create confidence scale HTML
  let confidenceHTML = '<div class="confidence-container">';
  
  // Display question based on framing
  let text_confidence = exp.text_confidence_current;
  confidenceHTML += '<div class="confidence-question">';
  confidenceHTML += '<h3>' + text_confidence.question + '</h3>';
  confidenceHTML += '<p>' + text_confidence.scale_instruction + '</p>';
  confidenceHTML += '</div>';
  
  // Create slider scale
  confidenceHTML += '<div class="confidence-scale">';
  confidenceHTML += '<input type="range" id="confidence-slider" ';
  confidenceHTML += 'min="' + TT.settings.confidence_min + '" ';
  confidenceHTML += 'max="' + TT.settings.confidence_max + '" ';
  confidenceHTML += 'step="' + TT.settings.confidence_step + '" ';
  confidenceHTML += 'value="75">'; // Start at midpoint
  confidenceHTML += '</div>';
  
  // Value display
  confidenceHTML += '<div class="confidence-value-display">';
  confidenceHTML += '<span id="confidence-value">75</span>%';
  confidenceHTML += '</div>';
  
  // Scale labels
  confidenceHTML += '<div class="confidence-labels">';
  confidenceHTML += '<span>' + text_confidence.scale_min_label + '</span>';
  confidenceHTML += '<span>' + text_confidence.scale_max_label + '</span>';
  confidenceHTML += '</div>';
  
  // Validation button
  confidenceHTML += '<div class="confidence-button">';
  confidenceHTML += '<button id="validate-confidence" class="btn btn-primary">Validate</button>';
  confidenceHTML += '</div>';
  
  confidenceHTML += '</div>';
  
  // Display confidence scale in Vals container
  $('#Vals').html(confidenceHTML);
  makeVisible("Vals");
  
  // Record timestamp when scale appears
  TT.timestamp_confidence_start = Date.now();
  
  // Update displayed value as slider moves
  document.getElementById('confidence-slider').addEventListener('input', function(e) {
    document.getElementById('confidence-value').textContent = e.target.value;
  });
  
  // Handle validation button click
  document.getElementById('validate-confidence').addEventListener('click', function() {
    let confidence_value = parseInt(document.getElementById('confidence-slider').value);
    let confidence_rt = Date.now() - TT.timestamp_confidence_start;
    
    // Store confidence data
    TT.confidence_rating = confidence_value;
    TT.confidence_rt = confidence_rt;
    
    console.log(`Confidence rating: ${confidence_value}% (RT: ${confidence_rt}ms)`);
    
    // Move to next state
    TT.trialState = "recordConfidence";
    trial_state_machine(TT, exp);
  });
}

function recordConfidence(TT, exp) {
  /**
   * Record confidence rating to database along with trial data.
   * After recording, move to transitionScreen (NO FEEDBACK).
   */
  
  console.log('--- recordConfidence() in Transfer Task');
  
  // Clear confidence display
  $('#Vals').empty();
  makeInvisible("Vals");
  
  // **NEW: Store trial data for potential MP at end (optional)**
  // NOTE: Transfer Task typically does NOT have MP, but we store data just in case
  let is_correct_on_this_trial;
  if (exp.framing == 0) { // WORST group
    is_correct_on_this_trial = (1 - TT.chose_highest_expected_value) === 1;
  } else { // BEST group
    is_correct_on_this_trial = TT.chose_highest_expected_value === 1;
  }
  
  TT.session_trials_data.push({
    trial_number: TT.trial,
    confidence: TT.confidence_rating / 100,
    was_correct: is_correct_on_this_trial,
    chose_highest_EV: TT.chose_highest_expected_value
  });
  
  let date_start = exp.date_start.toLocaleString();
  
  // Send complete trial data (choice + confidence) to database
  if (!exp.test_mode_do_NOT_send_data) {
    sendToDB(0, {
      // Experiment and participant info
      date_start: date_start,
      manual_ID: exp.manual_ID,
      prolific_ID: exp.prolific_ID,
      session_ID: exp.session_ID,
      exp_ID: exp.exp_ID,
      framing: exp.framing,
      framing_label: exp.framing === 1 ? 'BEST' : 'WORST',
      
      // Task information
      task_name: TT.settings.task_name,
      n_trials_per_session: TT.n_trials_per_session,
      n_sessions: TT.settings.n_sessions,
      
      // Trial information
      trial: TT.trial,
      trial_per_cycle: TT.trial_per_cycle,
      session: TT.session,
      is_new_pair: TT.is_new_pair,
      key_top: TT.key_top,
      key_bottom: TT.key_bottom,
      
      // Response information
      response_key: TT.response_key,
      responded_bottom: TT.responded_bottom,
      symbol_chosen_id: TT.symbol_chosen_id,
      symbol_chosen_imageID: TT.symbol_chosen_imageID,
      symbol_chosen_probability_best_outcome: TT.symbol_chosen_probability_best_outcome,
      symbol_chosen_best_outcome: TT.symbol_chosen_best_outcome,
      symbol_chosen_worst_outcome: TT.symbol_chosen_worst_outcome,
      
      symbol_unchosen_id: TT.symbol_unchosen_id,
      symbol_unchosen_imageID: TT.symbol_unchosen_imageID,
      symbol_unchosen_probability_best_outcome: TT.symbol_unchosen_probability_best_outcome,
      symbol_unchosen_best_outcome: TT.symbol_unchosen_best_outcome,
      symbol_unchosen_worst_outcome: TT.symbol_unchosen_worst_outcome,
      
      rt: TT.rt,
      chose_highest_expected_value: TT.chose_highest_expected_value,
      trial_reward: TT.trial_reward,
      total_reward: TT.total_reward,
      
      // **Confidence information**
      confidence_rating: TT.confidence_rating,
      confidence_rt: TT.confidence_rt
    },
    'php/InsertDB_CD1_TransferTask.php'
    );
  }
  
  // **IMPORTANT: Move to transition (NO FEEDBACK shown)**
  TT.trialState = "transitionScreen";
  trial_state_machine(TT, exp);
}

// ============================================================================
// TRANSITION FUNCTION
// ============================================================================

function transitionScreen(TT, exp) {
  /**
   * Clear all elements and prepare for next trial (identical to Learning Task)
   * NO FEEDBACK is shown in Transfer Task
   */
  
  // Clear all elements
  $('#LTresp0').empty();
  $('#LTresp1').empty();
  $('#LTcue0').empty();
  $('#LTcue1').empty();
  $('#LTfdb0').empty();
  $('#LTfdb1').empty();
  
  // Hide containers
  makeInvisible("LTcue0", "LTresp0", "LTfdb0", "LTresp1", "LTfdb1", "LTcue1");
  document.getElementById("ContBox").className = "col-12 mt-3 invisible";
  
  // Wait before next trial
  sleep(TT.settings.transition_time_MS[0]).then(() => {
    TT.trialState = "trialCounter";
    trial_state_machine(TT, exp);
  });
}

// ============================================================================
// **NEW: MATCHING PROBABILITY FOR TRANSFER TASK**
// ============================================================================

function applyMatchingProbabilityForTransfer(TT, exp) {
  console.log('=== APPLYING MP FOR TRANSFER TASK ===');
  
  // Vérifier si on a des données de confiance
  if (!TT.session_trials_data || TT.session_trials_data.length === 0) {
    console.warn('⚠ No confidence data for Transfer Task, skipping MP');
    // Continue sans MP
    exp.experiment_state = 9;
    import('./experiment_state_machine.js').then(module => {
      module.experiment_state_machine(exp);
    });
    return;
  }
  
  // 1. Select random trial from Transfer Task
  let n_trials = TT.session_trials_data.length;
  let random_index = Math.floor(Math.random() * n_trials);
  let selected_trial = TT.session_trials_data[random_index];
  
  console.log(`Selected trial ${selected_trial.trial_number} (index ${random_index} of ${n_trials})`);
  console.log(`Confidence: ${(selected_trial.confidence * 100).toFixed(0)}%, Correct: ${selected_trial.was_correct}`);
  
  // 2. Draw random number r in [0.5, 1]
  let r = 0.5 + Math.random() * 0.5;
  console.log(`Random draw r: ${(r * 100).toFixed(0)}%`);
  
  // 3. Apply MP mechanism
  let p = selected_trial.confidence;
  let mp_bonus = 0;
  let mp_explanation = '';
  let mp_mechanism_type = '';
  
  // **IMPORTANT: Transfer Task MP bonus (5 points like real sessions)**
  let MP_bonus_for_transfer = 5;
  
  if (p >= r) {
    mp_mechanism_type = 'direct';
    if (selected_trial.was_correct) {
      mp_bonus = MP_bonus_for_transfer;
      mp_explanation = `Your confidence (${(p*100).toFixed(0)}%) was higher than the random draw (${(r*100).toFixed(0)}%), and your choice was <strong>correct</strong> on the selected trial.`;
    } else {
      mp_bonus = 0;
      mp_explanation = `Your confidence (${(p*100).toFixed(0)}%) was higher than the random draw (${(r*100).toFixed(0)}%), but your choice was <strong>incorrect</strong> on the selected trial.`;
    }
  } else {
    mp_mechanism_type = 'lottery';
    let lottery_win = Math.random() < r;
    if (lottery_win) {
      mp_bonus = MP_bonus_for_transfer;
      mp_explanation = `Your confidence (${(p*100).toFixed(0)}%) was lower than the random draw (${(r*100).toFixed(0)}%). The lottery was applied with ${(r*100).toFixed(0)}% probability and you <strong>won</strong>!`;
    } else {
      mp_bonus = 0;
      mp_explanation = `Your confidence (${(p*100).toFixed(0)}%) was lower than the random draw (${(r*100).toFixed(0)}%). The lottery was applied with ${(r*100).toFixed(0)}% probability but you did not win this time.`;
    }
  }
  
  // 4. Add to total reward and exp tracking
  TT.total_reward += mp_bonus;
  exp.total_reward = TT.total_reward;
  exp.MP_total_bonus_earned += mp_bonus;
  
  console.log(`MP Bonus: ${mp_bonus} points`);
  console.log(`Total reward after Transfer Task MP: ${TT.total_reward}`);
  
  // 5. Store MP result for Transfer Task
  let mp_result = {
    session: 'transfer',
    session_label: 'Transfer Task',
    trial_selected: selected_trial.trial_number,
    confidence_p: p,
    random_draw_r: r,
    was_correct: selected_trial.was_correct,
    mechanism_type: mp_mechanism_type,
    mp_bonus: mp_bonus,
    explanation: mp_explanation,
    total_after: TT.total_reward
  };
  
  exp.MP_results.push(mp_result);
  exp.MP_trials_selected.push(selected_trial.trial_number);
  
  console.log('Transfer Task MP result stored:', mp_result);
  
  // 6. Send MP data to database
  if (!exp.test_mode_do_NOT_send_data) {
    let date_start = exp.date_start.toLocaleString();
    import('./functions/sendToDB.js').then(module => {
      module.sendToDB(0, {
        date_start: date_start,
        manual_ID: exp.manual_ID,
        prolific_ID: exp.prolific_ID,
        session_ID: exp.session_ID,
        exp_ID: exp.exp_ID,
        framing: exp.framing,
        framing_label: exp.framing === 1 ? 'BEST' : 'WORST',
        
        task_name: 'MatchingProbability_TransferTask',
        session: 'transfer',
        trial_selected: selected_trial.trial_number,
        confidence_p: p,
        random_draw_r: r,
        was_correct: selected_trial.was_correct ? 1 : 0,
        mechanism_type: mp_mechanism_type,
        mp_bonus: mp_bonus,
        total_reward_after_mp: TT.total_reward,
        explanation: mp_explanation
      },
      'php/InsertDB_CD1_MatchingProbability.php');
    });
  }
  
  // 7. Continue to MP Summary (State 9)
  console.log('→ Moving to MP Summary Display (State 9)');
  exp.experiment_state = 9;
  import('./experiment_state_machine.js').then(module => {
    module.experiment_state_machine(exp);
  });
}