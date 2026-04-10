function isArrayInArray(targetArray, largerArray) {
  /*
  // Example usage
  const targetArray = [2, 3];
  const largerArray = [[2, 1], [3, 4], [5, 6], [2, 3]];
  isArrayInArray(targetArray, largerArray)
  */
  // Sort the target array for comparison
  const sortedTarget = targetArray.slice().sort((a, b) => a - b);

  // Check if any array in the larger array matches the sorted target array
  return largerArray.some(
    (arr) => arr.slice().sort((a, b) => a - b).toString() === sortedTarget.toString()
  );
}


function schedule_all(nSymbols,fdb){
  let k = [];
  for (let i = 0; i < nSymbols-1; i++) {
    for (let j = i+1; j < nSymbols; j++) {
      k.push({pair:[i,j],fdb:fdb})
  }}
  return k
}

function getLastValue(myArray){
      return(myArray[myArray.length-1])
}

function findCor(index) {
      return index == 0;
    }

// find all values with the same key in a nested object
const recursiveSearch = (obj, searchKey, results = []) => {
   const r = results;
   Object.keys(obj).forEach(key => {
      const value = obj[key];
      if(key === searchKey && typeof value !== 'object'){
         r.push(value);
      }else if(typeof value === 'object'){
         recursiveSearch(value, searchKey, r);
      }
   });
   return r;
};

// CALCULATING PAYMENT
function points2pounds(points,rate) {
  let bonus_pounds = points*rate;
  bonus_pounds = bonus_pounds.toFixed(2);
  bonus_pounds = parseFloat(bonus_pounds);
  // if bonus_pounds is negative, set it to 0
  bonus_pounds = (bonus_pounds < 0) ? 0 : bonus_pounds; 
  return bonus_pounds
}


// make invisble all the elements whose class corresponds to the input to this function
function makeInvisible() { // takes array as input, this array contains string elements reflecting class names, e.g. elements["box1", "box2"]
  
  var args = arguments;
  for (let i = 0; i < args.length; i++) {
    document.getElementById(args[i]).style.visibility="hidden" 
  }
}

// make invisble all the elements whose class corresponds to the input to this function
function makeVisible() { // takes array as input, this array contains string elements reflecting class names, e.g. elements["box1", "box2"]
  
  var args = arguments;
  for (let i = 0; i < args.length; i++) {
    document.getElementById(args[i]).style.visibility="visible" 
  }
}

function getDate() {
  const d = new Date();
  const datetime = d.toLocaleString();
  console.log(`today's date: ${datetime}`)
  return datetime
}

// sleep function stops execution of code during X ms unlike the Timer function which keeps running code
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomIntInclusive(min, max) {

  min = Math.ceil(min);
  max = Math.floor(max);

  let n = Math.floor(Math.random() * (max - min + 1) + min)

  // debug
  // console.log(`getRandomIntInclusive() run : return `)

  return n; // The maximum is inclusive and the minimum is inclusive
}

function getRandomIntInclusive_Array(min, max, nLength) {
  // debug
  // console.log(`getRandomIntInclusive_Array() run (min=${min},max=${max},length=${nLength})`)

  const arr = [];
  do {
      // Generating random bonus_poundser
      const randombonus_poundser = getRandomIntInclusive(min, max) 
      // Pushing into the array only 
      // if the array does not contain it
      if (!arr.includes(randombonus_poundser)) {
        arr.push(randombonus_poundser);
      }
  } while (arr.length < nLength);

  // Printing the array elements
  // console.log(`getRandomIntInclusive_Array = ${arr}`)

  return arr
}


window.mobileAndTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function openFullscreen() {
  var elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

function arraysAreEqual(array1, array2) {
  let boolean = array1.every((element, index) => element === array2[index]);
  return boolean
}

function arraysSameElements(array1,array2) { // allows for elements in different order
  let boolean = JSON.stringify(array1.sort()) === JSON.stringify(array2.sort());
  return boolean
}

function arrayContainsSmallerArray(bigArr,smallArr,sameOrder) { // check if array of arrays contains a smaller array
  //error check

  for (let i = 0; i < bigArr.length; i++) {
      if (bigArr[i].length!=smallArr.length) {
        console.log('ERROR: THE ARRAYS INSIDE THE BIG ARRAY ARE NOT OF THE SAME SIZE AS THE SMALL ARRAY')
      }
      let equal
      if (sameOrder) {
        equal = arraysAreEqual(bigArr[i],smallArr)
      } else {
        equal = arraysSameElements(bigArr[i],smallArr)
      }
      if (equal) {
        return equal
      }

    }
}

function checkIsMobile(){
  var isMobile = false; //initiate as false

  if (navigator.maxTouchPoints) {
    isMobile = true;
  }
  // device detection
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) 
    { 
      isMobile = true;
    }
  return isMobile
}



export {
  isArrayInArray,
  getLastValue,
  findCor,
  points2pounds,
  schedule_all,
  recursiveSearch,
  getRandomIntInclusive,
  getRandomIntInclusive_Array,
  makeInvisible,
  makeVisible,
  getDate,
  sleep,
  openFullscreen,
  arraysAreEqual,
  arraysSameElements,
  arrayContainsSmallerArray,
  checkIsMobile
}


/* // UNUSED FUNCTIONS  

  function addCanvas(target,id,width,height,classInfo) {
    let resp ='<div class="col"> <div align = "center"> <canvas ' + //canvas class=classInfo
              'id="'+id+'" width="'+width+'" height="'+height+ '"class="'+classInfo+
              '" style="width: 100%; height: auto; max-width:200px;">'+
              '</canvas></div></div>';
    $(target).append(resp);
  }

  function drawStim(symbols,id,isbottom) { // isb = isbottom value
    // debug
    console.log(`drawStim() run`)

    let canvas = document.getElementById("myResp"+isbottom)
    let Ax =  canvas.getContext("2d")
    Ax.drawImage(symbols['S'+id].image,0,0) // IMPORTANT
    Ax.lineWidth = "5";
    Ax.strokeStyle = "black";
    Ax.strokeRect(0, 0, canvas.width, canvas.height);
  }

  function drawCue(cues,id,isr) { // c = LTcue1 and cue2, isr = value of isright 
    // debug
    console.log(`drawCue() run`)

    let canvas = document.getElementById("LTcue"+isr) // here, call on value of isr which has been randomised/shuffles
    let Ax =  canvas.getContext("2d")
    Ax.drawImage(cues['c'+id].image,0,0) 
  }

  function highlightOption(optionId) {
    // debug
    console.log(`highlightOption() run`)
    console.log(`optionId = ${optionId}`)

    let canvas = document.getElementById(optionId)
    let Ax =  canvas.getContext("2d")
    Ax.lineWidth = "45";
    Ax.strokeStyle = "black";
    Ax.strokeRect(0, 0, canvas.width, canvas.height);
  }

  function appendImage(symbols, id, isbottom) { 
    document.getElementById("resp"+isbottom).appendChild(symbols['S'+id].image);
  }

  function removeImage(imageId) {
    var elementToBeRemoved = document.getElementById(imageId);
    elementToBeRemoved.parentNode.removeChild(elementToBeRemoved);
  }

  function drawStim_TT(symbols,id,isright,isbottom) { // isb = isbottom value
    // debug
    console.log(`drawStim_TT() run`)

    //let canvaSide = ((isright == 0 ? "canvasL" : "canvasR")); 

    // debug
    console.log(`isright=${isright},isbottom=${isbottom},id=${"canvas"+isright+isbottom}`)

    let canvas = document.getElementById("canvas"+isright+isbottom); // get name of canvas: canvasL0, canvasL1, canvasR0, canvasR1

    let Ax =  canvas.getContext("2d")
    Ax.drawImage(symbols['S'+id].image,0,0) // IMPORTANT
    Ax.lineWidth = "5";
    Ax.strokeStyle = "black";
    Ax.strokeRect(0, 0, canvas.width, canvas.height);

    // how to call it:
    // drawStim_TT(symbols,combination[0][0],isright[0],isbottom1[0]);
    // drawStim_TT(symbols,combination[0][1],isright[0],isbottom1[1]);
    // drawStim_TT(symbols,combination[1][0],isright[1],isbottom2[0]);
    // drawStim_TT(symbols,combination[1][1],isright[1],isbottom2[1]);
    
  }

*/
