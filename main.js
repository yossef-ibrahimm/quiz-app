let countSpan = document.querySelector(".count span");
let quizapp = document.querySelector(".quiz_app");
let resulted = document.querySelector(".resulted");
let quizAria = document.querySelector(".quiz_aria");
let answers_area = document.querySelector(".answers_area");
let btn = document.querySelector(".submit_button");
let count = document.querySelector(".count");
let timer = document.getElementById("countdown");
let currentIndex = 0;
let rightAnswer = 0;
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 30;
const ALERT_THRESHOLD = 10;
let TIME_LIMIT = 105;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
const COLOR_CODES = {
  info: {
    color: "green",
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD,
  },
};
let remainingPathColor = COLOR_CODES.info.color;
function getQuestions() {
  //    send request to questions and answers api
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      var questions = JSON.parse(this.responseText);
      var questionsCount = questions.length;
      startTimer(questionsCount);
      // create questions
      addQuestionsData(questions[currentIndex], questionsCount);
      btn.onclick = () => {
        clearInterval(timerInterval);
        timePassed = -1;
        startTimer(questionsCount);
        //    take the right answer from the api
        let the_right_answer = questions[currentIndex].right_answer;
        // add 1 for currentIndex
        currentIndex++;
        numOfThisQuestion(currentIndex + 1);
        //   check answer
        checkAnswer(the_right_answer, questionsCount);
        //    remove this question and put the next one by click
        answers_area.innerHTML = "";
        quizAria.innerHTML = "";
        // add the questions data
        addQuestionsData(questions[currentIndex], questionsCount);
        // sow results
        showREsults(questionsCount);
      };
    }
  };
  myRequest.open("GET", "questions.json", true);
  myRequest.send();
}
function numOfThisQuestion(num) {
  // make the question counter
  countSpan.innerHTML = num;
}
//  function add q and answers to page
function addQuestionsData(obj, count) {
  if (currentIndex < count) {
    // create the h2 question
    let question = document.createElement("h2");
    // create the question text
    let questionText = document.createTextNode(obj["title"]);
    // add text to h2
    question.appendChild(questionText);
    quizAria.appendChild(question);
    // create the answerers
    for (let i = 0; i < 4; i++) {
      // create the elements
      let radioInput = document.createElement("input");
      let label = document.createElement("label");
      // add id & name & type & dataset for input
      radioInput.id = `answer${i}`;
      radioInput.name = "questions";
      radioInput.dataset.answer = obj[`answer_${i + 1}`];
      radioInput.type = "radio";
      // add htmlFor for the label
      label.htmlFor = `answer${i}`;
      // create text & num for label
      let labelText;
      switch (i) {
        case 0:
          labelText = document.createTextNode(`A. ${obj[`answer_${i + 1}`]}`);
          break;
        case 1:
          labelText = document.createTextNode(`B. ${obj[`answer_${i + 1}`]}`);
          break;
        case 2:
          labelText = document.createTextNode(`C. ${obj[`answer_${i + 1}`]}`);
          break;
        case 3:
          labelText = document.createTextNode(`D. ${obj[`answer_${i + 1}`]}`);
          break;
      }
      // add elements to the page
      answers_area.appendChild(radioInput);
      answers_area.appendChild(label);
      label.appendChild(labelText);
      // make the first answer checked
      if (i === 0) {
        radioInput.checked = true;
      }
    }
  }
}
function checkAnswer(rAnswer, qLength) {
  let answers = document.getElementsByName("questions");
  let chosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === chosenAnswer) {
    rightAnswer++;
  }
}
function showREsults(qcount) {
  let theResulted;
  if (currentIndex === qcount) {
    count.innerHTML = "";
    quizAria.innerHTML = "";
    answers_area.remove();
    btn.innerHTML = "try agian";
    btn.onclick = function () {
      location.reload();
    };
    quizapp.style.cssText =
      " height: 100vh;display: flex;align-items: center;justify-content: center;";
    quizAria.innerHTML = "GAME OVER";
    quizAria.style.cssText =
      " font-weight: bold; font-size: 70px; color:#db2525";

    if (rightAnswer >= qcount / 2 && rightAnswer < qcount) {
      theResulted = `<span class="good"> Good  </span> ${rightAnswer}/${qcount} you can get better `;
    } else if (rightAnswer === qcount) {
      theResulted = `<span class="perfect"> Perfect  </span> ${rightAnswer}/${qcount}<img src="/png/kisspng-check-mark-clip-art-green-tick-png-free-download-5a75700e2f8582.9282309115176458381947.png" alt="">`;
    } else {
      theResulted = `<span class="bad"> Bad  </span> ${rightAnswer}/${qcount} learn and try again later  `;
    }
    resulted.innerHTML = theResulted;
  }
}
timer.innerHTML = `
<div class="base-timer">
<svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<g class="base-timer__circle">
<circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
<path
id="base-timer-path-remaining"
stroke-dasharray="283"
class="base-timer__path-remaining ${remainingPathColor}"
d="
M 50, 50
m -45, 0
a 45,45 0 1,0 90,0
a 45,45 0 1,0 -90,0
"
></path>
    </g>
    </svg>
    <span id="base-timer-label" class="base-timer__label">${formatTime(
      timeLeft
    )}</span>
  </div>
  `;
function onTimesUp() {
  clearInterval(timerInterval);
  TIME_LIMIT = 105;
  timePassed = 0;
  timeLeft = TIME_LIMIT;
  btn.click();
}
function changeColor() {
  if (timeLeft > WARNING_THRESHOLD) {
    document.getElementById("base-timer-path-remaining").style.cssText =
      "rgb(65, 184, 131);";
  } else if (timeLeft <= WARNING_THRESHOLD && timeLeft > ALERT_THRESHOLD) {
    document.getElementById("base-timer-path-remaining").style.color = "orange";
  } else if (timeLeft <= ALERT_THRESHOLD) {
    document.getElementById("base-timer-path-remaining").style.color = "red";
  }
}
function startTimer(count) {
  if (currentIndex < count - 1) {
    timerInterval = setInterval(() => {
      timePassed = timePassed += 1;
      timeLeft = TIME_LIMIT - timePassed;
      document.getElementById("base-timer-label").innerHTML =
        formatTime(timeLeft);
      setCircleDasharray();
      changeColor();
      if (timeLeft === 0) {
        onTimesUp();
      }
    }, 1000);
  } else {
    timer.innerHTML = "";
  }
}
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}
function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}
function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}
getQuestions();
numOfThisQuestion(1);
