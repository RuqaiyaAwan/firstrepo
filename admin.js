document.addEventListener('DOMContentLoaded', function () {
    const secretPassword = "MySuperSecret123";

    let parsedMCQs = '';
    let correctAnswers = {};
    let testTimer = 60;

    window.checkAdmin = function () {
        const enteredPassword = document.getElementById('adminPassword').value;
        if (enteredPassword === secretPassword) {
            document.getElementById('admin-login').classList.add('hidden');
            document.getElementById('admin-panel').classList.remove('hidden');
        } else {
            alert("Wrong password!");
        }
    }

    window.loadQuestions = function () {
        const fileInput = document.getElementById('fileInput');
        const preview = document.getElementById('preview');

        if (fileInput.files.length === 0) {
            alert("Please select a .txt file.");
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const text = e.target.result;
            parseMCQText(text);
            preview.innerHTML = parsedMCQs;
        };

        reader.readAsText(file);
    }

    function parseMCQText(text) {
        const lines = text.split('\n');
        let questionIndex = 1;
        parsedMCQs = '';
        correctAnswers = {};
        testTimer = 60;

        let currentQuestionText = '';
        let currentOptions = '';
        let inputName = '';
        let timerSet = false;

        lines.forEach(line => {
            const text = line.trim();

            if (!timerSet && text.startsWith('[TIMER:')) {
                const match = text.match(/\[TIMER:\s*(\d+)\]/i);
                if (match) {
                    testTimer = parseInt(match[1]) * 60;
                    timerSet = true;
                }
            }
            else if (/^\d+\./.test(text)) {
                if (currentQuestionText && currentOptions) {
                    parsedMCQs += `<div class="question"><h3>${currentQuestionText}</h3>${currentOptions}</div>`;
                    questionIndex++;
                }
                currentQuestionText = text;
                currentOptions = '';
                inputName = `q${questionIndex}`;
            }
            else if (/^[\*\-]?[A-Da-d]\./.test(text)) {
                const isCorrect = /^\*/.test(text);
                const cleanOption = text.replace(/^\*\s*/, '');
                currentOptions += `
                    <label>
                        <input type="radio" name="${inputName}" value="${cleanOption}"> ${cleanOption}
                    </label>
                `;
                if (isCorrect) {
                    correctAnswers[inputName] = cleanOption;
                }
            }
        });

        if (currentQuestionText && currentOptions) {
            parsedMCQs += `<div class="question"><h3>${currentQuestionText}</h3>${currentOptions}</div>`;
        }
    }

    window.saveQuestions = function () {
        if (!parsedMCQs || Object.keys(correctAnswers).length === 0) {
            alert("No valid questions or correct answers found. Did you mark answers with '*'?");
            return;
        }

        localStorage.setItem('mcqData', parsedMCQs);

        const meta = {
            correctAnswers: correctAnswers,
            timeLimit: testTimer
        };
        localStorage.setItem('mcqMeta', JSON.stringify(meta));

        alert('Questions and timer saved successfully!');
    }
});
