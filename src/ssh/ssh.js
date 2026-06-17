(function() {
    var filesystem = window.__sshFS;
    var output = document.getElementById('terminal-output');
    var input = document.getElementById('terminal-input');
    var body = document.getElementById('terminal-body');
    var inputLine = document.getElementById('terminal-input-line');

    var cwd = '/home/guest';
    var commandHistory = [];
    var historyIndex = -1;

    var commands = ['help', 'ls', 'cd', 'pwd', 'cat', 'echo', 'whoami', 'hostname', 'date', 'uname', 'clear', 'history', 'exit', 'ping'];

    function resolvePath(path) {
        if (!path) return cwd;
        if (path.startsWith('/')) return normalizePath(path);
        if (path === '~') return '/home/guest';
        if (path.startsWith('~/')) return normalizePath('/home/guest' + path.slice(1));
        return normalizePath(cwd + '/' + path);
    }

    function normalizePath(path) {
        var parts = path.split('/').filter(Boolean);
        var stack = [];
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] === '.') continue;
            if (parts[i] === '..') {
                if (stack.length > 0) stack.pop();
            } else {
                stack.push(parts[i]);
            }
        }
        return '/' + stack.join('/');
    }

    function getNode(path) {
        return filesystem[path] || null;
    }

    function basename(path) {
        var parts = path.split('/').filter(Boolean);
        return parts[parts.length - 1] || '/';
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function addOutput(text, className) {
        var line = document.createElement('div');
        line.className = 'terminal-line ' + (className || '');
        line.innerHTML = text.replace(/^\n+|\n+$/g, '');
        output.appendChild(line);
    }

    function addCommandLine() {
        var line = document.createElement('div');
        line.className = 'terminal-line';
        var dirDisplay = cwd === '/home/guest' ? '~' : cwd.replace('/home/guest', '~');
        line.innerHTML = '<span class="prompt">guest@sj</span><span class="directory">:' + escapeHtml(dirDisplay) + '$</span> <span class="command">' + escapeHtml(input.value) + '</span>';
        output.appendChild(line);
    }

    function scrollToBottom() {
        body.scrollTop = body.scrollHeight;
    }

    function updatePrompt() {
        var dirDisplay = cwd === '/home/guest' ? '~' : cwd.replace('/home/guest', '~');
        inputLine.querySelector('.directory').textContent = ':' + dirDisplay + '$';
    }

    function parseArgs(inputStr) {
        var args = [];
        var current = '';
        var inSingle = false;
        var inDouble = false;

        for (var i = 0; i < inputStr.length; i++) {
            var ch = inputStr[i];

            if (inDouble) {
                if (ch === '"') {
                    inDouble = false;
                } else {
                    current += ch;
                }
            } else if (inSingle) {
                if (ch === "'") {
                    inSingle = false;
                } else {
                    current += ch;
                }
            } else {
                if (ch === '"') {
                    inDouble = true;
                } else if (ch === "'") {
                    inSingle = true;
                } else if (ch === ' ' || ch === '\t') {
                    if (current) {
                        args.push(current);
                        current = '';
                    }
                } else {
                    current += ch;
                }
            }
        }

        if (current) args.push(current);
        return args;
    }

    // polyfill String.repeat
    if (!String.prototype.repeat) {
        String.prototype.repeat = function(count) {
            var s = '';
            for (var i = 0; i < count; i++) s += this;
            return s;
        };
    }

    function getTermCols() {
        if (!getTermCols._charWidth) {
            var m = document.createElement('span');
            m.style.font = getComputedStyle(body).font;
            m.style.visibility = 'hidden';
            m.style.position = 'absolute';
            m.textContent = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
            document.body.appendChild(m);
            getTermCols._charWidth = m.offsetWidth / 50;
            document.body.removeChild(m);
        }
        return Math.floor((body.clientWidth - 32) / getTermCols._charWidth);
    }

    function findCommonPrefix(strings) {
        if (strings.length === 0) return '';
        var prefix = strings[0];
        for (var i = 1; i < strings.length; i++) {
            while (strings[i].indexOf(prefix) !== 0) {
                prefix = prefix.substring(0, prefix.length - 1);
                if (prefix === '') return '';
            }
        }
        return prefix;
    }

    function completeArgument(word) {
        var lastSlash = word.lastIndexOf('/');
        var dirPart, partial;
        if (lastSlash >= 0) {
            dirPart = word.substring(0, lastSlash + 1) || './';
            partial = word.substring(lastSlash + 1);
        } else {
            dirPart = '';
            partial = word;
        }

        var resolvedDir = resolvePath(dirPart || '.');
        var dirNode = getNode(resolvedDir);
        if (!dirNode || dirNode.type !== 'dir') return null;

        var children = dirNode.children || [];
        var matches = children.filter(function(child) {
            return child.indexOf(partial) === 0;
        });

        if (matches.length === 0) return null;

        if (matches.length === 1) {
            var completed = (dirPart || '') + matches[0];
            var childPath = normalizePath(resolvedDir + '/' + matches[0]);
            var childNode = getNode(childPath);
            if (childNode && childNode.type === 'dir') completed += '/';
            return { replacement: completed, showMatches: null };
        }

        var common = findCommonPrefix(matches);
        if (common.length > partial.length) {
            return { replacement: (dirPart || '') + common, showMatches: null };
        }

        return { replacement: null, showMatches: matches };
    }

    function executeCommand(cmdStr) {
        addCommandLine();
        var trimmed = cmdStr.trim();
        if (!trimmed) { scrollToBottom(); return; }

        var parts = parseArgs(trimmed);
        var cmd = parts[0];
        var args = parts.slice(1);

        switch (cmd) {
            case 'help':
                addOutput('<span class="output-info">Available commands:</span>');
                addOutput('  <span class="output-highlight">ls</span> [dir]       List directory contents');
                addOutput('  <span class="output-highlight">cd</span> &lt;dir&gt;       Change directory');
                addOutput('  <span class="output-highlight">pwd</span>            Print working directory');
                addOutput('  <span class="output-highlight">cat</span> &lt;file&gt;     Display file contents');
                addOutput('  <span class="output-highlight">echo</span> [text]     Print text to terminal');
                addOutput('  <span class="output-highlight">whoami</span>         Display current user');
                addOutput('  <span class="output-highlight">hostname</span>       Show system hostname');
                addOutput('  <span class="output-highlight">date</span>           Show current date and time');
                addOutput('  <span class="output-highlight">uname</span> [-a]      System information');
                addOutput('  <span class="output-highlight">clear</span>          Clear the terminal');
                addOutput('  <span class="output-highlight">history</span>        Show command history');
                addOutput('  <span class="output-highlight">ping</span> &lt;your-email&gt; &lt;your-name&gt; &lt;your-message&gt;  Send a message');
                addOutput('  <span class="output-highlight">exit</span>           Return to home page');
                addOutput('  <span class="output-highlight">help</span>           Show this help message');
                break;

            case 'ls': {
                var targetPath = args[0] ? resolvePath(args[0]) : cwd;
                var node = getNode(targetPath);
                if (!node) {
                    addOutput("ls: cannot access '" + args[0] + "': No such file or directory", 'output-error');
                } else if (node.type !== 'dir') {
                    addOutput(basename(targetPath));
                } else {
                    var children = node.children || [];
                    if (children.length === 0) {
                        addOutput('(empty)', 'output-dim');
                    } else {
                        var entries = children.map(function(child) {
                            var childPath = normalizePath(targetPath + '/' + child);
                            var childNode = getNode(childPath);
                            var isDir = childNode && childNode.type === 'dir';
                            var displayName = isDir ? child + '/' : child;
                            var cssCls = isDir ? 'output-highlight' : (child.startsWith('.') ? 'output-dim' : 'output-default');
                            var html = '<span class="' + cssCls + '">' + escapeHtml(displayName) + '</span>';
                            return { name: child, displayName: displayName, displayLen: displayName.length, html: html, isDir: isDir };
                        });

                        var termCols = getTermCols();
                        var maxLen = 0;
                        entries.forEach(function(e) { if (e.displayLen > maxLen) maxLen = e.displayLen; });
                        var gap = 2;
                        var cols = Math.max(1, Math.floor((termCols + gap) / (maxLen + gap)));
                        var rows = Math.ceil(entries.length / cols);

                        for (var r = 0; r < rows; r++) {
                            var rowParts = [];
                            for (var c = 0; c < cols; c++) {
                                var idx = c * rows + r;
                                if (idx < entries.length) {
                                    var e = entries[idx];
                                    var pad = maxLen - e.displayLen;
                                    rowParts.push(e.html + (pad > 0 ? ' '.repeat(pad) : ''));
                                }
                            }
                            addOutput(rowParts.join(' '.repeat(gap)));
                        }
                    }
                }
                break;
            }

            case 'cd': {
                if (args.length === 0) {
                    cwd = '/home/guest';
                } else {
                    var targetPath = resolvePath(args[0]);
                    var node = getNode(targetPath);
                    if (!node) {
                        addOutput('cd: ' + args[0] + ': No such file or directory', 'output-error');
                    } else if (node.type !== 'dir') {
                        addOutput('cd: ' + args[0] + ': Not a directory', 'output-error');
                    } else {
                        cwd = targetPath;
                    }
                }
                updatePrompt();
                break;
            }

            case 'pwd':
                addOutput(cwd);
                break;

            case 'cat': {
                if (args.length === 0) {
                    addOutput('cat: missing file operand', 'output-error');
                } else {
                    var targetPath = resolvePath(args[0]);
                    var node = getNode(targetPath);
                    if (!node) {
                        addOutput('cat: ' + args[0] + ': No such file or directory', 'output-error');
                    } else if (node.type === 'dir') {
                        addOutput('cat: ' + args[0] + ': Is a directory', 'output-error');
                    } else {
                        addOutput(node.content);
                    }
                }
                break;
            }

            case 'echo':
                addOutput(args.join(' '));
                break;

            case 'whoami':
                addOutput('guest');
                break;

            case 'hostname':
                addOutput('shajanjacob.com');
                break;

            case 'date':
                addOutput(new Date().toString());
                break;

            case 'uname':
                if (args[0] === '-a' || args[0] === '--all') {
                    addOutput('Linux shajanjacob 6.1.0-virtual #1 SMP x86_64 GNU/Linux');
                } else if (args[0] === '-r') {
                    addOutput('6.1.0-virtual');
                } else {
                    addOutput('Linux');
                }
                break;

            case 'clear':
                output.innerHTML = '';
                body.scrollTop = 0;
                break;

            case 'history':
                commandHistory.forEach(function(h, i) {
                    addOutput('  ' + (i + 1) + '  ' + escapeHtml(h), 'output-dim');
                });
                break;

            case 'ping': {
                if (args.length > 3) {
                    addOutput('ping: too many arguments - enclose name or message in quotes', 'output-error');
                    addOutput('usage: ping &lt;email&gt; &lt;name&gt; &lt;message&gt;', 'output-dim');
                    break;
                }

                var guestEmail = args[0];
                var guestName = args[1];
                var guestMsg = args[2];

                if (!guestEmail || !guestName || !guestMsg) {
                    addOutput('ping: usage: ping &lt;email&gt; &lt;name&gt; &lt;message&gt;', 'output-error');
                    break;
                }

                if (!/\S+@\S+\.\S+/.test(guestEmail)) {
                    addOutput('ping: invalid email address', 'output-error');
                    break;
                }

                addOutput('sending...', 'output-dim');

                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://website-utils.sj.deno.net/api/contact', true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.onload = function() {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        addOutput('sent', 'output-info');
                    } else {
                        addOutput('ping: failed (' + xhr.status + ')', 'output-error');
                    }
                    scrollToBottom();
                };
                xhr.onerror = function() {
                    addOutput('ping: network error', 'output-error');
                    scrollToBottom();
                };
                xhr.send(JSON.stringify({ email: guestEmail, name: guestName, message: guestMsg }));
                break;
            }

            case 'exit':
                window.location.href = '/';
                return;

            default:
                addOutput('bash: ' + cmd + ': command not found', 'output-error');
                break;
        }

        scrollToBottom();
    }

    input.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            output.innerHTML = '';
            body.scrollTop = 0;
            return;
        }
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            input.value = '';
            return;
        }
        if (e.key === 'Enter') {
            var cmd = input.value;
            if (cmd.trim()) commandHistory.push(cmd);
            historyIndex = commandHistory.length;
            executeCommand(cmd);
            input.value = '';
        } else if (e.key === 'Tab') {
            e.preventDefault();
            var val = input.value;
            var cursorPos = input.selectionStart;
            var beforeCursor = val.substring(0, cursorPos);
            var afterCursor = val.substring(cursorPos);
            var beforeWords = beforeCursor.split(' ');
            var currentWord = beforeWords[beforeWords.length - 1];

            if (beforeWords.length === 1) {
                var matches = commands.filter(function(c) { return c.indexOf(currentWord) === 0; });
                if (matches.length === 0) return;
                if (matches.length === 1) {
                    var prefix = beforeCursor.substring(0, beforeCursor.length - currentWord.length);
                    input.value = prefix + matches[0] + ' ' + afterCursor;
                    input.selectionStart = input.selectionEnd = (prefix + matches[0] + ' ').length;
                } else {
                    var common = findCommonPrefix(matches);
                    if (common.length > currentWord.length) {
                        var prefix = beforeCursor.substring(0, beforeCursor.length - currentWord.length);
                        input.value = prefix + common + afterCursor;
                        input.selectionStart = input.selectionEnd = (prefix + common).length;
                    } else {
                        addOutput(matches.join('  '), 'output-dim');
                    }
                }
            } else {
                var result = completeArgument(currentWord);
                if (!result) return;
                if (result.replacement !== null) {
                    var prefix = beforeCursor.substring(0, beforeCursor.length - currentWord.length);
                    input.value = prefix + result.replacement + afterCursor;
                    input.selectionStart = input.selectionEnd = (prefix + result.replacement).length;
                } else if (result.showMatches) {
                    addOutput(result.showMatches.join('  '), 'output-dim');
                }
            }
            scrollToBottom();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
            }
        }
    });

    body.addEventListener('click', function() { input.focus(); });
    input.focus();
})();
