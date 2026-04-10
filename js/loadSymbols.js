// console.log('-----------------------------------CD1_LoadSymbols-----------------------------------')


function create_eight_symbols(best_outcome_GAIN, worst_outcome_GAIN, best_outcome_LOSS, worst_outcome_LOSS, maximum_outcome_probability, symbol_image_file_number) {
  let symbols = {
    nStim: 8,
    S0 : new Symbol({id: 0, best_outcome: best_outcome_GAIN, probability_best_outcome: maximum_outcome_probability,     worst_outcome: worst_outcome_GAIN}), // A
    S1 : new Symbol({id: 1, best_outcome: best_outcome_GAIN, probability_best_outcome: (1-maximum_outcome_probability), worst_outcome: worst_outcome_GAIN}), // B
    S2 : new Symbol({id: 2, best_outcome: best_outcome_GAIN, probability_best_outcome: maximum_outcome_probability,     worst_outcome: worst_outcome_GAIN}), // C (like A)
    S3 : new Symbol({id: 3, best_outcome: best_outcome_GAIN, probability_best_outcome: (1-maximum_outcome_probability), worst_outcome: worst_outcome_GAIN}), // D (like B)

    S4 : new Symbol({id: 4, best_outcome: best_outcome_LOSS, probability_best_outcome: maximum_outcome_probability,     worst_outcome: worst_outcome_LOSS}), // E 
    S5 : new Symbol({id: 5, best_outcome: best_outcome_LOSS, probability_best_outcome: (1-maximum_outcome_probability), worst_outcome: worst_outcome_LOSS}), // F
    S6 : new Symbol({id: 6, best_outcome: best_outcome_LOSS, probability_best_outcome: maximum_outcome_probability,     worst_outcome: worst_outcome_LOSS}), // G (like E)
    S7 : new Symbol({id: 7, best_outcome: best_outcome_LOSS, probability_best_outcome: (1-maximum_outcome_probability), worst_outcome: worst_outcome_LOSS})  // H (like F)
  };
  add_images_to_symbols(symbols, `images/stim/${symbol_image_file_number}/`, '.png') 
  return symbols
}

function create_four_symbols(best_outcome_GAIN, worst_outcome_GAIN, best_outcome_LOSS, worst_outcome_LOSS, maximum_outcome_probability, symbol_image_file_number) {
  let symbols = {
    nStim: 4,
    S0 : new Symbol({id: 0, best_outcome: best_outcome_GAIN, probability_best_outcome: maximum_outcome_probability,     worst_outcome: worst_outcome_GAIN}), // A
    S1 : new Symbol({id: 1, best_outcome: best_outcome_GAIN, probability_best_outcome: (1-maximum_outcome_probability), worst_outcome: worst_outcome_GAIN}), // B

    S2 : new Symbol({id: 4, best_outcome: best_outcome_LOSS, probability_best_outcome: maximum_outcome_probability,     worst_outcome: worst_outcome_LOSS}), // E 
    S3 : new Symbol({id: 5, best_outcome: best_outcome_LOSS, probability_best_outcome: (1-maximum_outcome_probability), worst_outcome: worst_outcome_LOSS}), // F
  };
  add_images_to_symbols(symbols, `images/stim/${symbol_image_file_number}/`, '.png') 
  return symbols
}

function create_two_cues() {
  let cues = {
    nCues:2,
    cue0 : new Response_cue({id: 0}), // top stim = left button (0), bottom stim = right button (1)
    cue1 : new Response_cue({id: 1}), //  top stim =  right button (1), bottom stim = left button (0)
  };
  add_images_to_response_cues(cues,"images/responseCues/",'.gif')
  return cues
}

export{create_eight_symbols, create_four_symbols, create_two_cues}

// ---------------------------- helper functions ----------------------------

//-------------------- create symbols --------------------
class Symbol {
  // specifies the contingencies between symbol IDs and outcomes
   constructor({id, best_outcome, probability_best_outcome, worst_outcome} ={})
   {
     this.id = id ;
     this.best_outcome  = best_outcome; // text to display on the next button
     this.probability_best_outcome  = probability_best_outcome; // text to display on the back button
     this.worst_outcome = worst_outcome; // text to display on the final (start) button
   }
}

// adds a picture to symbol objects
function add_images_to_symbols(symbol_objects, image_path, ext){
/**
 * Adds image properties to symbol objects by assigning random image IDs and paths.
 *
 * GOAL:
 *   - Attach images to each symbol object by assigning a unique `imageID` and creating an `Image` object.
 *
 * INPUT:
 *   - symbol_objects: Object containing multiple symbol definitions (e.g., S0, S1, etc.).
 *   - smallest_imageID: Integer representing the starting ID for images.
 *   - image_path: String representing the path to the folder containing the images - images are stored at path, and attached at random (due to the shuffle), like [2, 0, 7, 3, 1, 4, 6, 5]
 *   - ext: String representing the file extension of the images (e.g., '.gif', '.png').
 *
 * OUTPUT:
 *   - Updates each symbol object with:
 *     - `imageID`: A randomly assigned unique ID for the image.
 *     - `image`: An `Image` object with the source set to the corresponding image file.
 *   - Updates the `exp.symbolsUsed` object with the modified symbol objects.
 *
 * FUNCTIONALITY:
 *   - Randomizes the order of image IDs using `_.shuffle`.
 *   - Iterates through each symbol and assigns an `imageID` and an `Image` object with the appropriate source.
 *   - Stores the updated symbol objects in the `exp.symbolsUsed` variable for global access.
 */

  // there are 16 images in each image folder, need to draw nStim images
  // shuffle numbers between 0 and 7
  let n_available_identicons = 8;
  let ID = _.shuffle(_.range(0,n_available_identicons)); // creates array with numbers in a random order
  // then sample the first nStim numbers
  ID = ID.slice(0,symbol_objects.nStim); // takes the first nStim numbers from the shuffled array

  for (let i = 0; i <= symbol_objects.nStim-1; i++){ // goes through all stimuli 
    symbol_objects['S'+i].imageID = ID[i]; // adds new property:  
    symbol_objects['S'+i].image = new Image();
    symbol_objects['S'+i].image.src = image_path +ID[i]+ext;
  }

  //debug
  // console.log(`symbols after add_images_to_symbols: pair 1: S0:${symbol_objects['S0'].imageID},S1:${symbol_objects['S1'].imageID}; pair 2: S2:${symbol_objects['S2'].imageID},S3:${symbol_objects['S3'].imageID}; pair 3: S4:${symbol_objects['S4'].imageID},S5:${symbol_objects['S5'].imageID} `)
}


//----------- create response cues (will be used to create a contingency between top-down organised symbols and left-right response keys) -----------

class Response_cue {
  // specifies the contingencies between response cue IDs and probability of appearing
   constructor({id, probability} ={})
   {
     this.id = id ;
     //this.probability  = probability; // text to display on the back button
   }
}

// adds a picture to the options defined above, pictures are stored at image_path, but NOT attached at random - this will be randomised
function add_images_to_response_cues(symbol_objects,image_path,ext){ // symbol_objects = cues object, smallest_imageID = 0, image_path = "images/responseCues/"
    for (let i = 0; i <= symbol_objects.nCues-1; i++){ // goes through  all cues 
      symbol_objects['cue'+i].imageID = i; 
      symbol_objects['cue'+i].image = new Image();
      symbol_objects['cue'+i].image.src = image_path+i+ext;
    }
}

//export{Symbol, add_images_to_symbols, Response_cue, add_images_to_response_cues, create_eight_symbols, create_four_symbols, create_two_cues}

