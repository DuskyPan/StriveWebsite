//   Author: Lyubomir Gaydadzhiev
//	 Matri No.: 40485552

//relating elements on the html page to js variables
var answers = document.querySelectorAll('.answer-button');
var answerArray = [].slice.call(answers);

for (let i = 0; i < answerArray.length; i++) {
  console.log(answerArray[i]);
} //testing to see if array is populated

const question = document.getElementById("question");

const questionCount = document.getElementById('questionCount');
const livesCountText = document.getElementById('livesCount');

//setting constant variables
const MAX_QUESTIONS = 15;
const MAX_LIVES = 3;

//initializing variables
let questionIndex = 0;
let currentLives = 0;
let accAnswer = false;
let currQuestion = {};
let availableQs = [];


let questionBank = [];

// fetch api - https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch - gets questions and answers from json
fetch("questionBank.json")
	.then(rep => {
		return rep.json();
	})
	.then(loadQs => {
		questionBank = loadQs;
		startQuiz();
	});

//main
startQuiz = () => {
	questionIndex = 0;
	currentLives = MAX_LIVES;
	availableQs = [...questionBank];
	getNextQuestion();
};

//check if user clicks on answers []
answerArray.forEach(answer => {addEventListener("click", clk => {
		if (!accAnswer) return;

		accAnswer = false;
		const selChoice = clk.target;
		const selAns = selChoice.dataset["number"];

		let choiceType = "wrong";

		if (selAns == currQuestion.correct) {
			choiceType = "right";
		}
		if (choiceType == "wrong") {
			loseLife();
		}

		//removes and reapplies correct colour
		selChoice.classList.remove("col");
		selChoice.parentElement.classList.add(choiceType);

		//This function makes sure to briefly pause and apply appropriate colour before moving on the next question
		setTimeout(() => {
			selChoice.parentElement.classList.remove(choiceType);
			selChoice.classList.add("col");
			getNextQuestion();
		}, 800);

	});
});

//randomises input
function randomiseQuestion(questionAmount) {
	return Math.floor(Math.random() * questionAmount);
};

//go to next question
getNextQuestion = () => {
	
	if (currentLives == 0) {
		return window.location.assign("trivLoss.html"); //get game over page when user loses all lives
	}

	if (questionIndex >= MAX_QUESTIONS || availableQs.length == 0) {
		return window.location.assign("trivWin.html"); //get results page when user is done
	}
	
	questionIndex = questionIndex + 1;
	
	questionCount.innerText = questionIndex + "/" + MAX_QUESTIONS;
	livesCountText.innerText = currentLives;

	const questionNum = randomiseQuestion(availableQs.length); //randomises number of question that gets picked from array
	currQuestion = availableQs[questionNum]; // picks rand no from array
	
	
	question.innerText = currQuestion.question; //actually makes the question text on the html page display the question
	
	for (let answer = 0; answer < answerArray.length; answer++) {
		
		const no = answerArray[answer].dataset["number"];
		answerArray[answer].innerText = currQuestion["answer" + no];
	}
	
	availableQs.splice(questionNum, 1); //makes sure to remove used question from array so it doesn't repeat
	accAnswer = true;
};

loseLife = () => {
	currentLives = currentLives - 1;
	livesCountText.innerText = currentLives;
};