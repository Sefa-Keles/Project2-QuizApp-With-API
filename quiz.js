
//QUESTION CONSTRUCTOR
class Question {
    constructor(newQuestion){
        this.allOptions = newQuestion.allOptions;
        this.correct_answer = newQuestion.correct_answer;
        this.question = newQuestion.question;
    }
    checkAnswer(selectedElement){
        let parent = selectedElement.parentNode;
        document.getElementById("btnNext").disabled = false;//Next button disabled
        if(this.correct_answer === selectedElement.innerText){
            $(parent).attr("class", "btn btn-success"); //Correct answer
            $(parent).css("pointer-events","none");
            $(parent).siblings().attr ("disabled", "disabled");
            return true;
        }else {
            $(parent).attr("class", "btn btn-danger");
            $(parent).css("pointer-events","none");//Disable clickability of selected option
            $(parent).siblings().attr ("disabled", "disabled");
        }
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
let disableButton = "";

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
                disableButton = "true" //Buttons are enabled when the category is clicked.
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
                    const shuffle = (questionOptions) => {
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
                        questionOptions = [...questionData.results[i].incorrect_answers, questionData.results[i].correct_answer];//The options in the URL were collected in one line according to my own algorithm.
                        let shuffleOptions = shuffle(questionOptions); // Shuffle option items
                        //console.log(shuffleOptions)
                        let questionItem = questionData.results;
                        questionItem[i].allOptions = shuffleOptions;// Added a new object key to the API (allOptions)
                        questions.push(new Question(questionItem[i])); // New Question Created
                    }

                    //Creating new object
                    let quiz = new Quiz(questions);      

                    let startAgain = "false";//Control variable that changes the order of options when the Start Again button is clicked
                    const loadQuestion = () =>{ //Function to associate object with HTML 
                        
                        loadingGif.style.display = "none"; //Remove Gif and show card template
                        cardElement.style.display = "block";
                        let nextButton = document.getElementById("btnNext");
                        let previousButton = document.getElementById("btnPrevious");
                        document.getElementById("btnAgain").style.display= "none";
                        document.getElementById("buttons").style.visibility = "visible";

                        //Function that checks that the quiz has ended
                        if(quiz.isFinish()) {
                            showScore(previousButton, nextButton);
                        }else {  
                            let quizOptions = [];
                            let quizQuestion = quiz.getQuestion();
                            quizOptions = quizQuestion.allOptions;
                            if(startAgain === "true") quizOptions = quizOptions.sort(()=> Math.random()-0.5); //Change order on Start Again button click
                                
                            document.querySelector("#question").innerText = quizQuestion.question;//Questions are associated with template
                            for(let i in quizOptions){
                                let optionElement = document.querySelector("#option"+i);
                                let optionParent = optionElement.parentNode;
                                
                                //Activating the clickability of the selected optionctivating the clickability of the selected option
                                $(optionParent).css("pointer-events", "auto");
                                let parentElements = optionElement.parentElement;
                                optionElement.innerText = quizOptions[i]; //Options are associated with template
                                getSelection("btn"+i, optionElement); 
                                pagingQuestion(previousButton, nextButton, parentElements);           
                            }
                            //When the Previous button is clicked, it enables the options of the questions to be disabled.
                            if(disableButton === "false"){
                                document.getElementById("btnPrevious").disabled = true;
                                let buttonSiblings = document.getElementById("buttons");
                                let siblingsArray = Array.from(buttonSiblings.children);
                                let buttonArray = siblingsArray.filter(item => item.id % 2 !== 0);
                                buttonArray.forEach(element => element.disabled = true);
                             }else{
                                nextButton.disabled = true;
                             }
                            showProgress();
                        }  
                    }
                
                    //Where buttons are captured and the clicked button is sent to
                    const getSelection = (...selectionElements) => {
                        let button = document.getElementById(selectionElements[0]);
                        button.onclick = function(){ 
                            quiz.guess(selectionElements[1]);
                        };
                    };
                
                    //Function that handles events when the forward and back buttons are clicked
                    const pagingQuestion = (...pagingElements) => {
                        pagingElements[2].setAttribute("class", "btn btn-outline-primary");
                        pagingElements[2].removeAttribute("disabled");
                        if(quiz.questionIndex !== 0){
                            pagingElements[0].style.display = "block";
                            pagingElements[0].disabled = false;
                            pagingElements[0].onclick = () => { 
                                quiz.questionIndex--;
                                disableButton = "false";//Counter variable that controls pagination
                                document.getElementById("btnNext").disabled = false ;
                                loadQuestion();
                            }
                        } else{
                            pagingElements[0].style.display = "block";
                            pagingElements[0].disabled = true;
                            pagingElements[1].style.display ="block";
                            pagingElements[1].onclick = () => {
                                quiz.questionIndex++;
                                disableButton = "true";//Counter variable that controls pagination
                                loadQuestion();
                            };
                        }
                    }
                    //Function that calculates the total score at the end of the quiz and reloads the quiz
                    const showScore = (...pagingButtons) => {
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
                            startAgain = "true"//Control variable that changes the order of options when the Start Again button is clicked
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
                    const showProgress = () => {
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







