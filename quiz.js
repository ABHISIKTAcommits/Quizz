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
let score = 0;
let timer;
let timeLeft = 20; // 20 seconds for each question
let totalQuizTime = 120; // Total time for the whole quiz session in seconds
let currentQuestionIndex = 0;
let selectedQuestionsList = [];

// Function to handle category selection
document.querySelectorAll('.catg-option').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.catg-option').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedCategory = button.getAttribute('data-category');
    });
});

// Function to handle number of questions selection
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
        { question: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: "Pacific" },
        { question: "Who wrote '1984'?", options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "J.K. Rowling"], answer: "George Orwell" },
        { question: "What is the capital of Japan?", options: ["Tokyo", "Beijing", "Seoul", "Bangkok"], answer: "Tokyo" },
        { question: "What is the square root of 64?", options: ["6", "7", "8", "9"], answer: "8" },
        { question: "What is the largest planet in our solar system?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: "Jupiter" },
        { question: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald"], answer: "Harper Lee" },
        { question: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], answer: "Canberra" },
        { question: "What is the smallest country in the world?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], answer: "Vatican City" },
        { question: "What is the main ingredient in guacamole?", options: ["Tomato", "Onion", "Avocado", "Pepper"], answer: "Avocado" },
        { question: "What is the tallest animal in the world?", options: ["Elephant", "Giraffe", "Lion", "Tiger"], answer: "Giraffe" },
        { question: "What is the capital of Canada?", options: ["Toronto", "Vancouver", "Ottawa", "Montreal"], answer: "Ottawa" },
        { question: "What is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: "Nile" },
        { question: "What is the largest desert in the world?", options: ["Sahara", "Gobi", "Kalahari", "Arctic"], answer: "Sahara" },
        { question: "What is the capital of Italy?", options: ["Rome", "Milan", "Venice", "Florence"], answer: "Rome" },
        { question: "What is the highest mountain in the world?", options: ["K2", "Kangchenjunga", "Lhotse", "Mount Everest"], answer: "Mount Everest" },
        { question: "What is the capital of Germany?", options: ["Berlin", "Munich", "Frankfurt", "Hamburg"], answer: "Berlin" },
        { question: "What is the capital of Russia?", options: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg"], answer: "Moscow" },
        { question: "What is the capital of China?", options: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen"], answer: "Beijing" },
        { question: "What is the capital of India?", options: ["New Delhi", "Mumbai", "Bangalore", "Kolkata"], answer: "New Delhi" },
        { question: "What is the capital of Brazil?", options: ["Brasilia", "Rio de Janeiro", "Sao Paulo", "Salvador"], answer: "Brasilia" },
        { question: "What is the capital of South Africa?", options: ["Pretoria", "Cape Town", "Johannesburg", "Durban"], answer: "Pretoria" },
        { question: "What is the capital of Mexico?", options: ["Mexico City", "Guadalajara", "Monterrey", "Tijuana"], answer: "Mexico City" },
        { question: "What is the capital of Argentina?", options: ["Buenos Aires", "Cordoba", "Rosario", "Mendoza"], answer: "Buenos Aires" }
    ],
    "Academics & Science": [
        { question: "What is the chemical symbol for water?", options: ["H2O", "O2", "CO2", "NaCl"], answer: "H2O" },
        { question: "Who developed the theory of relativity?", options: ["Newton", "Einstein", "Galileo", "Tesla"], answer: "Einstein" },
        { question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"], answer: "300,000 km/s" },
        { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"], answer: "Mitochondria" },
        { question: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Pb", "Fe"], answer: "Au" },
        { question: "What is the chemical symbol for sodium?", options: ["Na", "K", "Ca", "Mg"], answer: "Na" },
        { question: "What is the chemical symbol for iron?", options: ["Fe", "Cu", "Zn", "Pb"], answer: "Fe" },
        { question: "What is the chemical symbol for oxygen?", options: ["O", "O2", "O3", "O4"], answer: "O" },
        { question: "What is the chemical symbol for carbon dioxide?", options: ["CO2", "CO", "C2O", "C2O2"], answer: "CO2" },
        { question: "What is the chemical symbol for methane?", options: ["CH4", "C2H6", "C3H8", "C4H10"], answer: "CH4" },
        { question: "What is the chemical symbol for ammonia?", options: ["NH3", "NH4", "NH2", "NH"], answer: "NH3" },
        { question: "What is the chemical symbol for sulfuric acid?", options: ["H2SO4", "H2SO3", "H2SO2", "H2SO"], answer: "H2SO4" },
        { question: "What is the chemical symbol for hydrochloric acid?", options: ["HCl", "HBr", "HI", "HF"], answer: "HCl" },
        { question: "What is the chemical symbol for nitric acid?", options: ["HNO3", "HNO2", "HNO", "HNO4"], answer: "HNO3" },
        { question: "What is the chemical symbol for acetic acid?", options: ["CH3COOH", "CH3COO", "CH3CO", "CH3CO2"], answer: "CH3COOH" },
        { question: "What is the chemical symbol for glucose?", options: ["C6H12O6", "C6H12O5", "C6H12O4", "C6H12O3"], answer: "C6H12O6" },
        { question: "What is the chemical symbol for ethanol?", options: ["C2H5OH", "C2H5O", "C2H5", "C2H5O2"], answer: "C2H5OH" },
        { question: "What is the chemical symbol for benzene?", options: ["C6H6", "C6H5", "C6H4", "C6H3"], answer: "C6H6" },
        { question: "What is the chemical symbol for toluene?", options: ["C7H8", "C7H7", "C7H6", "C7H5"], answer: "C7H8" },
        { question: "What is the chemical symbol for acetone?", options: ["C3H6O", "C3H6", "C3H5O", "C3H5"], answer: "C3H6O" },
        { question: "What is the chemical symbol for formaldehyde?", options: ["CH2O", "CH2OH", "CH2O2", "CH2O3"], answer: "CH2O" },
        { question: "What is the chemical symbol for hydrogen peroxide?", options: ["H2O2", "H2O", "H2O3", "H2O4"], answer: "H2O2" },
        { question: "What is the chemical symbol for sodium chloride?", options: ["NaCl", "NaCl2", "NaCl3", "NaCl4"], answer: "NaCl" },
        { question: "What is the chemical symbol for potassium chloride?", options: ["KCl", "KCl2", "KCl3", "KCl4"], answer: "KCl" }
    ],
    "Programming & Tech": [
        { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyperlinking Text Marking Language"], answer: "Hyper Text Markup Language" },
        { question: "What is the value of 2^3?", options: ["6", "8", "10", "12"], answer: "8" },
        { question: "What does CSS stand for?", options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], answer: "Cascading Style Sheets" },
        { question: "What is the main programming language used for Android development?", options: ["Java", "Swift", "Python", "C++"], answer: "Java" },
        { question: "What does SQL stand for?", options: ["Structured Query Language", "Structured Question Language", "Simple Query Language", "Simple Question Language"], answer: "Structured Query Language" },
        { question: "What does JSON stand for?", options: ["JavaScript Object Notation", "JavaScript Object Network", "JavaScript Online Notation", "JavaScript Online Network"], answer: "JavaScript Object Notation" },
        { question: "What does XML stand for?", options: ["eXtensible Markup Language", "eXtensible Model Language", "eXtensible Module Language", "eXtensible Machine Language"], answer: "eXtensible Markup Language" },
        { question: "What does API stand for?", options: ["Application Programming Interface", "Application Programming Integration", "Application Programming Interaction", "Application Programming Interchange"], answer: "Application Programming Interface" },
        { question: "What does HTTP stand for?", options: ["HyperText Transfer Protocol", "HyperText Transfer Program", "HyperText Transfer Process", "HyperText Transfer Package"], answer: "HyperText Transfer Protocol" },
        { question: "What does URL stand for?", options: ["Uniform Resource Locator", "Uniform Resource Link", "Uniform Resource Language", "Uniform Resource Library"], answer: "Uniform Resource Locator" },
        { question: "What does FTP stand for?", options: ["File Transfer Protocol", "File Transfer Program", "File Transfer Process", "File Transfer Package"], answer: "File Transfer Protocol" },
        { question: "What does IDE stand for?", options: ["Integrated Development Environment", "Integrated Development Editor", "Integrated Development Engine", "Integrated Development Extension"], answer: "Integrated Development Environment" },
        { question: "What does GUI stand for?", options: ["Graphical User Interface", "Graphical User Interaction", "Graphical User Integration", "Graphical User Interchange"], answer: "Graphical User Interface" },
        { question: "What does CLI stand for?", options: ["Command Line Interface", "Command Line Interaction", "Command Line Integration", "Command Line Interchange"], answer: "Command Line Interface" },
        { question: "What does OOP stand for?", options: ["Object Oriented Programming", "Object Oriented Process", "Object Oriented Protocol", "Object Oriented Package"], answer: "Object Oriented Programming" },
        { question: "What does MVC stand for?", options: ["Model View Controller", "Model View Component", "Model View Configuration", "Model View Connection"], answer: "Model View Controller" },
        { question: "What does REST stand for?", options: ["Representational State Transfer", "Representational State Transition", "Representational State Transaction", "Representational State Transformation"], answer: "Representational State Transfer" },
        { question: "What does CRUD stand for?", options: ["Create Read Update Delete", "Create Read Update Data", "Create Read Update Document", "Create Read Update Directory"], answer: "Create Read Update Delete" },
        { question: "What does DOM stand for?", options: ["Document Object Model", "Document Object Module", "Document Object Management", "Document Object Machine"], answer: "Document Object Model" },
        { question: "What does JSONP stand for?", options: ["JSON with Padding", "JSON with Protocol", "JSON with Process", "JSON with Package"], answer: "JSON with Padding" },
        { question: "What does AJAX stand for?", options: ["Asynchronous JavaScript and XML", "Asynchronous JavaScript and XHTML", "Asynchronous JavaScript and XSLT", "Asynchronous JavaScript and XQuery"], answer: "Asynchronous JavaScript and XML" },
        { question: "What does PHP stand for?", options: ["Hypertext Preprocessor", "Hypertext Processor", "Hypertext Program", "Hypertext Package"], answer: "Hypertext Preprocessor" },
        { question: "What does SQL stand for?", options: ["Structured Query Language", "Structured Question Language", "Simple Query Language", "Simple Question Language"], answer: "Structured Query Language" },
        { question: "What does XML stand for?", options: ["eXtensible Markup Language", "eXtensible Model Language", "eXtensible Module Language", "eXtensible Machine Language"], answer: "eXtensible Markup Language" },
        { question: "What does API stand for?", options: ["Application Programming Interface", "Application Programming Integration", "Application Programming Interaction", "Application Programming Interchange"], answer: "Application Programming Interface" }
    ],
    "Competitive Exam Preparation": [
        { question: "What is the largest planet in our solar system?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: "Jupiter" },
        { question: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald"], answer: "Harper Lee" },
        { question: "What is the capital of Japan?", options: ["Tokyo", "Beijing", "Seoul", "Bangkok"], answer: "Tokyo" },
        { question: "What is the square root of 64?", options: ["6", "7", "8", "9"], answer: "8" },
        { question: "What is the chemical symbol for water?", options: ["H2O", "O2", "CO2", "NaCl"], answer: "H2O" },
        { question: "Who developed the theory of relativity?", options: ["Newton", "Einstein", "Galileo", "Tesla"], answer: "Einstein" },
        { question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"], answer: "300,000 km/s" },
        { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"], answer: "Mitochondria" },
        { question: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Pb", "Fe"], answer: "Au" },
        { question: "What is the chemical symbol for sodium?", options: ["Na", "K", "Ca", "Mg"], answer: "Na" },
        { question: "What is the chemical symbol for iron?", options: ["Fe", "Cu", "Zn", "Pb"], answer: "Fe" },
        { question: "What is the chemical symbol for oxygen?", options: ["O", "O2", "O3", "O4"], answer: "O" },
        { question: "What is the chemical symbol for carbon dioxide?", options: ["CO2", "CO", "C2O", "C2O2"], answer: "CO2" },
        { question: "What is the chemical symbol for methane?", options: ["CH4", "C2H6", "C3H8", "C4H10"], answer: "CH4" },
        { question: "What is the chemical symbol for ammonia?", options: ["NH3", "NH4", "NH2", "NH"], answer: "NH3" },
        { question: "What is the chemical symbol for sulfuric acid?", options: ["H2SO4", "H2SO3", "H2SO2", "H2SO"], answer: "H2SO4" },
        { question: "What is the chemical symbol for hydrochloric acid?", options: ["HCl", "HBr", "HI", "HF"], answer: "HCl" },
        { question: "What is the chemical symbol for nitric acid?", options: ["HNO3", "HNO2", "HNO", "HNO4"], answer: "HNO3" },
        { question: "What is the chemical symbol for acetic acid?", options: ["CH3COOH", "CH3COO", "CH3CO", "CH3CO2"], answer: "CH3COOH" },
        { question: "What is the chemical symbol for glucose?", options: ["C6H12O6", "C6H12O5", "C6H12O4", "C6H12O3"], answer: "C6H12O6" },
        { question: "What is the chemical symbol for ethanol?", options: ["C2H5OH", "C2H5O", "C2H5", "C2H5O2"], answer: "C2H5OH" },
        { question: "What is the chemical symbol for benzene?", options: ["C6H6", "C6H5", "C6H4", "C6H3"], answer: "C6H6" },
        { question: "What is the chemical symbol for toluene?", options: ["C7H8", "C7H7", "C7H6", "C7H5"], answer: "C7H8" },
        { question: "What is the chemical symbol for acetone?", options: ["C3H6O", "C3H6", "C3H5O", "C3H5"], answer: "C3H6O" },
        { question: "What is the chemical symbol for formaldehyde?", options: ["CH2O", "CH2OH", "CH2O2", "CH2O3"], answer: "CH2O" },
        { question: "What is the chemical symbol for hydrogen peroxide?", options: ["H2O2", "H2O", "H2O3", "H2O4"], answer: "H2O2" },
        { question: "What is the chemical symbol for sodium chloride?", options: ["NaCl", "NaCl2", "NaCl3", "NaCl4"], answer: "NaCl" },
        { question: "What is the chemical symbol for potassium chloride?", options: ["KCl", "KCl2", "KCl3", "KCl4"], answer: "KCl" }
    ],
    "Entertainment & Pop Culture": [
        { question: "Who is known as the King of Pop?", options: ["Elvis Presley", "Michael Jackson", "Prince", "Madonna"], answer: "Michael Jackson" },
        { question: "Which movie won the Best Picture Oscar in 2020?", options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"], answer: "Parasite" },
        { question: "Who played the character of Harry Potter in the movie series?", options: ["Daniel Radcliffe", "Rupert Grint", "Elijah Wood", "Tom Felton"], answer: "Daniel Radcliffe" },
        { question: "What is the name of the fictional city where Batman lives?", options: ["Metropolis", "Gotham", "Star City", "Central City"], answer: "Gotham" },
        { question: "Who directed the movie 'Inception'?", options: ["Christopher Nolan", "Steven Spielberg", "James Cameron", "Quentin Tarantino"], answer: "Christopher Nolan" },
        { question: "Which TV show features the character Sheldon Cooper?", options: ["Friends", "The Big Bang Theory", "How I Met Your Mother", "Modern Family"], answer: "The Big Bang Theory" },
        { question: "Who is the lead singer of the band Queen?", options: ["Freddie Mercury", "Mick Jagger", "David Bowie", "Elton John"], answer: "Freddie Mercury" },
        { question: "Which movie features the song 'My Heart Will Go On'?", options: ["Titanic", "The Bodyguard", "Pretty Woman", "Ghost"], answer: "Titanic" },
        { question: "Who wrote the 'Harry Potter' series?", options: ["J.K. Rowling", "J.R.R. Tolkien", "George R.R. Martin", "Stephen King"], answer: "J.K. Rowling" },
        { question: "Which artist painted the Mona Lisa?", options: ["Leonardo da Vinci", "Vincent van Gogh", "Pablo Picasso", "Claude Monet"], answer: "Leonardo da Vinci" },
        { question: "What is the name of the coffee shop in 'Friends'?", options: ["Central Perk", "Monk's Café", "MacLaren's Pub", "The Drunken Clam"], answer: "Central Perk" },
        { question: "Who won the first season of 'American Idol'?", options: ["Kelly Clarkson", "Carrie Underwood", "Fantasia Barrino", "Ruben Studdard"], answer: "Kelly Clarkson" },
        { question: "Which movie features the character Jack Sparrow?", options: ["Pirates of the Caribbean", "Indiana Jones", "The Mummy", "National Treasure"], answer: "Pirates of the Caribbean" },
        { question: "Who is the author of 'The Great Gatsby'?", options: ["F. Scott Fitzgerald", "Ernest Hemingway", "Mark Twain", "John Steinbeck"], answer: "F. Scott Fitzgerald" },
        { question: "Which band released the album 'Abbey Road'?", options: ["The Beatles", "The Rolling Stones", "Led Zeppelin", "Pink Floyd"], answer: "The Beatles" },
        { question: "Who played the character of Tony Stark in the Marvel Cinematic Universe?", options: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth"], answer: "Robert Downey Jr." },
        { question: "Which TV show features the character Walter White?", options: ["Breaking Bad", "The Sopranos", "Mad Men", "The Wire"], answer: "Breaking Bad" },
        { question: "Who directed the movie 'Pulp Fiction'?", options: ["Quentin Tarantino", "Martin Scorsese", "Francis Ford Coppola", "Steven Spielberg"], answer: "Quentin Tarantino" },
        { question: "Which artist released the album 'Thriller'?", options: ["Michael Jackson", "Prince", "Madonna", "Whitney Houston"], answer: "Michael Jackson" },
        { question: "Who wrote the play 'Romeo and Juliet'?", options: ["William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"], answer: "William Shakespeare" },
        { question: "Which movie features the character Forrest Gump?", options: ["Forrest Gump", "Cast Away", "The Green Mile", "Saving Private Ryan"], answer: "Forrest Gump" },
        { question: "Who is the creator of the TV show 'The Simpsons'?", options: ["Matt Groening", "Seth MacFarlane", "Trey Parker", "Mike Judge"], answer: "Matt Groening" },
        { question: "Which artist painted 'Starry Night'?", options: ["Vincent van Gogh", "Claude Monet", "Pablo Picasso", "Salvador Dalí"], answer: "Vincent van Gogh" },
        { question: "Who played the character of Neo in 'The Matrix'?", options: ["Keanu Reeves", "Brad Pitt", "Tom Cruise", "Leonardo DiCaprio"], answer: "Keanu Reeves" },
        { question: "Which movie features the character Rocky Balboa?", options: ["Rocky", "Rambo", "Creed", "The Expendables"], answer: "Rocky" }
    ],
    "Miscellaneous & Fun Topics": [
        { question: "What is the tallest animal in the world?", options: ["Elephant", "Giraffe", "Lion", "Tiger"], answer: "Giraffe" },
        { question: "What is the smallest country in the world?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], answer: "Vatican City" },
        { question: "What is the main ingredient in guacamole?", options: ["Tomato", "Onion", "Avocado", "Pepper"], answer: "Avocado" },
        { question: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], answer: "Canberra" },
        { question: "What is the fastest land animal?", options: ["Cheetah", "Lion", "Tiger", "Leopard"], answer: "Cheetah" },
        { question: "What is the largest mammal?", options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], answer: "Blue Whale" },
        { question: "What is the most spoken language in the world?", options: ["English", "Mandarin Chinese", "Spanish", "Hindi"], answer: "Mandarin Chinese" },
        { question: "What is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: "Nile" },
        { question: "What is the largest desert in the world?", options: ["Sahara", "Gobi", "Kalahari", "Arctic"], answer: "Sahara" },
        { question: "What is the highest mountain in the world?", options: ["K2", "Kangchenjunga", "Lhotse", "Mount Everest"], answer: "Mount Everest" },
        { question: "What is the capital of Germany?", options: ["Berlin", "Munich", "Frankfurt", "Hamburg"], answer: "Berlin" },
        { question: "What is the capital of Russia?", options: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg"], answer: "Moscow" },
        { question: "What is the capital of China?", options: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen"], answer: "Beijing" },
        { question: "What is the capital of India?", options: ["New Delhi", "Mumbai", "Bangalore", "Kolkata"], answer: "New Delhi" },
        { question: "What is the capital of Brazil?", options: ["Brasilia", "Rio de Janeiro", "Sao Paulo", "Salvador"], answer: "Brasilia" },
        { question: "What is the capital of South Africa?", options: ["Pretoria", "Cape Town", "Johannesburg", "Durban"], answer: "Pretoria" },
        { question: "What is the capital of Mexico?", options: ["Mexico City", "Guadalajara", "Monterrey", "Tijuana"], answer: "Mexico City" },
        { question: "What is the capital of Argentina?", options: ["Buenos Aires", "Cordoba", "Rosario", "Mendoza"], answer: "Buenos Aires" },
        { question: "What is the capital of Canada?", options: ["Toronto", "Vancouver", "Ottawa", "Montreal"], answer: "Ottawa" },
        { question: "What is the capital of Italy?", options: ["Rome", "Milan", "Venice", "Florence"], answer: "Rome" },
        { question: "What is the capital of Japan?", options: ["Tokyo", "Beijing", "Seoul", "Bangkok"], answer: "Tokyo" },
        { question: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], answer: "Canberra" },
        { question: "What is the capital of France?", options: ["Paris", "London", "Berlin", "Madrid"], answer: "Paris" },
        { question: "What is the capital of the United States?", options: ["New York", "Los Angeles", "Washington, D.C.", "Chicago"], answer: "Washington, D.C." },
        { question: "What is the capital of the United Kingdom?", options: ["London", "Edinburgh", "Cardiff", "Belfast"], answer: "London" }
    ]
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz(category, questionsCount) {
    selectedQuestionsList = shuffle(questions[category]).slice(0, questionsCount);
    score = 0;
    currentQuestionIndex = 0;
    totalQuizTime = questionsCount * 20; // 20 seconds per question
    displayQuestion(currentQuestionIndex);
    startTimer();
    startQuizTimer();
}

function displayQuestion(index) {
    const quizContent = document.querySelector('.quizcontent');
    quizContent.innerHTML = '';

    const question = selectedQuestionsList[index];
    const questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.innerHTML = `
        <h1 class="ques-text">${question.question}</h1>
        <ul class="answer-opts">
            ${question.options.map(option => `<li class="answer-opt" onclick="selectAnswer('${option}', ${index})">${option}</li>`).join('')}
        </ul>
    `;
    quizContent.appendChild(questionElement);

    const quesStatus = document.querySelector('.ques-status');
    quesStatus.innerHTML = `<b>${index + 1}</b> of <b>${selectedQuestionsList.length}</b> Questions.`;
}

function selectAnswer(selectedOption, questionIndex) {
    const question = selectedQuestionsList[questionIndex];
    const options = document.querySelectorAll('.answer-opt');
    options.forEach(option => {
        if (option.innerText === question.answer) {
            option.classList.add('correct');
        } else if (option.innerText === selectedOption) {
            option.classList.add('wrong');
        }
        option.onclick = null;
    });

    if (selectedOption === question.answer) {
        score++;
    }

    clearInterval(timer);
    setTimeout(() => {
        if (currentQuestionIndex < selectedQuestionsList.length - 1) {
            currentQuestionIndex++;
            displayQuestion(currentQuestionIndex);
            startTimer();
        } else {
            showResults();
        }
    }, 1000);
}

function startTimer() {
    timeLeft = 20;
    const timeDur = document.querySelector('.time-dur');
    timeDur.innerText = `${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timeDur.innerText = `${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            selectAnswer("", currentQuestionIndex); // Automatically move to next question if time runs out
        }
    }, 1000);
}

function startQuizTimer() {
    const quizTimer = setInterval(() => {
        totalQuizTime--;

        if (totalQuizTime <= 0) {
            clearInterval(quizTimer);
            showTimeoutPage();
        }
    }, 1000);
}

function showResults() {
    document.querySelector('.quiz-container').style.display = 'none';
    document.querySelector('.result-container').style.display = 'block';
    document.getElementById('correct-answers').innerText = score;
    document.getElementById('total-questions').innerText = selectedQuestionsList.length;
    const percentage = (score / selectedQuestionsList.length) * 100;
    document.getElementById('score-percentage').innerText = percentage.toFixed(2);
}

function showTimeoutPage() {
    document.querySelector('.quiz-container').style.display = 'none';
    document.querySelector('.result-container').style.display = 'none';
    document.querySelector('.timeout-container').style.display = 'block';
}

function restartQuiz() {
    document.querySelector('.result-container').style.display = 'none';
    document.querySelector('.timeout-container').style.display = 'none';
    document.querySelector('.conf-container').style.display = 'block';
}
