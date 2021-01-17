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
      $('.window').html(`$<input type="text" autocorrect="off" autocapitalize="off">`)
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
    let CommandFromUser = this.value.split(' ');
    let lastCommandFromUser = CommandFromUser[CommandFromUser.length - 1];
    let predictionFound = false;

    predictionFound = commandsPrediction.find(function(element) {
      return element.startsWith(lastCommandFromUser);
    });

    console.log('predictionFound from commandsFrom user', predictionFound);

    if (!predictionFound) {
      console.log(
        'inside fsp',
        filesystemPrediction,
        lastCommandFromUser
      );
      predictionFound = filesystemPrediction.find(function(element) {
        return element.startsWith(lastCommandFromUser);
      });
    }

    $(this).val(`${CommandFromUser.slice(0, -1)} ${predictionFound || lastCommandFromUser}`);
    $(this).focus();
    e.preventDefault();

  }
});