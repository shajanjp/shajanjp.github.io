let commandsPrediction = ['cat', 'cd', 'exit', 'help', 'ls', 'pwd', 'uptime', 'whoami'];
let filesystemPrediction = Object.keys(currentPath());
let pathStack = ['/'];
const stdIn = $('#stdin-input-box'); 
const stdOut = $('#stdout'); 
stdIn.val('');
stdIn.focus();

$(document).on('click', function(e){
  stdIn.focus();
})

// Enter Key Handler
stdIn.on('keyup', function(e) {
  console.log("input key up", e.keyCode);
  // enter key
  if (e.keyCode == 13) {
    let stdin = this.value;
    
    if(stdin == 'clear'){
      stdOut.html('');
      stdIn.val('');
    } else {
      stdOut.append(getReplay(stdin));
    }
    stdIn.focus();
  }
});

// Prediction
$(document).on('keydown', 'input', function(e) {
  // tab key
  if (e.keyCode == 9) { 
    let commandFromUser = this.value.split(' ');
    let lastCommandFromUser = commandFromUser[commandFromUser.length - 1];
    let predictionFound = false;

    predictionFound = commandsPrediction.find(function(element) {
      return element.startsWith(lastCommandFromUser);
    });

    if (!predictionFound) {
      predictionFound = filesystemPrediction.find(function(element) {
        return element.startsWith(lastCommandFromUser);
      });
    }

    $(this).val(`${commandFromUser.slice(0, -1)} ${predictionFound || lastCommandFromUser}`);
    $(this).focus();
    e.preventDefault();
  }
});