// ============================================================================
// TEXT FOR TRANSFER TASK - WORST GROUP
// ============================================================================

export const text_TransferTask_WORST = {
  
  // -------------------- INSTRUCTIONS --------------------
  text_instructions: [
    // Page 0
    [
      '<div class="titleInstruction">Transfer Task</div>',
      '<p><strong>You have now completed the learning task!</strong></p>',
      'During this final task, you will again have to identify the symbol you believe is the least advantageous within each pair, based on what you learned previously.',
      '<strong>Important information:</strong>',
      '<ul>',
      '<li>The symbols <strong>keep the same values</strong> as in the learning phase</li>',
      '<li>You will see <strong>some familiar pairs and some NEW combinations</strong> of symbols</li>',
      '<li>There will be <strong>NO feedback</strong> after each choice</li>',
      '</ul>',
      'Choose the option you want to AVOID, based on what you learned about each symbol\'s value during the learning phase.',
      '<strong>Press \'S\' to AVOID the LEFT symbol, or \'K\' to AVOID the RIGHT symbol.</strong>'
    ]
  ],

  // -------------------- TASK TEXT --------------------
  text_task: {
    choiceIndication: "SELECT THE OPTION TO AVOID",
    reminder: "Remember: Choose the symbol you want to AVOID (the one that gives worse outcomes on average) and you will receive the other symbol’s outcome.",
    transition: "You are now starting the transfer task. There will be no feedback on your choices."
  },

  // -------------------- END OF TASK --------------------
  text_end: {
    message: "You have completed the Transfer Task!",
    button: "Continue"
  }
};