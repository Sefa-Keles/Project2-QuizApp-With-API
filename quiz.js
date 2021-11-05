
//QUESTION CONSTRUCTOR
class Question {
    constructor(newQuestion){
        this.allOptions = newQuestion.allOptions;
        this.correct_answer = newQuestion.correct_answer;
        this.question = newQuestion.question;
    }
    checkAnswer(selectedElement){
        let parent = selectedElement.parentNode;
        let allButtons = parent.parentNode;
        if(this.correct_answer === selectedElement.innerText){
            $(parent).attr("class", "btn btn-success");
            $(parent).siblings().attr ("disabled", "disabled");
            return true;
        }else {
            $(parent).attr("class", "btn btn-danger");
            $(parent).siblings().attr ("disabled", "disabled");
        }  
        

        //ILERI GERI ISLEMLERINDE BUTTONLARI PASIF BIRAKMAK ICIN DENEME
        // let optionsArray = Array.from(allButtons.children);
        // for(let i in optionsArray){
        //     if(i % 2 === 0){
        //         optionsArray[i].disabled = true;
        //     }
        // }  
    }
}

//QUIZ CONSTRUCTOR
class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.score = 0;
        this.questionIndex = 0; 
    }
    getQuestion(){
        let nextQuestion = this.questions[this.questionIndex];
        return nextQuestion; 
    }

    isFinish(){
        return this.questions.length === this.questionIndex;
    }

    guess(selectedElement){
        let myQuestion = this.getQuestion();
        if(myQuestion.checkAnswer(selectedElement)){
            this.score++;
        }
    }
}

$(".nav-item, .dropdown-item").css("font-weight", "bold");
$(".nav-link, .dropdown-item").css("color", "#FF5733");
$("#howtoTab").css("color", "#FF5733");
$(".anchor").css("color", "#900C3F");
let url = "";
let levels = "";
let dropdowns = document.querySelectorAll(".dropdown-item");
let dropdownList = document.querySelector(".select-level");
let howTo = document.querySelector("#howtoTab");
let anchors = document.querySelectorAll(".anchor");
let loadingGif = document.querySelector(".loadingGif");
let cardElement = document.querySelector(".card");
let anchorsArray = Array.from(anchors);

//Function that controls the visibility of categories
let displayCategories = (text) =>{   
    anchorsArray.forEach(element => {
        element.style.display = text;
    });
}
displayCategories("none");//Hide categories

//Events when the level button is clicked
dropdowns.forEach(items => {
    items.addEventListener("click", function(){
        levels = items.id;
        cardElement.style.display = "none";
        $("#howtoTab").css("color", "#FF5733");
        $(".select-level").text(`Level: ${levels.toUpperCase()}`);
        displayCategories("block");//Show categories

        //Events when categories are clicked
        anchorsArray.forEach(element => { 
            element.addEventListener("click", function(){
                loadingGif.style.display = "block"; 
                cardElement.style.display = "none";
                dropdownList.disabled = true;
                dropdownList.style.color = "grey";
                let quizText = element.text; 
                let quizTitle =`${quizText} - ${levels.toUpperCase()}` //Quiz info in card
                $(".quiz-title").text(quizTitle);//Card header changes dynamically
                let anchorId = element.id;
                url = `https://opentdb.com/api.php?amount=10&${anchorId}&difficulty=${levels}&type=multiple`; //API pulled by category

                const xhr = new XMLHttpRequest();
        
            //Function that makes API request from url (Asynchronous <=> true)
            xhr.open("GET", url, true);
        
            //The function that works as soon as the api is loaded from the url
            xhr.onload = function() {
                if(this.readyState===4 && this.status === 200){
                    let questionData = JSON.parse(this.responseText); //Converting JSON data to string

                    //Function that shuffles the order of options from url data
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

                    //Creating new object
                    let quiz = new Quiz(questions);            
                    //Function to associate object with HTML
                    let loadQuestion = () =>{
                        //Remove Gif and show card template
                        loadingGif.style.display = "none"; 
                        cardElement.style.display = "block";
                        let nextButton = document.getElementById("btnNext");
                        let previousButton = document.getElementById("btnPrevious");
                        document.getElementById("btnAgain").style.display= "none";
                        document.getElementById("buttons").style.visibility = "visible";
                        if(quiz.isFinish()) {
                            showScore(previousButton, nextButton);
                        }else {  
                            let quizQuestion = quiz.getQuestion();
                            let quizOptions = quizQuestion.allOptions;
                            document.querySelector("#question").innerText = quizQuestion.question;//Questions are associated with template
                            for(let i in quizOptions){
                                let optionElement = document.querySelector("#option"+i);
                                let parentElements = optionElement.parentElement;
                                optionElement.innerText = quizOptions[i]; ////Options are associated with template
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
                        $("#howtoTab").css("color", "#FF5733");
                        howTo.disabled = false;
                        $(".select-level").text("SELECT LEVEL");
                        let html = `<h3>Total Score: ${quiz.score}</h3>`;
                        document.querySelector("#question").innerHTML = html;
                        document.getElementById("buttons").style.visibility = "hidden";
                        let btnAgain = document.getElementById("btnAgain");
                        btnAgain.style.display = "block";
                        displayCategories("none"); //Hide categories
                        dropdownList.disabled=false;
                        dropdownList.style.color = "#FF5733";

                        //Click event of the Start Again button
                        btnAgain.onclick = () => {
                            quiz.score = 0;
                            btnAgain.style.display = "none";
                            dropdownList.disabled = true;
                            howTo.disabled = true;
                            $("#howtoTab").css("color", "grey");
                            $(".select-level").css("color", "grey");
                            quiz.questionIndex = 0;
                            questions = questions.sort(()=> Math.random()-0.5); //Changing the place of the test questions in case the quiz is repeated
                            loadQuestion();
                        };
                    };
                
                    //Question navigation information
                    let showProgress = () => {
                        let total = quiz.questions.length;
                        let questionNumber = quiz.questionIndex+1;
                        document.querySelector("#progress").innerText =  "Question "+ questionNumber + " of " + total;
                    };
                
                    loadQuestion();
        
                }
            }
            //The function where the API request is sent
            xhr.send(); 
            })
        });               
    });
});







