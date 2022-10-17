// vars 
//--------------------------------------------------------------------------
var numberOfQuestions = 2
const endpointTrickyWordsDB = 'TrickyWordLisDB'

// Modals
//==========================================================================
const modalInsertword = document.getElementById('modal-insert-word')
//==========================================================================

// button to insert new trickyWord
const openInsertWord_btn = document.getElementById('buttonsMenu_insert')

// button to sent data to the server to insert the new word
const insertWord_btn = document.getElementById('insertWord-form')

// button id on the form to close de modal
const closeModalInsertWord_btn = document.getElementById('closeModalInsertWord-btn')

// button to insert a question on the form
const addQuestion_btn = document.getElementById('buttonToAddQuestions')

// container of the tricking words
const trickingWordContaines = document.getElementById('trickingWordContainers')

// Functions
//--------------------------------------------------------------------------

// funcion to show and close de Insert tricky word
function showModal_InsertWord(){ modalInsertword.classList.add('modal-insert'); }
function closeModal_InsertWord(){ modalInsertword.classList.remove('modal-insert'); }

// function to getPostId
function getPostId(fullPath){ return fullPath.split("/")[4] }

// function to do Firebase Configuration
async function configuration(){
    const firebaseConfig = {
        apiKey: "AIzaSyCHBK4BMAxSqptYnOSoz-4wGyCZKJo-rDc",
        authDomain: "trickyword-justjump.firebaseapp.com",
        databaseURL: "https://trickyword-justjump-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "trickyword-justjump",
        storageBucket: "trickyword-justjump.appspot.com",
        messagingSenderId: "66455443739",
        appId: "1:66455443739:web:936be069969bad9da71bbe"
      };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}

// function to insert a new form to save a question
function insertQuestion(e){
    e.preventDefault();

    var div = document.createElement('div')
    div.setAttribute('class', 'form-inline')

    div.innerHTML = `
        <div class="form-question-row">
            <!-- label of the questions number -->
            <label id="labelNunQuestions">Question #${numberOfQuestions}</label>

            <!-- input of the questions  -->
            <div class="control">
                <input class="input is-small" type="text" id="trickyword" placeholder="Questions...?">
            </div>
            
            <!-- input of the correct answer and que other 3 wrong options -->
            <div id="containerOfOptions">
                <div>
                    <input class="input is-small" type="text" id="trickyword" placeholder="Correct answer">
                </div>
                <div>
                    <input class="input is-small" type="text" id="trickyword" placeholder="Option a.">
                </div>
                <div>
                    <input class="input is-small" type="text" id="trickyword" placeholder="Option b.">
                </div>
                <div>
                    <input class="input is-small" type="text" id="trickyword" placeholder="Option c.">
                </div>
            </div>

            <!-- button for delete question -->
            <div id="buttonRemove" class="no-seleccionable">
                <span class="spanButtonRemove" onclick="removeQuestionsForm(this)"> Delete</span>
            </div>
        </div>
    `

    // Finally we insert the new form
    contenerdor = document.getElementById('questions');
    contenerdor.appendChild(div)
    numberOfQuestions+=1;
}

//function to sort the index of the questions list
function sortIndexOftheQuestions(){
    var questionsList = getlistInsertedElements(document.querySelectorAll('.form-question-row'))

    numberOfQuestions = 2;
    var count = 0;
    while(count < questionsList.length){
        questionsList[count].getElementsByTagName('label')[0].innerHTML= 'Question # '+ numberOfQuestions;
        count+=1;
        numberOfQuestions += 1;
    }    
}

// function to get the item that have been created dynamically
function getlistInsertedElements(list){
    var count = 1;
    result = []
    while(count < list.length){
        result.push(list[count])
        count +=1       
    }
    return result;
}

// to remove de element fron the dom
function removeQuestionsForm(e){
    e.parentNode.parentNode.remove()
    sortIndexOftheQuestions()
}

// function to insert de new word on the server
async function insertNewTrickyWord(e){
    e.preventDefault()

    const databaseRef = firebase.database().ref(endpointTrickyWordsDB)
    const postRef = databaseRef.push()

    //get data of from the form
    var trickyWord_form = document.getElementById('trickyword').value
    var type_form = document.getElementById('type-word').value
    var difficult_form = document.getElementById('difficult').value
    var nbook_form = document.getElementById('book').value
    var nLesson_form = document.getElementById('nlesson').value    
    
    listFromForm  = document.querySelectorAll('.form-question-row');
    var count = 0;
    questionsList = [];

    while(count < listFromForm.length){
        const question = new Map();

        valueQuestion = listFromForm[count].getElementsByTagName('input')[0].value
        valueCorrectAnswer = listFromForm[count].getElementsByTagName('input')[1].value
        valueOptiona = listFromForm[count].getElementsByTagName('input')[2].value
        valueOptionb = listFromForm[count].getElementsByTagName('input')[3].value
        valueOptionc = listFromForm[count].getElementsByTagName('input')[4].value

        if(!(valueQuestion === "") && !(valueCorrectAnswer === "") && 
           !(valueOptiona === "") && !(valueOptionb === "") && !(valueOptionc === ""))
        {
            question.set('question', valueQuestion);
            question.set('correctAnswer', valueCorrectAnswer);
            question.set('optiona', valueOptiona);
            question.set('optionb', valueOptionb);
            question.set('optionc', valueOptionc);
            questionsList.push(question)
        }
        count += 1
    }

    if(!(questionsList.length === 0) && !(trickyWord_form === "") && !(type_form === "Select type of word") && 
       !(difficult_form === "Select difficult") && !(nbook_form === "Select book") && !(nLesson_form === ""))
    {
        postRef.set({
            uid: getPostId(postRef.toString()),
            idTrickyWord: uuid.v4(),
            trickyWord: trickyWord_form,
            type: type_form ,
            difficult: difficult_form,
            nbook: nbook_form,
            nLesson: nLesson_form,
        });

        var commentsRef = firebase.database().ref(endpointTrickyWordsDB + '/' + getPostId(postRef.toString()) + '/questions');

        for(let i = 0; i < questionsList.length; i++){
            var newpost = commentsRef.push();
            newpost.set({
                question: questionsList[i].get('question'),
                correctAnswer: questionsList[i].get('correctAnswer'),
                optiona: questionsList[i].get('optiona'),
                optionb: questionsList[i].get('optionb'),
                optionc: questionsList[i].get('optionc'),
            })
        }
        
    } else {
        console.log("emtpy")
    }
    closeModal_InsertWord()
}

// function to get information fron the server
async function getDataFromDatabase(){
    const dbRef = firebase.database().ref()
    dbRef.child(endpointTrickyWordsDB).get().then((snapshot) => {
        if(snapshot.exists()) {
            var trickWordList = [];
            snapshot.forEach(childSnapshot => {
                trickWordList.push(childSnapshot.val())                
            });
            loadTrickingWordOntheTable(trickWordList)
        } else {
            // case: data base is empty
            console.log("No data available")
        }
    })                
}

// function to load the tricking word on the table
function loadTrickingWordOntheTable(trickWordList){
    count = 0;
    while(count < trickWordList.length){
        trickingWordContaines.innerHTML +=  getItemSetup(trickWordList[count], count + 1)
        count += 1;
    }
}

// function to get the type on text
function getType(typeCode){
    if(typeCode == 1){
        return "Verbs"
    } else if(typeCode == 2){
        return "Adjectives"
    } else if(typeCode == 3){
        return "Nouns"
    } else if(typeCode == 4){
        return "Phrasal verb"
    } else if(typeCode == 5){
        return "Expression"
    } 
}

// function to create que number of the complete
function getBookName(bookNumber){
    return `Callan #${bookNumber}`
}

// function to become the first letter on uppercase
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// create the view of the item word
function getItemSetup(item, numberItem){
    questionList = ""
    
    Object.keys(item.questions).forEach(itemNew => {
        questionList += `
        <div style="border: solid 1px white; border-radius: 5px; margin: 10px 0 10px 0; padding: 10px; background-color: rgba(0, 0, 0, 0.150);">
            <div style="margin-bottom: 5px;">
                <label style="font-size: 18px;"><u>${capitalizeFirstLetter(item.questions[itemNew].question)}</u></label>
            </div>

            <div style="display: flex;">

                <div style="margin-right: 10px;">
                    <div class="field" style="padding: 5px; line-height: 1.1;">
                        <label class="table_labels" style="display: block;font-size: 10px;">Correct Answer:</label>
                        <label class="result_value" style="font-size: 20px;">${capitalizeFirstLetter(item.questions[itemNew].correctAnswer)}</label>
                    </div>
                </div>

                <div style="background-color: white; padding: 0.5px;"></div>

                <div style="margin: 0 10px 0 10px;">
                    <div class="field" style="padding: 5px; line-height: 1.1;">
                        <label class="table_labels" style="display: block;font-size: 10px;">Option 1:</label>
                        <label class="result_value" style="font-size: 20px;">${capitalizeFirstLetter(item.questions[itemNew].optiona)}</label>
                    </div>
                </div>

                <div style="background-color: white; padding: 0.5px;"></div>

                <div style="margin: 0 10px 0 10px;">
                    <div class="field" style="padding: 5px; line-height: 1.1;">
                        <label class="table_labels" style="display: block;font-size: 10px;">Option 2:</label>
                        <label class="result_value" style="font-size: 20px;">${capitalizeFirstLetter(item.questions[itemNew].optionb)}</label>
                    </div>
                </div>

                <div style="background-color: white; padding: 0.5px;"></div>

                <div style="margin-left: 10px;">
                    <div class="field" style="padding: 5px; line-height: 1.1;">
                        <label class="table_labels" style="display: block;font-size: 10px;">Option 3:</label>
                        <label class="result_value" style="font-size: 20px;">${capitalizeFirstLetter(item.questions[itemNew].optionc)}</label>
                    </div>
                </div>
            </div>
        </div>
        `
    })
    
    newItem = `
    <!-- Item Number ${numberItem} -->
    <div id="itemTrickingWord">
        <!-- number of the items -->
        <div id="idItem">
            <label id="numberOfItem">${numberItem}</label>                                                
        </div>
        <div id="contentItem">
            <!-- information of he word -->
            <div id="informationTrickingWord">
                <div>
                    <div id="wordContainer">
                        <label class="labels_title">Word:</label>
                        <label id="labels_wordValue">${item.trickyWord}</label>
                    </div>
                </div>

                <div style="padding-left: 15px;">
                    <div style="padding: 5px; line-height: 1.1; margin-bottom: 0px !important;">
                        <label class="labels_title">Type:</label>
                        <label class="labels_informationValues">${getType(item.type)}</label>
                    </div>
                    
                    <div style="padding: 5px; line-height: 1.1;">
                        <label class="labels_title">Difficult:</label>
                        <label class="labels_informationValues">${item.difficult}</label>
                    </div>
                </div>

                <!-- while line in vertical -->
                <div style="background-color: white; padding: 1px; margin: 10px;"></div>

                <div style="display: flex;">
                    <div>
                        <div style="padding: 5px; line-height: 1.1;">
                            <label class="labels_title">Book nº:</label>
                            <label class="labels_informationValues">${getBookName(item.nbook)}</label>
                        </div>
                    </div>

                    <div>
                        <div style="padding: 5px; line-height: 1.1;">
                            <label class="labels_title">lesson:</label>
                            <label class="labels_informationValues">${item.nLesson}</label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- questions lists -->
            <div style="padding: 0 10px 0 10px;">
                <label style="font-size: 22px;">Questions</label>
                <div style="background-color: white; padding: 0.03em; margin-bottom: 3px;"></div>
                <div style="background-color: white; padding: 0.03em"></div>
                ${questionList}
            </div>
        </div>
    </div>
    `

    itemContainer = `
    <!-- newItemContainer -->
        <tr style="width: 100%;">
            <div id="item-TrickingWords">
                ${newItem}            
            </div>
        </tr>
    `

    return itemContainer
}

// Events control -------------------->>>>
//-------------------------------------------------------------------------

// button to close form insert word
closeModalInsertWord_btn.addEventListener('click', closeModal_InsertWord)

//event to call de form to insert new word
openInsertWord_btn.addEventListener('click', showModal_InsertWord)

// event to insert de new word on the server
insertWord_btn.addEventListener('submit', insertNewTrickyWord)

// event to add a question on the form 
addQuestion_btn.addEventListener('click', insertQuestion)

// Functions main call  -------------------->>>>
configuration() // function to setup the firebase database
getDataFromDatabase()