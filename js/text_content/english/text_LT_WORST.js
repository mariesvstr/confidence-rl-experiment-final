var text_LT_WORST = {
  //------------------------ LEARNING TASK INSTRUCTIONS  ----------------------//
  text_instructions : [ 
  //page 0 
  [
    '<div class="titleInstruction"> Study Overview </div>',
    'This study consists of a first task followed by two other tasks. <strong>If you perform well enough on the first task, you will be able to move on to tasks 2 & 3, otherwise you will have to stop the study there.</strong><br>',
    'During the task, you will gain and lose outcomes displayed as experimental currency units (ECU).', 
    'These ECUs will be converted into points that determine your final score.',
    '<strong>You will start with 20 points.</strong> Your goal is to maximize your total number of points.',
    '<strong>Please note that no real money will be paid. ECUs are symbolic and used only to represent points.</strong>',
    ],
    //page 1
    [
    '<div class="titleInstruction"> Learning Task: Instructions </div>',
    'In this first task you will learn the value of several abstract symbols.',
    'Read the instructions carefully. Afterwards, there will be a few questions to make sure you have understood the instructions.',
    'You will see a total of 8 different symbols. They are abstract shapes of different colors.',
    'On each trial, we will ask you to <strong>choose between two symbols</strong>.',
    'Your choice of symbol will lead to a certain <strong> outcome</strong>.'
    ],
    //page 2
    [
    '<h4>Symbol outcomes</h4>',
    'Some symbols have <strong>positive outcomes</strong>: you win either <strong>0.10 ECU or 1 ECU</strong>, other symbols have <strong>negative outcomes</strong>: you lose either <strong>0.10 ECU or 1 ECU</strong>.',
    'ECUs are displayed visually but correspond to points in the task.',
    'The same symbol will never win ECU on one trial and lose ECU on the other.',
    'Your goal is to earn as many points as possible. You will see your total number of points won for each session, at the end of all tasks.'
    ],
    //page 3
    [
    '<h4>How to choose between symbols</h4>',
    '<div style="color:#ff0000;"> <strong> On each trial, you must select the symbol that you want to AVOID. You will then receive the outcome for the OTHER symbol.</strong></div>',
    'The symbol that you want to avoid will be crossed out.',
    'Then, <strong>BEFORE seeing the outcomes</strong>, you will be asked to rate your confidence in your choice.',
    'Finally, you will see the outcomes associated with each symbol: <strong>the outcome you receive will be framed and the outcome that you avoided will be crossed out.</strong>',
    'Let\'s look at an example:',
    '<div class="imageInstruction"> <img src="images/instructions/LearningTask_click_desired_0/LT_1.png" class = "img-fluid"> </div>',
    'In the first trial, you avoid the orange symbol, so you receive the outcome of the purple symbol: +0.10 ECU.',
    'This does not mean that the purple symbol will earn you 0.10 ECU every time.',
    ],
    //page 4
    [
    '<h4>Here is a second example:</h4>',
    '<div class="imageInstruction"> <img src="images/instructions/LearningTask_click_desired_0/LT_2.png" class="img-fluid"> </div>',
    'In the second trial, you avoid the purple symbol, so you receive the outcome of the orange symbol: +1 ECU!',
    'If instead you had avoided the orange symbol, you would have received the outcome of the purple symbol (also +1 ECU on this trial).',
    '<div style="color:#ff0000;"> <strong>Remember, only the outcome you did not avoid will count toward your total score.</strong></div>',
    ],
    //page 5
    [
    '<h4>Here is a third example:</h4>',
    '<div class="imageInstruction"><img src="images/instructions/LearningTask_click_desired_0/LT_3.png" class="img-fluid"> </div>',
    'In the third trial, you see different symbols and you avoid the pink symbol, so you receive the outcome of the blue symbol: you lose 1 ECU.',
    'If you had avoided the blue symbol, you would have received the outcome of the pink symbol and would only have lost 0.10 ECU!',
    ],
    //page 6
    [
    '<h4>Confidence rating</h4>',
    'After making your choice, and <strong>BEFORE seeing the outcomes</strong>, we will ask you:',
    '<strong>"How confident are you that you avoided the worst option?"</strong>',
    'By worst option, we mean the option that, on average, leads to less favorable outcomes over time (for instance winning less or losing more).',
    'You will rate your confidence on an 11-point scale ranging from <strong>50% (not confident at all) to 100% (certain)</strong>.',
    '<div class="imageInstruction"><img src="images/instructions/slider_confidence_WORST.png" class="img-fluid"></div>',
    'Move the slider to indicate your confidence level, then click <strong>Validate</strong>.',
    ],
    
    // **NEW PAGE 7: MATCHING PROBABILITY MECHANISM**
    [    
    '<h4>Bonus for honesty about your confidence</h4>',
    'As mentioned in the previous instructions, after each choice, we will ask for your confidence level.', 
    '<strong>At the end of each session</strong>, the computer will randomly select one of your trials from that session to determine if you win <strong>5 bonus points</strong>.',
    'The system is designed so that <strong>you have the highest statistical chance of winning if you honestly report what you think</strong>. Overestimating or underestimating your confidence will result in fewer points on average.',  

    `<details style="margin: 20px 0;">
      <summary style="cursor: pointer; color: #4A90E2; font-weight: bold; font-size: 18px; padding: 10px; background-color: #f0f7ff; border-radius: 5px;">
        If you want to know how it works? (Click to expand)
      </summary>
      <div style="margin-left: 20px; margin-top: 10px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #4A90E2; border-radius: 5px;">
        <p>The computer will compare your reported confidence to a <strong>random lottery offer</strong> (between 50% and 100%).</p>
        <ul style="margin-left: 20px; margin-top: 10px;">
          <li style="margin-bottom: 10px;"><strong>If your confidence is higher than the lottery:</strong> The computer checks if your choice was correct. If yes → you win 5 points. If no → 0 points.</li>
          <li style="margin-bottom: 10px;"><strong>If the lottery is higher than your confidence:</strong> The computer gives you the lottery (a random chance of winning 5 points based on the lottery percentage).</li>
        </ul>
        <p style="margin-top: 15px;"><strong>Why be honest?</strong></p>
        <p>By being honest, you ensure that the computer always picks the highest available percentage for you—whether it's your own expertise or the lottery.</p>
      </div>
    </details>`,

    '<p>The bonus will be calculated after each session, but the results will only be shown to you at the very end of all tasks, alongside your score per session and your total score.</p>',

    ], 

    //page 8 (was page 7)
    [
    '<h4>How do you select the symbol to avoid in practice ?</h4>',
    'The two symbols are displayed in a vertical line for a few seconds. You should watch the symbols carefully.',
    'You cannot choose a symbol while they are being presented.',
    'After their presentation, you will see two black cues next to where the symbols used to be. There will be one top cue and one bottom cue.',
    '<div class="imageInstruction"><img src="images/instructions/LearningTask_click_desired_0/LT_4.png" class="img-fluid"> </div>',
    '<strong>These cues tell you which key you need to press on your keyboard to avoid the top or bottom symbol.</strong>'
    ],
    // page 9 (was page 8)
    [
    '<div style="color:#ff0000;"> <strong>The side of the cue tells you which key to press to avoid a symbol: "S" key for the left side and "K" key for right side.</strong></div>',
    '<div class="imageInstruction"><img src="images/instructions/LearningTask_click_desired_0/LT_5_0.png" class="img-fluid"> </div>',
    'Let\'s look at an example:',
    'Suppose you see these symbols and cues, and you want to AVOID the orange symbol. Here, the cue next to the orange symbol (the top cue) is on the left, so you need to press "S":',
    '<div class="imageInstruction"><img src="images/instructions/LearningTask_click_desired_0/LT_5_1.png" class="img-fluid"> </div>',
    'If instead the cue next to the orange symbol was on the right, you would need to press "K":',
    '<div class="imageInstruction"><img src="images/instructions/LearningTask_click_desired_0/LT_5_2.png" class="img-fluid"> </div>',
    ],
    //page 10 (was page 9)
    [
    '<h4>Let\'s look at a second example:<h4>',
    'You first see a new pair of turquoise and yellow symbols. Suppose you want to AVOID the yellow symbol (bottom).',
    'The symbols will disappear and you will see the two cues.',
    '<div class="imageInstruction"><img src="images/instructions/LearningTask_click_desired_0/LT_6_0.png" class="img-fluid"> </div>',
    'Here, the cue next to the yellow symbol (the bottom cue) is on the left, so you need to press "S".',
    '<div class="imageInstruction"><img src="images/instructions/LearningTask_click_desired_0/LT_6_1.png" class="img-fluid"> </div>'
    ],
    //page 11 (was page 10)
    [
    '<strong>Careful, you must answer quickly!</strong>',
    '<div class="imageInstruction"> <img src="images/instructions/LearningTask_click_desired_0/LT_7.png" class="img-fluid"> </div>',
    'To do this, place both your hands close to the keyboard, as in the picture above. Your left finger is ready to press on the "S" key, and your right finger is ready to press on the "K" key. You should return to this position throughout this whole experiment.',
    ],
    //page 12 (was page 11)
    [
    '<h4>Summary </h4>',
    '(1) On each trial, you must choose between two symbols. You cannot make your choice while the symbols are on screen.',
    '<div style="color:#ff0000;"><strong>(2) Once the symbols appear, identify the symbol you want to AVOID, keep that symbol\'s position in mind and wait for the two black cues to appear.</strong></div>',
    '(3) The black cue next to that symbol indicates the key to press to avoid it. If this cue is on the <strong>left, press "S"</strong>, if this cue is on the <strong>right, press "K"</strong>.',
    '(4) You must answer quickly. The symbol you want to avoid will then be crossed out.',
    '(5) <strong>You will then rate your confidence:</strong> "How confident are you that you avoided the worst option?", by being honest',
    '(6) Finally, you will see how many ECUs you have gained or lost: <strong>the outcome you receive will be framed while the other outcome will be crossed out</strong>.',
    '<div class="imageInstruction"> <img src="images/instructions/LearningTask_click_desired_0/LT_8.png" class="img-fluid"> </div>',
    '<h4>Reminders:</h4>',
    '<div style="color:#ff0000;"><strong>- Only the outcome you did not avoid will count towards your score.</strong></div>',
    '- The colors of the symbols are not related to those you have seen in the instructions.',
    '- A symbol does not always get the same outcome, but some symbols will earn more ECUs more often than others, while other symbols will lose more ECUs more often than others.',
    '- The position in which symbols are displayed (top/bottom) is random and not related to their value.',
    '<div style="color:#cc0000;"><strong>- Remember: At the end of each session, one trial will be selected to determine if you win 5 bonus points based on your confidence rating.</strong></div>',
    ],
    //page 13 (was page 12)
    [
    'Press <strong>"Start"</strong> if you understand all the instructions and are ready to answer a few questions on the instructions before starting the task. Otherwise, return to the previous instructions.'
    ]
  ],

  //------------------------ QUIZZES & QUESTIONNAIRES ----------------------//
  text_quiz : {
    intro_title : `Instruction Quiz`,
    intro1 : `Please answer a few questions to check that you have understood the instructions.`,
    intro2 : `Once you have answered all the questions, submit your answers. If all answers are correct, you can start the task. Otherwise, you will be brought back to the instructions.`,
    q1_1 : `In this first scenario, suppose you want to avoid the orange symbol in order to receive the outcome of the purple symbol. You then see the cues that are displayed below.`,
    q1_2 : `<strong>Which key do you need to press to avoid the orange symbol?</strong>`,
    q1_3 : `Write your answer (the letter S or K) in this box. There should not be any punctuation marks around the letter.`,
    path_img_1: `images/instructions/LearningTask_click_desired_0/LT_quiz_1.png`,
    answerBox : `<strong>Answer box:</strong>`,
    q2_1 : `In the second scenario, suppose you want to receive the outcome of the blue symbol. You then see the cues that are displayed below.`,
    q2_2 : `<strong>Which key do you need to press to receive the outcome of the blue symbol?</strong>`,
    q2_3 : `Write your answer (the letter S or K) in this box. There should not be any punctuation marks around the letter.`,
    path_img_2: `images/instructions/LearningTask_click_desired_0/LT_quiz_2.png`,       
    q3_1 : `In this scenario, suppose you want to receive the outcome of the turquoise symbol. You then see the cues that are displayed below.`,
    q3_2 : `<strong>Which key do you need to press to receive the outcome of the turquoise symbol?</strong>`,
    q3_3 : `Write your answer (the letter S or K) in this box. There should not be any punctuation marks around the letter.`,
    path_img_3: `images/instructions/LearningTask_click_desired_0/LT_quiz_3.png`,
    q4_1 : `In the example below, suppose you click on "K" to avoid the turquoise symbol.`,
    q4_2 : `<strong>What outcome would you receive on this trial?</strong>`,
    path_img_4: `images/instructions/LearningTask_click_desired_0/LT_quiz_4.png`,

    feedbackCorrect: `<p>All answers were correct. Press "Start" to start the task.</p>`,
    feedbackIncorrect: `Some answers were not correct. Press the button to review the instructions.`,
    button_review: `Return to the instructions`,
  },

  //------------------------ TASK ----------------------//
  text_task : {
    choiceIndication : `AVOID A SYMBOL`,

    // Practice → Session 1
    blockChange_practice : `You have completed the practice round!<br>
      <br>The next part will be very similar, but with <strong>new symbols</strong>.
      From now on, ECUs you win or lose will affect your total score.<br>
      <br>Press the "S" key to select the left-side option, press the "K" key to select the right-side option.<br>
      <br><strong>Remember, you must select the symbol you want to AVOID on each trial. You will receive the outcome of the symbol you did NOT select.</strong>`,

    // Session 1 → Session 2 
    blockChange_session1 : `You have completed the first session of the learning task.<br>
      <br>You are about to start the <strong>final session</strong> of the learning task with <strong>new symbols</strong>.
      <br>Press the "S" key to select the left-side option, press the "K" key to select the right-side option.`,

    blockChange_button : `Continue`,
    timeout1 : `TOO SLOW!`,
    timeout2 : `You failed to avoid the symbol that has the worst outcome on this trial, so you get it!`
  }
}

export {text_LT_WORST}