const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;

document.querySelector('button').addEventListener('click', () => {
    recognition.start();
  });

recognition.addEventListener('result', (e) => {
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;

    console.log('Confidence: ' + e.results[0][0].confidence);
// sockets are the best solution for bidirectional communication, 
//especially when pushing an event from the server to the browser

const socket = io();
socket.emit('chat message', text);

//takes a string and enables browser to speak w/ text
//create reference to api entry point
//create speech synthesis using its constructor to text to be synthesized when word or sound is spoken
//https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
//we can set the voice 

function synthVoice(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    synth.speak(utterance);
  }
  
socket.on('bot reply', function(replyText) {
    synthVoice(replyText);
}); 
  
  




});
  