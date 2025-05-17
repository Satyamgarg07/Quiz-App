// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const scoreScreen = document.getElementById('score-screen');
const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const retryButton = document.getElementById('retry-btn');
const shareButton = document.getElementById('share-btn');
const questionElement = document.getElementById('question-text');
const questionNumberElement = document.getElementById('question-number');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreElement = document.getElementById('score');
const runningScoreElement = document.getElementById('running-score');
const totalQuestionsElement = document.getElementById('total-questions');
const progressBar = document.getElementById('progress-bar');
const scoreMessage = document.querySelector('.score-message');

// Quiz state variables
let currentQuestionIndex = 0;
let score = 0;
let acceptingAnswers = false;
let quizStartTime;

// Event listeners
startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', handleNextButton);
retryButton.addEventListener('click', startQuiz);
shareButton.addEventListener('click', shareResult);

// Initialize the quiz
function startQuiz() {
    // Reset quiz state
    currentQuestionIndex = 0;
    score = 0;
    acceptingAnswers = false;
    quizStartTime = new Date();
    
    // Show quiz screen, hide other screens
    startScreen.classList.add('hidden');
    scoreScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    
    // Update total questions in the score screen
    totalQuestionsElement.textContent = quizQuestions.length;
    runningScoreElement.textContent = '0';
    
    // Reset progress bar
    updateProgressBar();
    
    // Add animation class
    quizScreen.classList.add('fade-in');
    setTimeout(() => {
        quizScreen.classList.remove('fade-in');
    }, 500);
    
    // Set up first question
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    showQuestion(quizQuestions[currentQuestionIndex]);
    // Update question number display
    questionNumberElement.textContent = `Question ${currentQuestionIndex + 1}/${quizQuestions.length}`;
    // Update progress bar
    updateProgressBar();
}

function updateProgressBar() {
    const progressPercentage = ((currentQuestionIndex) / quizQuestions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

function showQuestion(question) {
    questionElement.textContent = question.question;
    acceptingAnswers = true;
    
    // Add animation to question
    questionElement.classList.add('question-animation');
    setTimeout(() => {
        questionElement.classList.remove('question-animation');
    }, 500);
    
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.dataset.correct = answer.correct;
        button.classList.add('answer-button');
        button.style.animationDelay = `${index * 0.15}s`;
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.classList.add('hidden');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    if (!acceptingAnswers) return;
    
    acceptingAnswers = false;
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    
    if (correct) {
        score++;
        runningScoreElement.textContent = score;
        // Add animation to score
        runningScoreElement.classList.add('score-bump');
        setTimeout(() => {
            runningScoreElement.classList.remove('score-bump');
        }, 300);
    }
    
    // Add classes to show correct/incorrect
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct === 'true');
        // Disable button clicks
        button.removeEventListener('click', selectAnswer);
    });
    
    // Show feedback animation
    if (correct) {
        showFeedback('Correct!', 'correct-feedback');
    } else {
        showFeedback('Wrong!', 'incorrect-feedback');
    }
    
    if (quizQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hidden');
    } else {
        // If it's the last question, show score
        setTimeout(() => {
            showScore();
        }, 1500);
    }
}

function showFeedback(text, className) {
    const feedback = document.createElement('div');
    feedback.textContent = text;
    feedback.classList.add('feedback', className);
    quizScreen.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 1000);
}

function setStatusClass(element, correct) {
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('incorrect');
    }
}

function handleNextButton() {
    currentQuestionIndex++;
    setNextQuestion();
}

function showScore() {
    quizScreen.classList.add('hidden');
    scoreScreen.classList.remove('hidden');
    scoreElement.textContent = score;
    
    // Add animation class
    scoreScreen.classList.add('fade-in');
    setTimeout(() => {
        scoreScreen.classList.remove('fade-in');
    }, 500);
    
    // Calculate time taken
    const endTime = new Date();
    const timeTaken = Math.floor((endTime - quizStartTime) / 1000); // in seconds
    
    // Set appropriate message based on score
    setScoreMessage(score, quizQuestions.length, timeTaken);
    
    // Animate score
    animateScoreCount();
}

function setScoreMessage(score, total, timeTaken) {
    const percentage = (score / total) * 100;
    let message;
    
    if (percentage === 100) {
        message = `Perfect score! You're a genius! Completed in ${formatTime(timeTaken)}.`;
    } else if (percentage >= 80) {
        message = `Excellent work! You know your stuff! Completed in ${formatTime(timeTaken)}.`;
    } else if (percentage >= 60) {
        message = `Good job! Keep learning! Completed in ${formatTime(timeTaken)}.`;
    } else if (percentage >= 40) {
        message = `Not bad! Try again to improve your score! Completed in ${formatTime(timeTaken)}.`;
    } else {
        message = `Keep practicing! You'll do better next time! Completed in ${formatTime(timeTaken)}.`;
    }
    
    scoreMessage.textContent = message;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
        return `${remainingSeconds} seconds`;
    } else if (minutes === 1) {
        return `1 minute and ${remainingSeconds} seconds`;
    } else {
        return `${minutes} minutes and ${remainingSeconds} seconds`;
    }
}

function animateScoreCount() {
    const scoreCircle = document.querySelector('.score-circle');
    scoreCircle.classList.add('score-reveal');
}

function shareResult() {
    // Create share text
    const shareText = `I scored ${score} out of ${quizQuestions.length} on the Brain Teaser Quiz! Can you beat my score?`;
    
    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: 'My Quiz Result',
            text: shareText,
            url: window.location.href
        })
        .catch((error) => {
            console.log('Sharing failed', error);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

function fallbackShare(text) {
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    
    // Select and copy text
    textarea.select();
    document.execCommand('copy');
    
    // Remove textarea
    document.body.removeChild(textarea);
    
    // Show feedback
    showFeedback('Result copied to clipboard!', 'copy-feedback');
} 