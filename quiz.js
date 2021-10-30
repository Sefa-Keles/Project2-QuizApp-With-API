
//QUESTION CONSTRUCTOR
class Question {
    constructor(newQuestion){
        this.allOptions = newQuestion.allOptions;
        //this.category = category;
        this.correct_answer = newQuestion.correct_answer;
        //this.difficulty = difficulty;
        //this.incorrect_answers = incorrect_answers;
        this.question = newQuestion.question;
        //this.type = type;
    }
}

Question.prototype.checkAnswer = function(selectedElement){
    let parent = selectedElement.parentNode;
    if(this.correct_answer === selectedElement.innerText){
        $(parent).attr("class", "btn btn-success");
        $(parent).siblings().attr ("disabled", "disabled");
        return true;
    }else {
        $(parent).attr("class", "btn btn-danger");
        $(parent).siblings().attr ("disabled", "disabled");
    }  
}

//QUIZ CONSTRUCTOR
class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.score = 0;
        this.questionIndex = 0; 
    }
}

Quiz.prototype.getQuestion = function(){ 
    let nextQuestion = this.questions[this.questionIndex];
    return nextQuestion; 
}

Quiz.prototype.isFinish = function(){
    return this.questions.length === this.questionIndex;
}

Quiz.prototype.guess = function (selectedElement){ 
    let myQuestion = this.getQuestion();
    if(myQuestion.checkAnswer(selectedElement)){
        this.score++;
    }
}

$(".nav-item, .dropdown-item").css("font-weight", "bold");
$(".nav-link, .dropdown-item").css("color", "#FF5733");
$(".anchor").css("color", "#900C3F");
let url = "";
let levels = "";
let dropdowns = document.querySelectorAll(".dropdown-item");
let dropdownList = document.querySelector(".select-level");
let anchors = document.querySelectorAll(".anchor");
let anchorsArray = Array.from(anchors);
//console.log(dropdownList);

//1 anchorsArray.forEach(items => items.disabled =true);
anchorsArray.forEach(element => {
    element.style.display="none";
});

dropdowns.forEach(items => {
    items.addEventListener("click", function(){
        levels = items.id;   
        //2 $(".select-level").css("color", "grey");
        //3 anchorsArray.forEach(items => items.disabled = false);
        //4 $(".anchor").css("color", "#fe5a1d");
        $(".select-level").text(`Level: ${levels.toUpperCase()}`);
        anchorsArray.forEach(element => {
            element.style.display="block";
        });
        //console.log(dropdownList)
        //console.log(levels);
        anchorsArray.forEach(element => { 
            element.addEventListener("click", function(){
                dropdownList.disabled = true;  
                //element.disabled=false;
                //9 $(".select-level").css("color", "grey");
                //8 $(".anchor").css("color", "#fe5a1d");
                let quizText = element.text; 
                let quizTitle =`${quizText} - ${levels.toUpperCase()}`
                $(".quiz-title").text(quizTitle);//Card header changes dynamically
                let anchorId = element.id;
                //console.log(levels);
                url = `https://opentdb.com/api.php?amount=10&${anchorId}&difficulty=${levels}&type=multiple`;
                //console.log(url);
                const xhr = new XMLHttpRequest();
        
        //Function that makes API request from url (Asynchronous)
        xhr.open("GET", url, true);
        
        //The function that works as soon as the api is loaded from the url
        xhr.onload = function() {
            if(this.status === 200);
            let questionData = JSON.parse(this.responseText);
        
            //Function that shuffles the order of options from url
            let shuffle = (questionOptions) => {
                let currentIndex = questionOptions.length,  randomIndex;
                  while (currentIndex != 0) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex--;
                    [questionOptions[currentIndex], questionOptions[randomIndex]] = [questionOptions[randomIndex], questionOptions[currentIndex]];
                }  
                return questionOptions;
            }
        
            // Loop used to manipulate the API according to the algorithm
            let questions = [];
            for(let i in questionData.results){
                let questionOptions = [...questionData.results[i].incorrect_answers, questionData.results[i].correct_answer];// The options in the URL were collected in one line according to my own algorithm.
                let shuffleOptions = shuffle(questionOptions); // Shuffle option items
                let questionItem = questionData.results;
                questionItem[i].allOptions = shuffleOptions;// Added a new object key to the API (allOptions)
                questions.push(new Question(questionItem[i])); // New Question Created
            }
        
            let quiz = new Quiz(questions);
        
            //Function to associate object with HTML
            let loadQuestion = () =>{
                let nextButton = document.getElementById("btnNext");
                let previousButton = document.getElementById("btnPrevious");
                document.getElementById("btnAgain").style.display= "none";
                document.getElementById("buttons").style.visibility = "visible";
                if(quiz.isFinish()){
                    showScore(previousButton, nextButton);
                }else{  
                    let quizQuestion = quiz.getQuestion();
                    let quizOptions = quizQuestion.allOptions;
                    document.querySelector("#question").innerText = quizQuestion.question;
                    for(let i in quizOptions){
                        let optionElement = document.querySelector("#option"+i);
                        let parentElements = optionElement.parentElement;
                        optionElement.innerText = quizOptions[i]; 
                        getSelection("btn"+i, optionElement); 
                        pagingQuestion(previousButton, nextButton, parentElements);           
                    }
                    showProgress();
                }  
            }
            
            //where buttons are captured and the clicked button is sent to
            let getSelection = (...selectionElements) => {
                let button = document.getElementById(selectionElements[0]);
                button.onclick = function(){ 
                    quiz.guess(selectionElements[1]);
                };
            };
            
            //Function that handles events when the forward and back buttons are clicked
            let pagingQuestion = (...pagingElements) => {
            
                //for dongusu kullanilarak bu kod blogunu daha kisa yazabilirim.
                pagingElements[2].setAttribute("class", "btn btn-outline-primary");
                pagingElements[2].removeAttribute("disabled");
                if(quiz.questionIndex !== 0){
                    pagingElements[0].style.display = "block";
                    pagingElements[0].disabled = false;
                    pagingElements[0].onclick = () => {
                        quiz.questionIndex--;
                        loadQuestion();
                    }
                } else{
                    pagingElements[0].style.display = "block";
                    pagingElements[0].disabled = true;
                    pagingElements[1].style.display ="block";
                    pagingElements[1].onclick = () => {
                        quiz.questionIndex++;
                        loadQuestion();
                    };
                }
            
            }
            
            //Function that calculates the total score at the end of the quiz and reloads the quiz
            let showScore = (...pagingButtons) => {
                for(let i in pagingButtons){
                    pagingButtons[i].style.display = "none";
                };
                let html = `<h3>Total Score: ${quiz.score}</h3>`;
                document.querySelector("#question").innerHTML = html;
                document.getElementById("buttons").style.visibility = "hidden";
                let btnAgain = document.getElementById("btnAgain");
                btnAgain.style.display = "block";
                anchorsArray.forEach(element => {
                    element.style.display="none";
                });
                dropdownList.disabled=false;
                //6 dropdownList.disabled = false;
                //7 $(".select-level").css("color", "#fe5a1d");
                //anchors.disabled = true;
                //anchorsArray.forEach(items => items.disabled =true);
                //console.log(anchorsArray);
                //$(".anchor").css("color", "grey");
                btnAgain.onclick = () => {
                    quiz.score = 0;
                    btnAgain.style.display = "none";
                    dropdownList.disabled = true;
                    $(".select-level").css("color", "grey");
                    quiz.questionIndex = 0;
                    questions = questions.sort(()=> Math.random()-0.5);
                    loadQuestion();
                };
            };
            
            //Question Navigation
            let showProgress = () => {
                let total = quiz.questions.length;
                let questionNumber = quiz.questionIndex+1;
                document.querySelector("#progress").innerText =  "Question "+ questionNumber + " of " + total;
            };
            
            loadQuestion();
            
        }
        
        //The function where the API request is sent
        xhr.send();
                
            })
        });
                
    });
});



//Function to be triggered when navigating the navigation buttons







