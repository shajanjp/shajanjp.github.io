let commandsPrediction = ['cat', 'cd', 'exit', 'help', 'ls', 'pwd', 'uptime', 'whoami'];
let filesystemPrediction = Object.keys(currentPath());
let pathStack = ['/'];

$('input:last').val('');
$('input:last').focus();

$(document).on('click', function(e){
   $('input:last').focus();
})

// Enter Key Handler
$(document).on('keyup', 'input', function(e) {
  if (e.keyCode == 13) {
    let stdin = this.value;
    if(stdin == 'clear'){
      $('.window').html(`<span class="stdout-text">${currentPathStack.join(
        '/'
        )}</span> $<input type="text" autocorrect="off" autocapitalize="off">`)
    }
    else{
      $('.window').append(getReplay(stdin));
    }
    $('input:last').focus();
  }
});

// Prediction
$(document).on('keydown', 'input', function(e) {
  if (e.keyCode == 9) { // tab key
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