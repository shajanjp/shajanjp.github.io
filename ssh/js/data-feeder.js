const commadsList = {
  "cat": 'concatenate files and print on the standard output',
  "cd": "change the working directory",
  "exit": "exits console",
  "help": "an interface to this page",
  "ls": "list directory contents",
  "pwd": "print name of current/working directory",
  "uptime": "tell how long the system has been running",
  "whoami": "print effective username",
};
let currentPathStack = [];

function line(content) {
  return `<p>${content}</p>`;
}

function renderObject(data) {
  let rData = '';

  for (const k in data) {
    switch(k){
      case 'view':
        rData += `<p><span class="c-faded">${k}</span> : <a href="${data[k]}" target="_blank">View</a></p>`;
        break;
      case 'isEnd':
      case 'nodeType':
        break; 
      default:
        rData += `<p><span class="c-faded">${k}</span> : ${data[k]}</p>`;
        break;
    }
  }
  return rData;
}

function currentPath() {
  let cPath = mainTree;

  currentPathStack.forEach(path => {
    cPath = cPath[path];
  });

  return cPath;
}

function lsCommand() {
  if (currentPath().isEnd == true) {
    return line(renderObject(currentPath()));
  } else {
    filesystemPrediction = Object.keys(currentPath());
    return line(Object.keys(currentPath()).join('</br>'));
  }
}

function pwdCommand(){
  return line(`/${currentPathStack.join('/')}`)
}

function cdCommand(relativePath) {
  const previousPath = currentPathStack.join('/');

  if(relativePath == ''){
    currentPathStack = []
    
    return line(previousPath);
  } else {
    relativePath = relativePath.trim();
    let paths = relativePath.split('/');
    
    paths.forEach(path => {
      if (currentPath()[path]) {
        currentPathStack.push(path);
      }
      if (path == '..') {
        currentPathStack.pop();
      }
    });
    
    return line(previousPath);
  }
}

function catCommand(path){
// if(path )
}

function getReplay(command) {
  let renderedReplay = '';
  let commandSplit = command.split(' ');

  switch (commandSplit[0]) {
    case 'ls':
    renderedReplay = lsCommand();
    break;
    
    case 'pwd':
    renderedReplay = pwdCommand();
    break;

    case 'cd':
    renderedReplay = cdCommand(command.split('cd')[1]);
    break;

    case 'cat':
    renderedReplay = catCommand(command.split('cat ')[1])
    break;

    case 'exit':
    window.close();
    renderedReplay = line('');
    break;

    case 'uptime':
    renderedReplay = line(sinceExact(new Date(1993, 7, 24)));
    break;

    case 'whoami':
    renderedReplay = line('shajanjp');
    break;

    case 'help':
    renderedReplay = renderObject(commadsList)
    break;

    default:
    renderedReplay = `<p>${command}: command not found</p>`;
    break;
  }

  return renderedReplay;
}