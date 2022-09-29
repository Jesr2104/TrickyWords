// vars 
//--------------------------------------------------------------------------
const endpointTrickyWordsDB = 'TrickyWordLisDB'

// Modals
//==========================================================================
const modalInsertword = document.getElementById('modal-insert-word')
//==========================================================================

// button to insert new trickyWord
const openInsertWord_btn = document.getElementById('insertWord-btn')

// button to sent data to the server to insert the new word
const insertWord_btn = document.getElementById('insertWord-form')

// button id on the form to close de modal
const closeModalInsertWord_btn = document.getElementById('closeModalInsertWord-btn')

// button to insert a question on the form
const addQuestion_btn = document.getElementById('buttonToAddQuestions')

// container for the questions
const questionsContainers = document.getElementsByName('questions')

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

    let contenerdor = document.getElementById('questions');

    let clon = document.querySelector('.clonar');
    let newClon = clon.cloneNode(true);

    contenerdor.appendChild(newClon).classList.remove('clonar');
}

// function to insert de new word on the server
async function insertNewTrickyWord(e){
    e.preventDefault()

    const databaseRef = firebase.database().ref(endpointTrickyWordsDB)
    const postRef = databaseRef.push()

    //get data of from the form
    var trickyWord_form = document.getElementById('trickyword').value
    var type_form = document.getElementById('type-word').value
    var dificult_form = document.getElementById('dificult').value
    var nbook_form = document.getElementById('book').value
    var nLesson_form = document.getElementById('nlesson').value    
    
    var array1 = ['question', 'what is the meaning of Partly']
    var array2 = ['correct','not completely']
    var array3 = ['incorrectA','completely']
    var array4 = ['incorrectB','party related']
    var array5 = ['incorrectC','something funny']

    var questionslist = [array1, array2, array3, array4, array5];    

    // Falta chequear que los valores no este vacios

    postRef.set({
        uid: getPostId(postRef.toString()),
        idTrickyWord: uuid.v4(),
        trickyWord: trickyWord_form,
        type: type_form ,
        dificult: dificult_form,
        nbook: nbook_form,
        nLesson: nLesson_form,
        questions: questionslist,
    });
        
    closeModal_InsertWord()
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