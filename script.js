let timerInterval;

// ✅ Pull metadata from localStorage
const meta = JSON.parse(localStorage.getItem('mcqMeta'));
let timeLeft = meta?.timeLimit || 60; // Use saved timer or fallback to 60s

function startQuiz() {
    document.getElementById('form-container').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');

    loadQuestionsFromStorage();

    // ✅ Display the starting time immediately
    document.getElementById('time').textContent = `${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`;

    timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('time').textContent = `${minutes}m ${seconds}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
            alert('Time is up!');
        }
    }, 1000);
}

function loadQuestionsFromStorage() {
    const savedMCQs = localStorage.getItem('mcqData');
    if (savedMCQs) {
        document.getElementById('questions-area').innerHTML = savedMCQs;
    } else {
        document.getElementById('questions-area').innerHTML = '<p>No MCQs loaded yet.</p>';
    }
}

function submitQuiz() {
    clearInterval(timerInterval);

    let score = 0;

    // Define correct answers manually or smarter way later
    const meta = JSON.parse(localStorage.getItem('mcqMeta'));
    const correctAnswers = meta?.correctAnswers || {};

    const form = document.getElementById('quiz-form');
    for (let key in correctAnswers) {
        const selected = form.querySelector(`input[name="${key}"]:checked`);
        if (selected && selected.value === correctAnswers[key]) {
            score++;
        }
    }

    document.getElementById('quiz-form').classList.add('hidden');
    const resultDiv = document.getElementById('result');
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = `You scored ${score} out of ${Object.keys(correctAnswers).length}`;
}
