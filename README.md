# PROJECT-2: QUIZ APPLICATION
---
**PRESENTATION:**  
The Quiz app presented in this repository is built using the technologies taught in my training. It has been designed taking into account the principles of ease of use and efficiency. The design includes a Quiz structure that generates questions dynamically via an API using the navigation bar. The questions and the choices of the questions are randomly changed when choosing a new category or when the same exam is restarted. In this Quiz app you will encounter questions in various categories and varying difficulty levels, and you will be able to test your knowledge again.
***  

## Features  
* => Informative "How To" page
* => A navigation bar built using Bootstrap   
* => Custom font view with Google font family
* => Responsive design for devices    
* => 3 levels of difficulty and level indicator
* => Question cards with Bootstrap grid structure  
* => Indicator structure showing which question you are in
* => Questions come dynamically from an API 
* => Changing the order of questions and options by restarting the test
* => Pagination navigation for easy switching between questions
* => Refresh button that allows you to repeat the test
* => A scoreboard showing your total score
***

## Used Technologies
* => **HTML**
* => **CSS**
* => **Bootsrap**
* => **Javascript**
* => **Git & Github**
* => **Visual Studio Code**
* => **Google Developer Tool**  
***

## Testing  
1. **NAVBAR**  
* Do the fonts and colors of the buttons on the navigation bar work properly?

* Are the category buttons hidden when the page loads?

* Does the behavior of the elements of the dropdown menu work correctly?

* Do the categories become visible when the level button is clicked?

* Is the Level button disabled when one of the categories is clicked?

* When one of the categories is clicked, does the font color change, indicating that the level button is inactive?

* After selecting a level from the menu, before choosing a category, can the preference made from the level button be sent to the quiz card dynamically?

* When choosing from the Level button, are questions equal to the selected level drawn?

* Does Quiz card appear when clicking a category?

* Is it possible to switch to other categories while a level is selected?

* Is the category tab hidden in the navigation bar after the test is over?

* Does the Level button become active after the test is over?
* * Does the text color change when the level button is activated?

* Does the level button become inactive when the restart button is clicked?

* Does the level button change to the default view after the test is over?

* Do the categories become visible when the selection is made from the level button after the test is over?



2. **CARD BODY**  
* Are questions pulled from the URL displayed in the correct place when a category is selected?

* Do option buttons show one after the other when a category is clicked?

* Is the Question navigation working correctly, showing which question of the quiz you are in?

* When a choice is made from the question's options, does it match the correct answer?

* Is the green button shown when the prediction of the problem is correct, and the red button is shown when it is incorrect?

* Is the category information displayed on the quiz card when a category is selected?

* Is level information displayed on the quiz card when a level is selected?

* Does it dynamically pull URL category information and level information?

* Is the API pulling correctly?
* * Is the extracted data sent by parsing to the card?

* Showing next, previous and restart keys on the page

* Is the Start Network button hidden while the quiz is running?

* Does the previous and next button bring up the previous and next question?

* Is the score information displayed correctly on the leaderboard?

* When the start button is clicked, are the same test questions and options brought by changing their places?

* When the start again button is clicked, do the options of the questions are changed?

* When the start again button is clicked, is the level set to the default value?



3. **FOOTER**  
* Is the footer view positioned at the bottom of the page according to the screen used?
***

## Deployment
This website design was produced with the Visual Studio Code IDE. Git was used as the version control system and saved in GitHub repositories. I used the $git -init command to start this project. Then I used the git status code to check the status of the written codes, then git add so that my local repository could see the written codes. I used the command. I saved this file to our local repository by leaving a commit message with git commit - m "xxxxxxxxx". I performed the SSH-keygen operation before doing the push operation. Then I validated my attempt by using the new feature of github, token usage. As the last step, I applied the push operation and saved it to the remote repository. I will do these operations again in every development and update of the project.
***

## Acknowledgements
**This project was created by reviewing Bootsrap's and other documentation, using the following components.**  
* Nav [https://getbootstrap.com/docs/4.0/components/navs/](https://getbootstrap.com/docs/4.0/components/navs/)
* Jumbotron [https://getbootstrap.com/docs/4.0/components/jumbotron/](https://getbootstrap.com/docs/4.0/components/jumbotron/)
* Badge [https://getbootstrap.com/docs/4.0/components/badge/](https://getbootstrap.com/docs/4.0/components/badge/)
* Buttons [https://getbootstrap.com/docs/4.0/components/buttons/](https://getbootstrap.com/docs/4.0/components/buttons/)
* Cards [https://getbootstrap.com/docs/4.0/components/card/](https://getbootstrap.com/docs/4.0/components/card/)
* API - Open Trivia DB [https://opentdb.com/api_config.php](https://opentdb.com/api_config.php)
* Stack Overflow [https://stackoverflow.com/](https://stackoverflow.com/)
* Free Code Camp [https://www.freecodecamp.org/](https://www.freecodecamp.org/)
* W3 Schools [https://www.w3schools.com/](https://www.w3schools.com/)
* jQuery [https://jquery.com/](https://jquery.com/)
***
