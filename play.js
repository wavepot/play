
var keyMap = {
  // bottom row
  '90': 'c3',
  '83': 'c#3',
  '88': 'd3',
  '68': 'd#3',
  '67': 'e3',
  '86': 'f3',
  '71': 'f#3',
  '66': 'g3',
  '72': 'g#3',
  '78': 'a3',
  '74': 'a#3',
  '77': 'b3',
  '188': 'c4',
  '76': 'c#4',
  '190': 'd4',
  '186': 'd#4',
  '191': 'e4',

  // top row
  '81': 'c4',
  '50': 'c#4',
  '87': 'd4',
  '51': 'd#4',
  '69': 'e4',
  '82': 'f4',
  '53': 'f#4',
  '84': 'g4',
  '54': 'g#4',
  '89': 'a4',
  '55': 'a#4',
  '85': 'b4',
  '73': 'c5',
  '57': 'c#5',
  '79': 'd5',
  '48': 'd#5',
  '80': 'e5',
  '219': 'f5',
  '187': 'f#5',
  '221': 'g5',
};

document.body.onkeydown = e => {
  var key = keyMap[e.keyCode];
  if (key) keyDown(key);
};

document.body.onkeyup = e => {
  var key = keyMap[e.keyCode];
  if (key) keyUp(key);
};

code.onkeydown = e => e.stopPropagation();
code.onkeyup = e => e.stopPropagation();
code.oninput = e => fn = compile(code.value);

var notesPressed = {};
var fn;

setTimeout(() => fn = compile(code.value), 0);

var audio = new AudioContext;
window.sampleRate = audio.sampleRate;

var node = audio.createScriptProcessor(256);
node.connect(audio.destination);

var frame = 0;

node.onaudioprocess = function(e) {
  var L = e.outputBuffer.getChannelData(0);
  var R = e.outputBuffer.getChannelData(1);
  var notes = getNotesPressed();

  for (var i = 0; i < L.length; i++) {
    var t = frame++ / audio.sampleRate;
    var sample = 0;
    for (var k = 0; k < notes.length; k++) {
      sample += fn(t, notes[k]);
    }
    L[i] = R[i] = sample;
  }
};

function compile(code) {
  return new Function(code)();
}

function getNotesPressed() {
  return Object
    .keys(notesPressed)
    .filter(n => notesPressed[n])
    .map(n => +n);
}

function keyDown(key) {
  var note = stringToNote(key);
  notesPressed[note] = true;
}

function keyUp(key) {
  var note = stringToNote(key);
  notesPressed[note] = false;
}

function stringToNote(s){
  s = s.split('');
  var octave = parseInt(s[s.length - 1], 10);
  if (isNaN(octave)) octave = 4;
  var note = s[0].toLowerCase();
  var flat = s[1] === 'b';
  var sharp = s[1] === '#';
  var notes = 'ccddeffggaab';
  var n = notes.indexOf(note) + (octave * 12) + sharp - flat;
  return Math.pow(2, (n - 57)/12) * 440;
}
