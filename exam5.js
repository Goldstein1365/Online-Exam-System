let questions = []; //an empty array that stores the exam questions
let currentQuestion = 0; //
let answers = [];
let timeLeft = 15 * 60; // 60 minutes in seconds 900s
let timerInterval;
let examSubmitted = false;
let isReviewing = false;

function startExam() {
  const examType = document.getElementById("exam-type").value;
  switch (examType) {
    case "physics":
      questions = physicsQuestions;
      document.getElementById("exam-title").innerHTML = "Physics Exam";
      break;
    case "chemistry":
      questions = chemistryQuestions;
      document.getElementById("exam-title").textContent = "Chemistry Exam";
      break;
    case "html":
      questions = htmlQuestions;
      document.getElementById("exam-title").textContent = "HTML Exam";
      break;
    case "eet224":
      questions = eet224Questions;
      document.getElementById("exam-title").textContent = "EET224 Exam";
      break;
    case "css":
      questions = cssQuestions;
      document.getElementById("exam-title").textContent = "CSS Exam";
      break;
    case "java":
      questions = javaQuestions;
      document.getElementById("exam-title").textContent = "JAVA Exam";
      break;
    case "mce":
      questions = mceQuestions;
      document.getElementById("exam-title").textContent = "MCE220 Exam";
      break;
    case "mce1":
      questions = mceQuestions1;
      document.getElementById("exam-title").textContent = "MCE320 Exam";
      break;
  }

  answers = new Array(questions.length).fill(-1);
  shuffleArray(questions);
  document.getElementById("welcome-page").style.display = "none";
  document.getElementById("exam-container").style.display = "block";
  showQuestion();
  startTimer();
  updatePagination();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function showQuestion() {
  const q = questions[currentQuestion];
  const questionContainer = document.getElementById("question-container");
  questionContainer.innerHTML = `
                      <h2>Question ${currentQuestion + 1}</h2>
                      <p>${q.question}</p>
                      ${q.options
                        .map(
                          (option, index) => `
                          <div class="option">
                              <input type="radio" name="answer" id="option${index}" value="${index}" ${
                            answers[currentQuestion] === index ? "checked" : ""
                          } ${isReviewing ? "disabled" : ""}>
                              <label for="option${index}" class="${
                            isReviewing
                              ? index === q.correctAnswer
                                ? "correct"
                                : index === answers[currentQuestion]
                                ? "incorrect"
                                : ""
                              : ""
                          }">${option}</label>
                          </div>
                      `
                        )
                        .join("")}
                  `;

  if (!isReviewing) {
    document.querySelectorAll('input[name="answer"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        answers[currentQuestion] = parseInt(radio.value);
        updatePagination();
      });
    });
  }

  updateNavigation();
}

function updateNavigation() {
  document.getElementById("prev-btn").disabled = currentQuestion === 0;
  document.getElementById("next-btn").disabled =
    currentQuestion === questions.length - 1;
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      submitSef();
    } else if (timeLeft === 10 * 60) {
      //alert("You have less than 10 minutes left!");
      document.getElementById("demo").innerHTML =
        "less than 10 minutes left</p>";
    } else if (timeLeft === 7 * 60) {
      //alert("You have less than 3 minutes left!");
      document.getElementById("demo").innerHTML = "less than 3 minutes left";
    } else if (timeLeft === 60) {
      //alert("You have less than 1 minute left!");
      document.getElementById("demo").innerHTML = "less than 1 minutes left";
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60); // 900 / 60 = 15
  const seconds = timeLeft % 60; // 900 / 60 = 15 R 0
  document.getElementById("timer").textContent = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function updatePagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = questions
    .map((q, index) => {
      let className = "page-number ";
      if (isReviewing) {
        className +=
          answers[index] === q.correctAnswer
            ? "correct-answer"
            : "incorrect-answer";
      } else {
        className += answers[index] !== -1 ? "attempted" : "unattempted";
      }
      return `<div class="${className}" onclick="goToQuestion(${index})">${
        index + 1
      }</div>`;
    })
    .join("");
}

function goToQuestion(index) {
  currentQuestion = index;
  showQuestion();
}

function submitSef() {
  if (
    !examSubmitted
    //confirm("Are you sure you want to submit the exam?")
  ) {
    examSubmitted = true;
    clearInterval(timerInterval);
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;
    document.getElementById("exam-container").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("result").innerHTML = `
                          <h2 style="font-size:50px; color:#170555;">Exam Result</h2>
                          <p style="font-size:25px; color:#fff;">Score: ${score}/${
      questions.length
    }</p>
                          <p style="font-size:25px; color:green;">Percentage: ${percentage.toFixed(
                            2
                          )}%</p>
                          <p style="font-size:20px; font-weight:normal; letter-spacing:2px; font-family:sofia; color:#000;">Congratulations on completing the exam!</p>
                      `;
    document.getElementById("new-exam-btn").style.display = "inline-block";
    document.getElementById("review-btn").style.display = "inline-block";
  }
}
function submitExam() {
  if (!examSubmitted && confirm("Are you sure you want to submit the exam?")) {
    examSubmitted = true;
    clearInterval(timerInterval);
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;
    document.getElementById("exam-container").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("result").innerHTML = `
                          <h2 style="font-size:50px; color:#170555;">Exam Result</h2>
                          <p style="font-size:25px; color:#fff;">Score: ${score}/${
      questions.length
    }</p>
                          <p style="font-size:25px; color:green;">Percentage: ${percentage.toFixed(
                            2
                          )}%</p>
                          <p style="font-size:20px; font-weight:normal; letter-spacing:2px; font-family:sofia; color:#000;">Congratulations on completing the exam!</p>
                      `;
    document.getElementById("new-exam-btn").style.display = "inline-block";
    document.getElementById("review-btn").style.display = "inline-block";
  }
}

function calculateScore() {
  return answers.reduce((score, answer, index) => {
    return score + (answer === questions[index].correctAnswer ? 1 : 0);
  }, 0);
}

function reviewAnswers() {
  isReviewing = true;
  document.getElementById("result").style.display = "none";
  document.getElementById("exam-container").style.display = "block";
  document.getElementById("submit-btn").style.display = "none";
  document.getElementById("review-btn").style.display = "none";
  currentQuestion = 0;
  showQuestion();
  updatePagination();
}

document.getElementById("proceed-btn").addEventListener("click", startExam);

document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
});

document.getElementById("next-btn").addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
  }
});

document.getElementById("submit-btn").addEventListener("click", submitExam);

document.getElementById("new-exam-btn").addEventListener("click", () => {
  location.reload();
});

document.getElementById("review-btn").addEventListener("click", reviewAnswers);
