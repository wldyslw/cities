export const gameStates = {
    PENDING: 'PENDING',
    RUNNING: 'RUNNNIG',
    FINISHED: 'FINISHED'
};

export const members = {
    player: {
        name: 'PLAYER',
        ally: 'Игрок'
    },
    computer: {
        name: 'COMP',
        ally: 'Компьютер'
    },
};

export const deprecatedLetters = ['ъ', 'ь', 'ы'];

export const SR = {
    SpeechRecognition: window.SpeechRecognition || window.webkitSpeechRecognition,
    SpeechGrammarList: window.SpeechGrammarList || window.webkitSpeechGrammarList,
    SpeechRecognitionEvent: window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent
};

export const Console = console;
