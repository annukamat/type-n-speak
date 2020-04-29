//Init SpeechSynth API
const synth = window.speechSynthesis;

//Dom Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

//Identifies browser:
var isChrome = !!window.chrome && !!window.chrome.webstore;

//
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  //loop throught voices
  voices.forEach((voice) => {
    //create option element
    const option = document.createElement('option');
    //fill option element
    option.textContent = voice.name + '(' + voice.lang + ')';

    //Set needed option attributes
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

//fix dublication

// if (synth.onvoiceschanged !== undefined) {
//   synth.onvoiceschanged = getVoices;
// }

//Speak
const speak = () => {
  if (synth.speaking) {
    console.log('Already speaking....');
    return;
  }
  if (textInput.value !== '') {
    body.style.background = '#141414 url(images/wave.gif)';
    body.style.backgroundRepeat = 'repeat-x';
    body.style.backgroundSize = '100% 100%';

    //get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    //speak end
    speakText.onend = (e) => {
      console.log('done speaking');
      body.style.background = '#141414';
    };
    //speak error
    speakText.onerror = (e) => {
      console.log('something went wrong');
    };

    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      'data-name'
    );

    //loop through voice
    voices.forEach((voice) => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    //set rate and pitch
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    //speak
    synth.speak(speakText);
  }
};

//text form submit
textForm.addEventListener('submit', (e) => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// Rate value change
rate.addEventListener('change', (e) => (rateValue.textContent = rate.value));

// Pitch value change
pitch.addEventListener('change', (e) => (pitchValue.textContent = pitch.value));

// Voice select change
voiceSelect.addEventListener('change', (e) => speak());
