// THEME BUTTON
const toggleButton = document.getElementById("toggleButton");

toggleButton.addEventListener("click", () => {
    document.body.classList.add("fade-transition");
    document.body.classList.toggle("dark-mode");
    
    setTimeout(() => {
        document.body.classList.remove("fade-transition"); 
    }, 500);
    
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

window.onload = () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
};

// AUDIO BUTTON
var audio = document.getElementById("customAudio");
var isPaused = false; 

function playAudio() {
    isPaused = false; 
    audio.play();
}

function pauseAudio() {
    isPaused = true; 
    audio.pause();
}

audio.addEventListener("ended", function () {
    if (!isPaused) {
        this.currentTime = 0;
        this.play(); 
    }
});

// Variables to store selected category and num of question
let selectedCategory = "General Knowledge and Aptitude";
let selectedQuestions = 10;

// Function to handle category
document.querySelectorAll('.catg-option').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.catg-option').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedCategory = button.getAttribute('data-category');
    });
});

// Function to handle num of questions
document.querySelectorAll('.ques-option').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.ques-option').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedQuestions = parseInt(button.getAttribute('data-questions'));
    });
});

document.querySelector('.startquiz').addEventListener('click', () => {
    console.log(`Starting quiz with category: ${selectedCategory} and ${selectedQuestions} questions.`);
    document.querySelector('.conf-container').style.display = 'none';
    document.querySelector('.quiz-container').style.display = 'block';
    startQuiz(selectedCategory, selectedQuestions);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Quiz questions data

const questions = {
    "General Knowledge and Aptitude": [
        { question: "What is the capital of France?", options: ["Paris", "London", "Berlin", "Madrid"], answer: "Paris" },
        { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
        // Add more questions here
    ],
    "Academics & Science": [
        { question: "What is the chemical symbol for water?", options: ["H2O", "O2", "CO2", "NaCl"], answer: "H2O" },
        { question: "Who developed the theory of relativity?", options: ["Newton", "Einstein", "Galileo", "Tesla"], answer: "Einstein" },
        // Add more questions here
    ],
    "Programming & Tech": [
        { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyperlinking Text Marking Language"], answer: "Hyper Text Markup Language" },
        { question: "What is the value of 2^3?", options: ["6", "8", "10", "12"], answer: "8" },
        // Add more questions here
    ],
    "Competitive Exam Preparation": [
        { question: "What is the largest planet in our solar system?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: "Jupiter" },
        { question: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald"], answer: "Harper Lee" },
        // Add more questions here
    ],
    "Entertainment & Pop Culture": [
        { question: "Who is known as the King of Pop?", options: ["Elvis Presley", "Michael Jackson", "Prince", "Madonna"], answer: "Michael Jackson" },
        { question: "Which movie won the Best Picture Oscar in 2020?", options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"], answer: "Parasite" },
        // Add more questions here
    ],
    "Miscellaneous & Fun Topics": [
        { question: "What is the tallest animal in the world?", options: ["Elephant", "Giraffe", "Lion", "Tiger"], answer: "Giraffe" },
        { question: "What is the smallest country in the world?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], answer: "Vatican City" },
        // Add more questions here
    ]
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function startQuiz(category, questionsCount) {
    const selectedQuestions = questions[category].slice(0, questionsCount);
    displayQuestions(selectedQuestions);
}

function displayQuestions(questions) {
    const quizContent = document.querySelector('.quizcontent');
    quizContent.innerHTML = '';

    questions.forEach((q, index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        questionElement.innerHTML = `
            <h1 class="ques-text">${q.question}</h1>
            <ul class="answer-opts">
                ${q.options.map(option => `<li class="answer-opt">${option}</li>`).join('')}
            </ul>
        `;
        quizContent.appendChild(questionElement);
    });

    showQuestion(0);
}

function showQuestion(index) {
    const questions = document.querySelectorAll('.question');
    questions.forEach((q, i) => {
        q.style.display = i === index ? 'block' : 'none';
    });

    const quesStatus = document.querySelector('.ques-status');
    quesStatus.innerHTML = `<b>${index + 1}</b> of <b>${questions.length}</b> Questions.`;

    const nextButton = document.querySelector('.next-ques');
    nextButton.onclick = () => {
        if (index < questions.length - 1) {
            showQuestion(index + 1);
        } else {
            showResults();
        }
    };
}

function showResults() {
    console.log('Quiz completed');
}
