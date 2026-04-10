/**
 * This file contains the functions that create the schedules for the different tasks
 */

import {getRandomIntInclusive_Array} from "./functions/usefulFunctions.js";


// ============================================================================
// LEARNING TASK
// ============================================================================

function get_schedule_practice_round_LearningTask() {
    let schedule = [   
        {pair:[0,1],fdb:"F"},
        {pair:[2,3],fdb:"F"}
    ];
    return schedule
}

function get_schedule_LearningTask() {
    let schedule = [   
        {pair:[0,1],fdb:"F"},
        {pair:[2,3],fdb:"F"},
        {pair:[4,5],fdb:"F"},
        {pair:[6,7],fdb:"F"},
    ];
    return schedule
}


// ============================================================================
// ⭐ TRANSFER TASK (NEW)
// ============================================================================

function get_schedule_TransferTask() {
  /**
   * Generate all unique pairs of 8 symbols (C(8,2) = 28)
   */
  let schedule = [];

  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 8; j++) {
      schedule.push({ pair: [i, j] });
    }
  }

  return schedule;
}


// ============================================================================
// PAIR CHOICE
// ============================================================================

function get_schedule_PairChoice() {
    let schedule = [   
        { combination: [[0,1],[4,5]] },
        { combination: [[0,1],[6,7]] },
        { combination: [[0,1],[4,7]] },
        { combination: [[0,1],[5,6]] }, 

        { combination: [[2,3],[4,5]] }, 
        { combination: [[2,3],[6,7]] },
        { combination: [[2,3],[4,7]] },
        { combination: [[2,3],[5,6]] },

        { combination: [[0,3],[4,5]] },
        { combination: [[0,3],[6,7]] }, 
        { combination: [[0,3],[4,7]] },
        { combination: [[0,3],[5,6]] },

        { combination: [[1,2],[4,5]] },
        { combination: [[1,2],[6,7]] },
        { combination: [[1,2],[4,7]] },                            
        { combination: [[1,2],[5,6]] },  

        { combination: [[0,4],[3,7]] },
        { combination: [[0,4],[1,5]] },
        { combination: [[0,4],[1,7]] },
        { combination: [[0,4],[3,5]] },                  

        { combination: [[2,6],[3,7]]},                            
        { combination: [[2,6],[1,5]] },
        { combination: [[2,6],[1,7]] },
        { combination: [[2,6],[3,5]] },

        { combination: [[0,6],[3,7]] },
        { combination: [[0,6],[1,5]] },
        { combination: [[0,6],[1,7]] },
        { combination: [[0,6],[3,5]] },

        { combination: [[2,4],[3,7]] },
        { combination: [[2,4],[1,5]] },
        { combination: [[2,4],[1,7]] },
        { combination: [[2,4],[3,5]] }
    ];
    return schedule
}


// ============================================================================
// BONUS ROUND
// ============================================================================

function get_schedule_BonusRound(n_pairs, pairs_chosen_in_PairChoice) {
    let schedule = []
    let min = 0 
    let n_available_pairs = Object.keys(pairs_chosen_in_PairChoice).length;

    let pair_indices = getRandomIntInclusive_Array(min, n_available_pairs-1, n_pairs)

    for (let i = 0; i <= n_pairs-1; i++) {
        let index = pair_indices[i];
        let pair = pairs_chosen_in_PairChoice[index];
        schedule.push(pair);
    }
    return schedule
}


// ============================================================================
// SYMBOL CHOICE
// ============================================================================

function get_schedule_SymbolChoice(schedule_PairChoice) {
    let schedule_array = get_unique_pairs_from_combination_schedule(schedule_PairChoice);
    let schedule = schedule_array.map(pair => ({ pair }));
    return schedule
}


// ============================================================================
// HELPERS
// ============================================================================

function get_unique_pairs_from_combination_schedule(combination_schedule) {
    const pairsMap = {};
    
    for (const item of combination_schedule) {
      for (const pair of item.combination) {
        const sortedPair = [...pair].sort((a, b) => a - b);
        const key = sortedPair.join(',');
        pairsMap[key] = sortedPair;
      }
    }
    
    return Object.values(pairsMap);
}

function get_unique_pairs_from_pair_schedule(schedule) {
    const uniquePairsArray = [];
  
    for (const item of schedule) {
      const sortedPair = [...item.pair].sort((a, b) => a - b);
      uniquePairsArray.push(sortedPair);
    }
  
    return uniquePairsArray;
}


// ============================================================================
// EXPORTS
// ============================================================================

export{
  get_schedule_practice_round_LearningTask,
  get_schedule_LearningTask,
  get_schedule_TransferTask,
  get_schedule_PairChoice,
  get_schedule_BonusRound,
  get_schedule_SymbolChoice,
  get_unique_pairs_from_pair_schedule
}
