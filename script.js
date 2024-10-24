let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let markedForReview = [];
let attemptedQuestions = [];
let timer;

fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    loadQuestion();
    startTimer(600); 
  });

function loadQuestion() {
  const questionObj = questions[currentQuestionIndex];
  document.getElementById('question').textContent = questionObj.question;
  const optionsList = document.getElementById('options');
  optionsList.innerHTML = '';
  
  questionObj.options.forEach((option, index) => {
    const li = document.createElement('li');
    li.textContent = option;
    li.addEventListener('click', () => selectAnswer(index));
    optionsList.appendChild(li);
  });

  updateStatusBar();
  updateSelectedAnswer();
}

function selectAnswer(selectedIndex) {
  attemptedQuestions[currentQuestionIndex] = selectedIndex;
  loadQuestion(); 
}

function updateSelectedAnswer() {
  const options = document.getElementById('options').children;
  const selectedIndex = attemptedQuestions[currentQuestionIndex];
  if (selectedIndex !== undefined) {
    options[selectedIndex].style.backgroundColor = 'green';
  }
}

function updateStatusBar() {
  document.getElementById('attempted').textContent = `Attempted: ${attemptedQuestions.length}`;
  document.getElementById('unattempted').textContent = `Unattempted: ${questions.length - attemptedQuestions.length}`;
  document.getElementById('review').textContent = `Marked for Review: ${markedForReview.length}`;
}

function markForReview() {
  if (!markedForReview.includes(currentQuestionIndex)) {
    markedForReview.push(currentQuestionIndex);
  }
  updateStatusBar();
}

document.getElementById('mark-review').addEventListener('click', markForReview);
document.getElementById('next-question').addEventListener('click', () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  }
});
document.getElementById('prev-question').addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
});

function startTimer(duration) {
  let timeLeft = duration;
  const countdownElement = document.getElementById('countdown');
  
  timer = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      endQuiz();
    }

    timeLeft--;
  }, 1000);
}

function endQuiz() {
  let finalScore = 0;
  questions.forEach((q, i) => {
    if (attemptedQuestions[i] === q.answer) {
      finalScore += 4;
    } else if (attemptedQuestions[i] !== undefined) {
      finalScore -= 1;
    }
  });

  document.getElementById('score').textContent = `Your Score: ${finalScore}`;
  clearInterval(timer);
}

document.getElementById('end-quiz').addEventListener('click', endQuiz);
document.getElementById('reattempt').addEventListener('click', () => {
  location.reload(); 
});


document.getElementById('user-name').textContent = localStorage.getItem('username');


   
