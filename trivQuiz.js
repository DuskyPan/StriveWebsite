//   Author: Lyubomir Gaydadzhiev
//	 Matri No.: 40485552

//relating elements on the html page to js variables
const question = document.getElementById("question");
var answers = document.querySelectorAll('.answer-button');
var answerArray = [].slice.call(answers);

for (let i = 0; i < answerArray.length; i++) {
  console.log(answerArray[i]);
} //testing to see if array is populated properly
const questionCount = document.getElementById('questionCount');
const livesCountText = document.getElementById('livesCount');

//setting constant variables
const MAX_QUESTIONS = 15;
const MAX_LIVES = 3;

let currQuestion = {};
let accAnswer = false;
let questionIndex = 0;
let availableQs =  [];
let currentLives = 0;

let questionBank = [];

//
fetch("questionBank.json")
	.then( rep => {
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
	answerCheck();
};

function randomiseQuestion(questionAmount) {
	return Math.floor(Math.random() * questionAmount);
};

//go to next question
function getNextQuestion() {
	if (currentLives == 0) {
		return window.location.assign("trivLoss.html"); //get game over page when user loses all lives
	}

	if (questionIndex >= MAX_QUESTIONS || availableQs.length == 0) {
		return window.location.assign("trivWin.html"); //get results page when user is done
	}
	
	questionIndex =  questionIndex + 1;
	questionCount.innerText = questionIndex + "/" + MAX_QUESTIONS;
	livesCountText.innerText = currentLives;
	
	const questionNum = randomiseQuestion(availableQs.length); //randomises number of question that gets picked from array
	
	currQuestion = availableQs[questionNum]; // picks rand no from array
	question.innerText = currQuestion.question; //actually makes the question text on the html page display the question
	
	answers.forEach(choice => {
		const no = choice.dataset["number"];
		choice.innerText = currQuestion["answer" + no];
	});
	
	availableQs.splice(questionNum, 1); //makes sure to remove used question from array so it doesn't repeat
	accAnswer = true;

};

function answerCheck() {//check if user clicks on answers
answers.forEach(choice => {
	choice.addEventListener("click", clk => {
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

}

function loseLife() {
	currentLives = currentLives - 1;
	livesCountText.innerText = currentLives;
};
