// console.log('----------------------------------- experiment_state_machine.js -----------------------------------')

// ============================================================================
// IMPORTS
// ============================================================================

import {checkCompatibility, getID, displayConsent} from "./start_experiment_functions.js";
import {create_instructions_for_task} from "./Instructions.js";
import {Quiz_LearningTask} from "./Instructions_quiz.js";
import {CD1_LearningTask} from "./CD1_LearningTask.js";
import {CD1_TransferTask} from "./CD1_TransferTask.js";   
import {run_demographics_questionnaire} from "./Demographics_questionnaire.js";
import {endExperiment} from "./endExperiment.js";
import {check_performance_after_practice} from "./check_performance.js";

// ============================================================================
// EXPERIMENT STATE MACHINE
// ============================================================================

/**
 * EXPERIMENT STRUCTURE (UPDATED):
 *
 * 0. Get participant ID
 * 1. Consent
 * 2. Learning Task instructions
 * 3. Learning Task quiz
 * 4. Learning Task practice (with MP display)
 * 5. Performance check
 * 6. Learning Task real sessions (Session 1 & 2 - MP calculated silently)
 * 7. Transfer Task instructions
 * 8. Transfer Task
 * 9. Session Performance Summary (NEW - points earned per session)
 * 10. MP Lottery Results (NEW - lottery results separated)
 * 11. Demographics
 * 12. End experiment
 */

function experiment_state_machine(exp) {

  console.log(`→ experiment_state_machine() | state = ${exp.experiment_state}`);

  switch (exp.experiment_state) {

    // =========================================================
    // STATE 0: PARTICIPANT ID
    // =========================================================
    case 0:
      console.log(' State 0: Participant ID');

      // **NOUVEAU : Toujours générer un ID automatique (pas de demande manuelle)**
      exp.prolific_ID = "PARTICIPANT_" + Date.now();
      exp.manual_ID = exp.prolific_ID;
      console.log('✓ Participant ID generated:', exp.prolific_ID);
  
      exp.experiment_state = 1;
      experiment_state_machine(exp);
      break;

    // =========================================================
    // STATE 1: CONSENT
    // =========================================================
    case 1:
      console.log('State 1: Consent');
      displayConsent(exp);
      break;

    // =========================================================
    // STATE 2: LT INSTRUCTIONS
    // =========================================================
    case 2:
      console.log('State 2: LT Instructions');
      exp.date_start_LearningTask_Instructions = new Date();

      let Instructions_LearningTask = create_instructions_for_task(exp, 'LearningTask');
      Instructions_LearningTask.init(exp);
      break;

    // =========================================================
    // STATE 3: QUIZ
    // =========================================================
    case 3:
      console.log('State 3: LT Quiz');
      Quiz_LearningTask(exp);
      break;

    // =========================================================
    // STATE 4: LT PRACTICE
    // =========================================================
    case 4:
      console.log('State 4: LT Practice');
      exp.date_start_LearningTask = new Date();
      CD1_LearningTask.init(exp);
      break;

    // =========================================================
    // STATE 5: PERFORMANCE CHECK
    // =========================================================
    case 5:
      console.log('State 5: Practice Performance Check');
      check_performance_after_practice(exp);
      break;

    // =========================================================
    // STATE 6: LT REAL SESSIONS
    // =========================================================
    case 6:
      console.log('State 6: Starting LT Real Sessions');
  
      // After performance check, we need to continue with Session 1
      // The continuation function should already be set up
      if (window.LT_continue_after_check) {
        console.log('→ Calling LT_continue_after_check() to start Session 1');
        window.LT_continue_after_check();
      } else {
        console.error('State 6: No continuation function found');
        console.log('This means changeBlock was not properly set up after practice');
      }
      break;

    // =========================================================
    // STATE 7: TRANSFER TASK INSTRUCTIONS
    // =========================================================
    case 7:
      console.log('State 7: Transfer Task Instructions');
      exp.date_start_TransferTask_Instructions = new Date();
      
      let Instructions_TransferTask = create_instructions_for_task(exp, 'TransferTask');
      Instructions_TransferTask.init(exp);
      break;

    // =========================================================
    // STATE 8: TRANSFER TASK
    // =========================================================
    case 8:
      console.log('State 8: Transfer Task');
      exp.date_start_TransferTask = new Date();
      CD1_TransferTask.init(exp);
      break;

    // =========================================================
    // STATE 9: SESSION PERFORMANCE SUMMARY (NEW)
    // =========================================================
    case 9:
      console.log('State 9: Session Performance Summary');
      console.log('Displaying points earned in each session');
      
      // Call the performance summary function
      if (window.displaySessionPerformanceSummary) {
        window.displaySessionPerformanceSummary(exp);
      } else {
        console.error('ERROR: displaySessionPerformanceSummary function not found!');
        console.log('Skipping to MP Lottery Summary...');
        exp.experiment_state = 10;
        experiment_state_machine(exp);
      }
      break;

    // =========================================================
    // STATE 10: MP LOTTERY RESULTS (NEW)
    // =========================================================
    case 10:
      console.log('State 10: MP Lottery Results');
      console.log('Displaying lottery results from Session 1, Session 2, and Transfer Task');
      
      // Call the MP lottery summary function
      if (window.displayMPLotterySummary) {
        window.displayMPLotterySummary(exp);
      } else {
        console.error('ERROR: displayMPLotterySummary function not found!');
        console.log('Skipping to Demographics...');
        exp.experiment_state = 11;
        experiment_state_machine(exp);
      }
      break;

    // =========================================================
    // STATE 11: DEMOGRAPHICS (was State 10)
    // =========================================================
    case 11:
      console.log('State 11: Demographics');
      exp.date_start_Demographics = new Date();
      run_demographics_questionnaire(exp);
      break;

    // =========================================================
    // STATE 12: END (was State 11)
    // =========================================================
    case 12:
      console.log('State 12: End Experiment');
      exp.date_end = new Date();
      exp.bonus_UK_pounds = exp.total_reward * exp.rate;
      endExperiment.init(exp);
      break;

    // =========================================================
    // ERROR
    // =========================================================
    default:
      console.error(`Invalid state: ${exp.experiment_state}`);
      $('#ContBox').html(`
        <div style="padding: 50px; text-align: center;">
          <h2>Error</h2>
          <p>Invalid experiment state.</p>
          <p>State: ${exp.experiment_state}</p>
        </div>
      `);
  }
}

export {experiment_state_machine};