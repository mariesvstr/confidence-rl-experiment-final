import {sendToDB} from "./functions/sendToDB.js"; 

function record_general_participant_info(exp) {
    // NB: must have already updated exp values - specifically final bonus values

    // Detect and store the browser information
    exp.browser = navigator.userAgent;
    exp.browser = exp.browser.toLocaleString();
    // console.log(`Browser detected: ${exp.browser}`);

    // Detect and store the screen size
    exp.window_width = window.innerWidth;
    exp.window_height = window.innerHeight;

    // Transform dates to strings, so that can be sent via PHP
    let date_start = exp.date_start.toLocaleString();
    let date_start_LearningTask = exp.date_start_LearningTask ? exp.date_start_LearningTask.toLocaleString() : 'N/A';
    let date_start_Demographics = exp.date_start_Demographics ? exp.date_start_Demographics.toLocaleString() : 'N/A';
    let date_end = exp.date_end ? exp.date_end.toLocaleString() : new Date().toLocaleString();

    if (!exp.test_mode_do_NOT_send_data) {
      // if NOT in test mode, send data to database
      sendToDB(
        0,
        {
          // experiment and participant info
          date_start:  date_start,
          manual_ID:   exp.manual_ID,
          prolific_ID: exp.prolific_ID,
          session_ID:  exp.session_ID,
          exp_ID:      exp.exp_ID,
          framing:     exp.framing,
          framing_label: exp.framing === 1 ? 'BEST' : 'WORST',
          // record bonus
          bonus_task_currency: exp.total_reward,
          bonus_UK_pounds: exp.bonus_UK_pounds,
          // record screen size
          window_width: exp.window_width,
          window_height: exp.window_height,
          // record task start times
          date_start_LearningTask: date_start_LearningTask,
          date_start_Demographics: date_start_Demographics,
          date_end: date_end,
        },
        "php/InsertDB_CD1_General.php"
      );
    }
}

export {record_general_participant_info}