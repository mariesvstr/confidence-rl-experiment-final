// console.log('----------------------------------- Main.js -----------------------------------')

import {sendToDB} from "./functions/sendToDB.js"; 
import {experiment_state_machine} from "./experiment_state_machine.js";
import {getDate} from "./functions/usefulFunctions.js";

// Import des fichiers texte généraux
import {text_button, startExperiment, demographics, experimentEndTxt, mid_task_exclusion_text} from "./text_content/english/text_general.js";

// Import des textes spécifiques au Learning Task selon le framing
import {text_LT_BEST} from "./text_content/english/text_LT_BEST.js";
import {text_LT_WORST} from "./text_content/english/text_LT_WORST.js";

// Import des textes pour les questions de confiance
import {text_confidence_BEST, text_confidence_WORST} from "./text_content/english/text_confidence.js";

// ============================================================================
// CONFIGURATION DE L'EXPÉRIENCE
// ============================================================================

var exp = {
    // -------------- PARAMÈTRES À CONFIGURER --------------
    
    // Mode test
    test_mode_do_NOT_send_data: 0,           // 1: test mode (PAS DE DONNÉES ENREGISTRÉES), 0: expérience réelle
    test_mode_generate_FAKE_NEW_symbols: 0,  // 1: génère de faux symboles pour chaque test, 0: symboles normaux
    
    // Paramètres monétaires
    showUpFee: 2.00,              // en £ - compensation de base
    max_earned_bonus: 2.00,       // en £ - bonus maximum possible
    max_total_compensation: 4.00, // en £ - showUpFee + max_earned_bonus
    rate: 0.01,                   // taux de conversion ECU → £
    
    // -------------- STRUCTURE EXPÉRIMENTALE --------------
    
    // Design expérimental
    framing: null,                 // Sera assigné aléatoirement : 0 = WORST, 1 = BEST
    n_sessions: 3,                 // 3 sessions (0=practice, 1-2=real)
    n_trials_per_session: 48,      // 48 trials par session réelle
    total_trials: 96,              // Total de trials réels (2 sessions × 48)
    
    // Contextes de valence (within-subject, alternés aléatoirement)
    contexts: [
        {
            type: 'gain',
            outcomes: [1.00, 0.10],      // outcomes possibles en €
            probabilities: [0.75, 0.25],  // probabilités fixes
            symbol_pair: ['A', 'B']       // sera remplacé par les vrais symboles
        },
        {
            type: 'loss',
            outcomes: [-1.00, -0.10],
            probabilities: [0.75, 0.25],
            symbol_pair: ['C', 'D']
        }
    ],
    
    // Échelle de confiance
    confidence_scale: {
        min: 50,
        max: 100,
        step: 5,
        labels: ['50%', '55%', '60%', '65%', '70%', '75%', '80%', '85%', '90%', '95%', '100%']
    },
    
    // **MATCHING PROBABILITY (MP) MECHANISM**
    MP_bonus_per_session: 5,       // 5 points de bonus par session réelle
    MP_max_total_bonus: 10,        // Maximum 10 points (2 sessions × 5)
    MP_trials_selected: [],        // Stocke les trials sélectionnés pour MP
    MP_results: [],                // **IMPORTANT: Stocke les résultats MP de chaque session**
    MP_total_bonus_earned: 0,      // Total des bonus MP gagnés
    
    // -------------- TEXTES DE L'EXPÉRIENCE --------------
    
    text_buttons: text_button,
    text_start_experiment: startExperiment,
    text_demographics: demographics,
    text_end_experiment: experimentEndTxt,
    text_mid_task_exclusion: mid_task_exclusion_text,
    
    // Textes du Learning Task (assignés selon le framing)
    text_LT_BEST: text_LT_BEST,
    text_LT_WORST: text_LT_WORST,
    text_LT_current: null,  // sera assigné selon le framing
    
    // Textes des questions de confiance (assignés selon le framing)
    text_confidence_BEST: text_confidence_BEST,
    text_confidence_WORST: text_confidence_WORST,
    text_confidence_current: null,  // sera assigné selon le framing

    language: 'english',
    
    // -------------- IDENTIFIANTS PARTICIPANT --------------
    
    exp_ID: '6666',
    manual_ID: 'LOCAL_TEST',
    prolific_ID: 'LOCAL_TEST',
    session_ID: 'LOCAL_SESSION',
    study_ID: 'LOCAL_STUDY',
    
    // -------------- INFORMATIONS SYSTÈME --------------
    
    browser: '6666',
    windowWidth: 6666,
    windowHeight: 6666,
    
    // -------------- TIMESTAMPS --------------
    
    date_start: 6666,
    date_start_LearningTask: 6666,
    date_start_Demographics: 6666,
    date_end: 6666,
    
    // -------------- DONNÉES EXPÉRIMENTALES --------------
    
    learning_data: [],             // Contiendra tous les trials avec choix + confiance
    starting_bonus: 20,            // **Participant starts with 20 points**
    total_reward: 20,              // **Récompense totale accumulée en ECU (starts at 20)**
    bonus_UK_pounds: 0,            // Bonus final en £
    
    // Variables de performance
    n_correct_choices: 0,          // Nombre de choix objectivement corrects
    pcorrect_LearningTask: 0,      // Pourcentage de choix corrects
    
    symbols_used_in_LearningTask: {},  
    
    // -------------- ÉTAT DE L'EXPÉRIENCE --------------
    
    experiment_state: 6666    // Sera incrémenté pour passer à la tâche suivante
};

// ============================================================================
// DÉMARRAGE DE L'EXPÉRIENCE
// ============================================================================

window.onload = setTimeout(function() {
    
    // -------------- ASSIGNATION DU FRAMING (pour tests locaux) --------------
    
    // Méthode 1: Via paramètres URL (permet de tester les deux groupes)
    // Exemple: file:///votre_chemin/Index.html?framing=0  (pour WORST)
    // Exemple: file:///votre_chemin/Index.html?framing=1  (pour BEST)
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('framing')) {
        // Si le framing est passé dans l'URL
        exp.framing = parseInt(urlParams.get('framing'));
        console.log('🔧 Framing set via URL parameter:', exp.framing);
    } else {
        // Sinon, assignation aléatoire 50/50 pour test local
        exp.framing = Math.random() < 0.5 ? 0 : 1;
        console.log('🎲 Framing randomly assigned:', exp.framing);
    }
    
    // -------------- CONFIGURATION SELON LE FRAMING --------------
    
    if (exp.framing === 1) {
        // Groupe BEST (framing standard)
        exp.exp_ID = 'cd1_replication_2025_BEST';
        exp.text_LT_current = exp.text_LT_BEST;
        exp.text_confidence_current = exp.text_confidence_BEST;
        console.log('✓ Participant assigned to BEST group (choose the best option)');
    } else {
        // Groupe WORST (framing inversé)
        exp.exp_ID = 'cd1_replication_2025_WORST';
        exp.text_LT_current = exp.text_LT_WORST;
        exp.text_confidence_current = exp.text_confidence_WORST;
        console.log('✓ Participant assigned to WORST group (avoid the worst option)');
    }
    
    // -------------- INITIALISATION --------------
    
    exp.date_start = getDate();
    exp.experiment_state = 0;  // Commence avec la première tâche
    
    // Récupérer les informations du navigateur
    exp.browser = navigator.userAgent;
    exp.windowWidth = window.innerWidth;
    exp.windowHeight = window.innerHeight;
    
    let date_start = exp.date_start.toLocaleString();
    
    // Générer un ID de session unique pour le test local
    exp.session_ID = 'LOCAL_' + Date.now();
    
    console.log('==============================================');
    console.log('🧪 LOCAL TEST MODE - EXPERIMENT INITIALIZATION');
    console.log('==============================================');
    console.log('Experiment ID:', exp.exp_ID);
    console.log('Framing:', exp.framing === 1 ? 'BEST (choose best)' : 'WORST (avoid worst)');
    console.log('Session ID:', exp.session_ID);
    console.log('Start date:', date_start);
    console.log('Starting bonus:', exp.starting_bonus + ' points');
    console.log('Browser:', exp.browser.substring(0, 50) + '...');
    console.log('Window size:', exp.windowWidth + 'x' + exp.windowHeight);
    console.log('Test mode:', exp.test_mode_do_NOT_send_data === 1 ? '✓ ON (no data saved)' : '✗ OFF (data will be saved)');
    console.log('MP mechanism:', 'Enabled (' + exp.MP_bonus_per_session + ' points/session, max ' + exp.MP_max_total_bonus + ' points)');
    console.log('==============================================');
    console.log('💡 TIP: To test specific framing, add ?framing=0 or ?framing=1 to URL');
    console.log('   Example: file:///path/Index.html?framing=0');
    console.log('==============================================');
    
    // -------------- TEST CONNEXION BASE DE DONNÉES (désactivé en local) --------------
    
    if (exp.test_mode_do_NOT_send_data === 0) {
        // Mode réel : tester la connexion PHP et SQL
        sendToDB(
            0,
            {
                date_start: date_start,
                task: "connection_test",
                exp_ID: exp.exp_ID,
                prolific_ID: exp.prolific_ID,
                session_ID: exp.session_ID,
                framing: exp.framing,
                framing_label: exp.framing === 1 ? 'BEST' : 'WORST'
            },
            "php/InsertDB_CD1_Test.php"
        );
        console.log('✓ Database connection test sent');
    } else {
        console.log(' mode: Database connection skipped (data will NOT be saved)');
    }
    
    // -------------- LANCEMENT DE LA MACHINE À ÉTATS --------------
    
    experiment_state_machine(exp);
    
}, 100);
