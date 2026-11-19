let freq1 = 260;
let freq2 = 390;

function find_rational(value, maxdenom) {
  let best = { numerator: 1, denominator: 1, error: Math.abs(value - 1) }
  if (!maxdenom) maxdenom = 10000;
  for (let denominator = 1; best.error > 0 && denominator <= maxdenom; denominator++) {
    let numerator = Math.round( value * denominator );
    let error = Math.abs( value - numerator / denominator );
    if (error >= best.error) continue;
    best.numerator = numerator;
    best.denominator = denominator;
    best.error = error;
  }
  return best;
}

const synth = new Tone.Synth().toDestination();
//https://tonejs.github.io/docs/r11/Frequency#tofrequency
function playSingle(tone) {
    Tone.start()
    const now = Tone.now();
    // trigger the attack immediately
    synth.triggerAttack(tone, now);
    // wait one second before triggering the release
    synth.triggerRelease(now + 0.5);
}

const psynth = new Tone.PolySynth(Tone.Synth).toDestination();
function playCouple() {
    Tone.start();
    const toneA = freq1;
    const toneB = freq2;
    const tones = [toneA, toneB];
    
    const now = Tone.now(); 
    psynth.triggerAttack(tones, now);   
    psynth.triggerRelease(tones, now + 1);
}

function playTone(method, tone) {
    const ptones = [1, 256/243, 9/8, 32/27, 81/64, 4/3, 729/512, 3/2, 128/81, 27/16, 16/9, 243/128, 2];
    const jtones = [1, 12/11, 9/8, 6/5, 5/4, 4/3, 7/5, 3/2, 8/5, 5/3, 7/4, 11/6, 2];
    let etones = [];
    let tones = [];
    if (method === 'p') {
        console.log('Pythagorean');
        tones = ptones.map(x => x*freq1);
    }
    else if (method === 'j') {
        console.log('just');
        tones = jtones.map(x => x*freq1);
    }
    else if (method === 'e') {
        console.log('equal');
        for (let i = 0; i <= 12; i++)
            etones.push(Math.pow(2, i/12));
        tones = etones.map(x => x*freq1);
    }
    playSingle(tones[tone]);
}

function playRandom(method, tones) {
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const interval = 0.25;
    const sound = [0, 2, 4, 5, 7, 9, 11, 12];
    const mode = parseInt(Math.random()*4);
    
    const sounds = {
        'C-' : tones[0]/2,
        'C#-' : tones[1]/2,
        'D-' : tones[2]/2,
        'D#-' : tones[3]/2,
        'E-' : tones[4]/2,
        'F-' : tones[5]/2,
        'F#-' : tones[6]/2,
        'G-' : tones[7]/2,
        'G#-' : tones[8]/2,
        'A-' : tones[9]/2,
        'A#-' : tones[10]/2,
        'B-' : tones[11]/2,
        'C' : tones[0],
        'C#' : tones[1],
        'D' : tones[2],
        'D#' : tones[3],
        'E' : tones[4],
        'F' : tones[5],
        'F#' : tones[6],
        'G' : tones[7],
        'G#' : tones[8],
        'A' : tones[9],
        'A#' : tones[10],
        'B' : tones[11],
        'C+' : tones[12],
        ' ' : 0,
        '/' : 25,
        '//' : 50,
        '///' : 75,
    }
    
    const notes = [[
        [['C'],  1],
        [['D'],  1],
        [['E'],  1],
        [['F'],  1],
        [['G'],  1],
        [['A'],  1],
        [['B'],  1],
        [['C+'], 1],
        [['C+'], 1],
        [['B'],  1],
        [['A'],  1],
        [['G'],  1],
        [['F'],  1],
        [['E'],  1],
        [['D'],  1],
        [['C'],  1],
    ],[
        [['C'],  3],
        [['D'],  1],
        [['E'],  3],
        [['C'],  1],
        [['E'],  2],
        [['C'],  2],
        [['E'],  4],
        [['D'],  3],
        [['E'],  1],
        [['F'],  1],
        [['F'],  1],
        [['E'],  1],
        [['D'],  1],
        [['F'],  8],
        [['E'],  3],
        [['F'],  1],
        [['G'],  3],
        [['E'],  1],
        [['G'],  2],
        [['E'],  2],
        [['G'],  4],
        [['F'],  3],
        [['G'],  1],
        [['A'],  1],
        [['A'],  1],
        [['G'],  1],
        [['F'],  1],
        [['A'],  6],
        [[' '],  2],
        [['G'],  3],
        [['C'],  1],
        [['D'],  1],
        [['E'],  1],
        [['F'],  1],
        [['G'],  1],
        [['A'],  8],
        [['A'],  3],
        [['D'],  1],
        [['E'],  1],
        [['F#'], 1],
        [['G'],  1],
        [['A'],  1],
        [['B'],  8],
        [['B'],  3],
        [['E'],  1],
        [['F#'], 1],
        [['G#'], 1],
        [['A'],  1],
        [['B'],  1],
        [['C+'], 6],
        [['C+'], 1],
        [['B'],  1],
        [['A'],  2],
        [['F'],  2],
        [['B'],  2],
        [['G'],  2],
        [['C+'], 2],
        [['G'],  2],
        [['E'],  2],
        [['D'],  2],
        [['C'],  4],
        [[' '],  4],
    ],[
        [['D-','A-','D','F#','A'],  8],
        [['E-','C#','E'],  8],
        [['F#-','B-','D','F#'],  8],
        [['A-','C#'],  8],
        [['D-','G-','B-','D'],  8],
        [['F#-','A-'],  8],
        [['D-','B-','D','E'],  8],
        [['E-','A-','C#'],  8],
        [['D-','F#-','A-','F#'],  8],
        [['E-','C#','E'],  8],
        [['F#-','B-','D'],  8],
        [['A-','C#'],  8],
        [['D-','G-','B-','D'],  8],
        [['F#-','A-'],  8],
        [['D-','G-','B-'],  8],
        [['E-','C#'],  8],
    ],[
        [['F-'], 3/2],
        [['F'],  1/2],
        [['F'],  2/2],
        [['F'],  2/2],
        [['F'],  2/2],
        [['F'],  2/2],
        [['F'],  2/2],
        [['C'],  2/2],
        [['C#'], 2/2],
        [['F'],  2/2],
        [['F'],  2/2],
        [['C#'], 2/2],
        [['C'],  4/2],
        [['F-'], 3/2],
        [['F'],  1/2],
        [['F'],  2/2],
        [['F'],  2/2],
        [['F'],  2/2],
        [['F'],  2/2],
        [['F'],  2/2],
        [['C'],  2/2],
        [['C#'], 2/2],
        [['C'],  2/2],
        [['G#-'],2/2],
        [['G-'], 2/2],
        [['F-'], 4/2],
        [['F-','/','//','///'], 3/2],
        [['F','/','//','///'],  1/2],
        [['F','/','//','///'],  2/2],
        [['F','/','//','///'],  2/2],
        [['F','/','//','///'],  2/2],
        [['F','/','//','///'],  2/2],
        [['F','/','//','///'],  2/2],
        [['C','/','//','///'],  2/2],
        [['C#','/','//','///'], 2/2],
        [['F','/','//','///'],  2/2],
        [['F','/','//','///'],  2/2],
        [['C#','/','//','///'], 2/2],
        [['C','/','//','///'],  4/2],
        [['F-','/','//','///'], 3/2],
        [['F','/','//','///'],  1/2],
        [['F','/','//','///'],  2/2],
        [['F','/','//','///'],  2/2],
        [['F','/','//','///'],  2/2],
        [['F','/','//','///'],  2/2],
        [['F','/','//','///'],  2/2],
        [['C','/','//','///'],  2/2],
        [['C#','/','//','///'], 2/2],
        [['C','/','//','///'],  2/2],
        [['G#-','/','//','///'],2/2],
        [['G-','/','//','///'], 2/2],
        [['F-','/','//','///'], 4/2],
    ]]
    
    let time = Tone.now();
    for (let i = 0; i < notes[mode].length; i++) {
        Tone.Draw.schedule(() => {
            let doms = notes[mode][i][0].map(x => x.replace('#','s').replace('///','').replace('//','').replace('/','').replace('+', '').replace('-', '')).map(x => document.querySelector('#' + method + x));
            console.log(doms);
            doms.map(o => o ? o.classList.add("playing") : null);
			setTimeout(() => {
                doms.map(o => o ? o.classList.remove("playing") : null);
			}, notes[mode][i][1] * interval * 1000);
		}, time);
        synth.triggerAttack(notes[mode][i][0].map(x => sounds[x]), time);
        time += notes[mode][i][1] * interval;
        synth.triggerRelease(notes[mode][i][0].map(x => sounds[x]), time);
    }   
}


function playTemp(method) {
    const ptones = [1, 256/243, 9/8, 32/27, 81/64, 4/3, 729/512, 3/2, 128/81, 27/16, 16/9, 243/128, 2];
    const jtones = [1, 12/11, 9/8, 6/5, 5/4, 4/3, 7/5, 3/2, 8/5, 5/3, 7/4, 11/6, 2];
    let etones = [];
    let tones = [];
    if (method === 'p') {
        console.log('Pythagorean');
        tones = ptones.map(x => x*freq1);
    }
    else if (method === 'j') {
        console.log('just');
        tones = jtones.map(x => x*freq1);
    }
    else if (method === 'e') {
        console.log('equal');
        for (let i = 0; i <= 12; i++)
            etones.push(Math.pow(2, i/12));
        tones = etones.map(x => x*freq1);
    }
    playRandom(method, tones);
}

function playAll(e) {
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const now = Tone.now()
    for (let i = 0; i < 5; i++) {
        if (i < 3) {
            synth.triggerAttack(tones[i], now + i*0.5);
            synth.triggerRelease(tones[i], now + (i+1)*0.5);
        }
        else {
            synth.triggerAttack(tones[4-i], now + i*0.5);
            synth.triggerRelease(tones[4-i], now + (i+1)*0.5);
        }
    }
    synth.triggerAttack(tones, now + 3);   
    synth.triggerRelease(tones, now + 4);
}

function updateFrac(newValue) {
    let maxdenom = 2;
    for (; maxdenom < 100; maxdenom *= 2) {
        var fracValue = find_rational(newValue, maxdenom); 
        if (fracValue.error < 1e-4)
            break;
    }
    var n = document.querySelector('.numerator');
    var d = document.querySelector('.denominator');
    n.innerHTML = fracValue.numerator;
    d.innerHTML = fracValue.denominator;
}


YUI().use('dial', function(Y) {
    setSceneY = function(e) {
        freq1 = e.newVal;
        document.querySelector('#freq').innerText = '' + freq1 + ' Hz';        
        playSingle(freq1);
        updateFrac(freq1/freq2);
    }
    
    var dial = new Y.Dial({
        min: 100,
        max: 999,
        stepsPerRevolution: 100,
        value: 260,
        diameter: 135,
        strings:{label:'Frequency (Hz):', resetStr: 'Reset', tooltipHandle: 'Drag & Set'},
        after : {
            valueChange: Y.bind( setSceneY, dial )
        }
    });
    dial.render('#demo1');
});


YUI().use('dial', function(Y) {
    setSceneY = function(e) {
        freq2 = e.newVal;
        playSingle(freq2);
        updateFrac(freq1/freq2);
    }
    
    var dial = new Y.Dial({
        min: 100,
        max: 999,
        stepsPerRevolution: 100,
        value: 390,
        diameter: 135,
        strings:{label:'Frequency (Hz):', resetStr: 'Reset', tooltipHandle: 'Drag & Set'},
        after : {
            valueChange: Y.bind( setSceneY, dial )
        }
    });
    dial.render('#demo2');
});