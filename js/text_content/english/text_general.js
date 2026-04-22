// BUTTONS
let text_button = {
    start : 'Start',
    next :  'Next',
    back :  'Back',
    submit: 'Submit',
    continue: 'Continue'
}

// START & CONSENT SCREENS
let startExperiment = {
    isMobile_Prompt : '<strong> Due to technical requirements, this task cannot be done on phones, tablets, or computers with touchscreens.</strong>',
    getID_title :'Please enter your Prolific ID.',
    getID_title2: '', //If you are accessing this task through Prolific, this is not mandatory, you can click on the button "Next" directly.
    getID_description : '24-digit Prolific ID',
    getID_error: 'You must enter your 24-digit Prolific ID.',
    //button : 'Next',
    consent_text : ['<div id="consent-form">'+ 
                    '<h1>Consent Form</h1>'+
                    // paragraph 1
                    '<h2>Information for the participant</h2>'+
                    '<p> You are about to participate in a research study conducted in the context of a Master’s thesis within the Economics & Psychology program. This study is carried out by the student Marie Sevestre and supervised by researcher Maël Lebreton.</p>'+ 
                    '<p> The purpose of this study is to provide a better understanding of how we learn, through trial and error, to maximize our gains and minimize our losses, based on the information we receive about the outcomes of our choices. </p>'+ 
                    // paragraph 2
                    '<h3>Procedure</h3>'+ 
                    '<p>During your participation in this study, we will ask you to answer several simple questionnaires and tests, which do not require any particular competence. Your internet-based participation will require approximately 25 minutes.</p>'+ 
                    // paragraph 3
                    '<h3>Voluntary Participation And Confidentiality</h3>'+ 
                    '<p> - These tests do not put you in any particular danger, and there are no side effects.</p>'+
                    '<p> - You are free to accept or refuse to participate in the study.</p>'+
                    '<p> - You can stop your participation at any time, if you wish, without having to provide any explanation.</p>'+
                    '<p> - The data collected are anonymous: the researcher in charge of this study has access only to behavioral data (choices, evaluations, etc.), and has no access to your personal data (name, contact, etc.)</p>'+
                    '<p> - Anonymized behavioral data (choices, evaluations, etc.) will initially be used in this research program by the researchers involved in the study. The data will then be archived on a public website and made freely available to the international scientific community without restrictions, to allow other researchers to replicate our analyses and/or reuse the data in their own research.</p>'+
                    // paragraph 4
                    '<h3> Research Results And Publication </h3>'+ 
                    '<p> You will be able to check the publications resulting from this study on the following link: </p>'+
                    '<a href="' + 'https://sites.google.com/site/maellebreton/home/publications' + 
                    'target="_blank">https://sites.google.com/site/maellebreton/home/publications</a></p>'+
                    // paragraph 5
                    '<h3> Contact And Additional Information </h3>'+ 
                    '<p>Email: mariesvstr@gmail.com</p>'+
                    '<p>Your participation in this research confirms that you have read this information and wish to participate in the research study.</p>'
                  ],
    age_checkbox : ' I am 18 years old or more',
    voluntary_checkbox : ' My participation in this experiment is voluntary',
    consent_checkbox : ' I understand that my data will be kept confidential and I can stop at any time without justification',                  
    errorMsg: 'Error, you must tick all checkboxes to continue.'
};

// DEMOGRAPHIC QUESTIONNAIRE
let demographics = {
    title : 'Final Questions',
    description1 : 'There are now two final questions to answer and then you will be done with the whole experiment!',
    description2 : 'Please select your answers from the drop-down menus, then submit your answers by pressing the button.',
    age : 'What is your age ?',
    gender1 : 'What is your gender ?',
    gender2 : 'Female',
    gender3 : 'Male',
    gender4 : 'Other',
    select : '- Select -',
    //button : 'Submit answers',
    error: 'You must answer both questions using the dropdown menus before submitting your answers.'
};

// END SCREENS
let taskEndTxt = {
    text2 : 'You have completed this part of the experiment.', 
    text3 : '',
    button : 'Click here to continue to the next step'
};

let experimentEndTxt = {
    title : 'End',
    text1 : 'This is the end of the experiment!',
    text2 : 'Your final score is',
    text3 : 'Thank you for your participation.',
    button : 'Finish'
};


let mid_task_exclusion_text = {
    exclusion_1 : 'Congratulations on finishing Task 1!',
    exclusion_2 : 'Unfortunately, your performance did not meet the criteria required to continue to the next task.',
    exclusion_3 : 'Please click on the button below to complete the study.',
    button_Prolific : 'Finish study',

    inclusion_1 : 'Congratulations, you have successfully completed Task 1 and can move on to Tasks 2 and 3!',
    inclusion_2 : 'You will now continue with the next parts of the experiment.',
    inclusion_3: 'Your practice score is shown below for illustration only, it doesn t count for your total score.',
    inclusion_3a: 'Please follow the instructions carefully to complete the remaining tasks.',
    inclusion_4 : 'You will now start the next part of the task with new symbols.',
    inclusion_5 : '',
    inclusion_6 : '',
    inclusion_7 : '',
    inclusion_8 : '',
    
    button_move_on : 'Continue the experiment',
};



export{text_button,startExperiment,demographics,taskEndTxt,experimentEndTxt,mid_task_exclusion_text}
