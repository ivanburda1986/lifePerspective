//SELECTORS==========================
const ui = {
  //Questions container
  questionsContainer: document.querySelector('.questionsContainer'),

  //Profile creation
  questionProfileCreation: document.getElementById('question-profileName'),
  name: document.getElementById('createName'),
  createPassword: document.getElementById('createPassword'),
  repeatPassword: document.getElementById('repeatPassword'),

  //Gender
  questionGender: document.getElementById('question-gender'),

  //DOB
  questionDob: document.getElementById('question-dob'),
  years: document.getElementById('years'),
  months: document.getElementById('months'),
  days: document.getElementById('days'),
  dateErrorMessage: document.getElementById('dateErrorMessage'),

  //Country
  questionCountry: document.getElementById('question-country'),
  countryselect: document.getElementById('countryselect'),
  
  //Buttons
  nextBtn: document.getElementById('nextBtn'),
  loginBtn: document.getElementById('loginBtn'),
  backToCreationBtn: document.getElementById('backToCreationBtn'),

  //Existing profile login
  profileLogin: document.getElementById('profile-login'),
  loginName: document.getElementById('loginName'),
  loginPassword: document.getElementById('loginPassword'),

  //A list of existing profiles
  profileListContainer: document.getElementById('profileListContainer'),
  profileList: document.querySelector('.profileList'),
  profileListHidenBtn: document.getElementById('profileListHidenBtn'),
};

//DATA==========================
const data = {
  currentQuestion: 1,
  nameValue: null,
  passwordValue: null,
  nameValidation: "nok",
  nameRegistered: false,
  passwordValidation: "nok",
  dobValidation: "nok",
  today: new Date(),
}


//MANAGING THE UI==========================
//Upon load
function initiateUIState(){
  //Make sure only the first question is displayed
  ui.questionProfileCreation.style.display = 'visible';
  ui.questionProfileCreation.style.display = 'flex';
  ui.questionGender.style.display = 'none';
  ui.questionDob.style.display = 'none';
  ui.questionCountry.style.display = 'none';
  ui.profileLogin.style.display = 'none';
  ui.backToCreationBtn.style.display = 'none';
  ui.nextBtn.disabled = true;
  ui.nextBtn.classList = "questions-btn";
  ui.loginBtn.style.display = "flex";
  data.currentQuestion = 1;
  ui.name.value = "";
  ui.name.classList = "inputField createName";
  ui.createPassword.value = "";
  ui.createPassword.classList = "inputField createPassword";
  ui.repeatPassword.value = "";
  ui.repeatPassword.classList = "inputField repeatPassword";

  ui.name.classList.remove('alreadyRegistered');
  ui.loginBtn.classList.remove('highlight');
  ui.loginBtn.innerText = "Already registered?";
  
  //Make sure that no value is selected for the radio selection of gender
  Array.from(document.querySelectorAll('.radioOption')).forEach(radioOption =>{
    radioOption.checked = false;
  });

  //Populate the date of birth dropdown selectors
  (function(){
    let days = "";
    let months = [];
    let years = [];
  
    for(let i = 1; i<=31; i++){
      let day = `<option value="${i}">${i}</option>`;
      days+=day;
    };
    for(let i = 1; i<=12; i++){
      let month = `<option value="${i}">${i}</option>`;
      months+=month;
    };
    for(let i = 1900; i<=new Date(data.today).getFullYear(); i++){
      let year = `<option value="${i}">${i}</option>`;
      years+=year;
    };
    ui.days.innerHTML = days;
    ui.months.innerHTML = months;
    ui.years.innerHTML = years;
    ui.years.value = "2000";
  }());

  //Make sure the lits of all profiles is not visible
  ui.profileListContainer.style.visibility = 'hidden';
}

//Populate the list of countries to select from
async function showData(){
  let data = await getData();
  let countryList = [];
  data.map(dataItem => {
    countryList.push(dataItem.country);
  });
  countryList.sort();
  let htmlCountryList = "";
  countryList.forEach(function (country) {
    htmlCountryList += `
    <option value="${country}">${country}</option>
    `;
  });
  countryselect.innerHTML = htmlCountryList;
  
  //Set the default country as Austria
  ui.countryselect.value = "Austria";
};

//Display the list of available profiles
function listExistingProfiles(){
  ui.profileList.innerHTML = "";
  let profiles = getExistingProfilesListFromStorage();
  if(profiles.length === 0){
    //ui.profileListContainer.style.display = "none";
    let profileListItem = document.createElement("li");
      profileListItem.classList.add('profileListItem');
      profileListItem.classList.add('py-1');
      profileListItem.innerHTML = `<p>There are no profiles yet.</p>`;
      ui.profileList.appendChild(profileListItem);
  } else{
    ui.profileListContainer.style.display = "flex";
    profiles.forEach(profile => {
      //For each profile create a list item
      let profileListItem = document.createElement("li");
      profileListItem.id = profile;
      profileListItem.classList.add('profileListItem');
      profileListItem.classList.add('py-1');
      profileListItem.innerHTML = `<p>${profile}</p>`;
      ui.profileList.appendChild(profileListItem);
      //Event listener when a profile gets clicked in the list
      profileListItem.addEventListener('click', (e)=>{
        if(e.target.classList.contains('profileListItem')){
          localStorage.setItem('currentProfile', profile);
          window.open("main.html", "_self");
        }
      })
      //For each profile create a delete button
      let deleteButton = document.createElement("button");
      deleteButton.innerHTML = '&#10006;';
      profileListItem.appendChild(deleteButton);

      //Event listener for triggering the deletion
      deleteButton.addEventListener('click',(e)=>{
        e.preventDefault();
        e.target.parentNode.remove();
        updateExistingProfilesListInStorage('delete', profile);
        localStorage.removeItem(profile);
        listExistingProfiles();
      })
    })
  }
}

//EVENT LISTENERS==========================
//VALIDATIONS
//Profile creation - name
ui.name.addEventListener('keyup', ()=>{
  if(ui.name.value === "admin"){
    setTimeout(function(){
      ui.name.value = null;
    }, 1000);
    data.nameValidation = "nok";
    nextButtonState("profileCreation");
    return;
  }
  if(ui.name.value.length !== 0 && getExistingProfilesListFromStorage().indexOf(ui.name.value) !== -1){
    data.nameValidation = "nok";
    data.nameRegistered = true;
    nextButtonState("profileCreation");
    return;
  }
  if(ui.name.value.length !== 0){
    data.nameValidation = "ok";
    data.nameRegistered = false;
    nextButtonState("profileCreation");
  } else{
    data.nameValidation = "nok";
    data.nameRegistered = false;
    nextButtonState("profileCreation");
  }
})
//Profile creation - password
ui.createPassword.addEventListener('keyup', ()=>{
  if(ui.createPassword.value.length >= 5 && ui.createPassword.value === ui.repeatPassword.value){
    data.passwordValidation = "ok";
    nextButtonState("profileCreation");
  } else{
    data.passwordValidation = "nok";
    nextButtonState("profileCreation");
  }
  //Highlighlights the pass-repeat field if the passwords do not match
  if(ui.repeatPassword.value === ui.createPassword.value){
    ui.repeatPassword.classList.remove('doesNotMatch');
  } else{
    ui.repeatPassword.classList.add('doesNotMatch');
  }
})

//Profile creation - password repeat
ui.repeatPassword.addEventListener('keyup', ()=>{
  if(ui.repeatPassword.value.length >= 5 && ui.repeatPassword.value === ui.createPassword.value){
    data.passwordValidation = "ok";
    nextButtonState("profileCreation");
  } else{
    data.passwordValidation = "nok";
    nextButtonState("profileCreation");
  }
  //Highlighlights the pass-repeat field if the passwords do not match
  if(ui.repeatPassword.value === ui.createPassword.value){
    ui.repeatPassword.classList.remove('doesNotMatch');
  } else{
    ui.repeatPassword.classList.add('doesNotMatch');
  }
})

//Evaluate conditions and set the state of the next button
function nextButtonState(validatingAction){
  //Profile creation validation
  if(validatingAction === "profileCreation"){
    if(data.nameRegistered === true){
    ui.name.classList.add('alreadyRegistered');
    ui.loginBtn.classList.add('highlight');
    ui.loginBtn.innerText = "Already registered! Login here!";
    } else if (data.nameRegistered === false){
      ui.name.classList.remove('alreadyRegistered');
      ui.loginBtn.classList.remove('highlight');
      ui.loginBtn.innerText = "Already registered?";
    }

    if(data.nameValidation === "ok" && data.passwordValidation === "ok"){
      ui.nextBtn.classList.add('active');
      ui.nextBtn.disabled = false;
  
    } else{
      ui.nextBtn.classList.remove('active');
      ui.nextBtn.disabled = true;
    }
  }
  //Profile gender selection
  if(validatingAction === "genderSelection"){
    ui.nextBtn.classList.add('active');
    ui.nextBtn.disabled = false;
  }

  //DOB selection
  if(validatingAction === "dobSelection"){
    if(data.dobValidation === "ok"){
      ui.nextBtn.classList.add('active');
      ui.nextBtn.disabled = false;
    }
    else{
      ui.nextBtn.classList.remove('active');
      ui.nextBtn.disabled = true;
    }
  }

  //Login to an existing profile
  if(validatingAction === "existingProfileLogin"){
    if(ui.loginName.value.length > 0 && ui.loginPassword.value.length >=5){
      ui.nextBtn.classList.add('active');
      ui.nextBtn.disabled = false;
      console.log('ok');
    } else{
      console.log('nok');
      ui.nextBtn.classList.remove('active');
      ui.nextBtn.disabled = true;
    }
  }
}

//Gender selection
Array.from(document.querySelectorAll('.radioOption')).forEach(radioOption =>{
  radioOption.addEventListener('click', (e)=>{
    nextButtonState("genderSelection");
  })
});

//DOB selection - Upon any date selection change make sure the date is valid
ui.days.addEventListener('change', (e)=>{
  e.preventDefault();
  validateDobEntry();
  nextButtonState("dobSelection");
});

ui.months.addEventListener('change', (e)=>{
  e.preventDefault();
  validateDobEntry();
  nextButtonState("dobSelection");
});

ui.years.addEventListener('change', (e)=>{
  e.preventDefault();
  validateDobEntry();
  nextButtonState("dobSelection");
});

function validateDobEntry(){
  let monthLengths={"1":31, "2":29, "3":31, "4":30, "5":31, "6": 30, "7":31, "8": 31, "9":30, "10": 31, "11":30, "12":31 };
  //Make sure the date is not in the future

  //Make sure the leap year works correctly
  if(parseInt(ui.years.value)%4!==0 && parseInt(ui.months.value) === 2 && parseInt(ui.days.value) >= 29 ){{
    ui.dateErrorMessage.style.visibility = "visible";
    data.dobValidation = "nok";
    return;
  }};
  //Make sure months and corresponding day number within them is correct
  if(ui.days.value > monthLengths[ui.months.value]){
    ui.dateErrorMessage.style.visibility = "visible";
    data.dobValidation = "nok";
  }
  //If everything above is ok, confirm the DOB selection
  else{
    ui.dateErrorMessage.style.visibility = "hidden";
    data.dobValidation = "ok";
  }
  

}

//Manage navigation by using the "Next" button
ui.nextBtn.addEventListener('click', (e)=>{
  //e.preventDefault();
  //The "Next" button was clicked at the: Name and password creation
  if(data.currentQuestion === 1){
    //Prevent an attempt to create an admin account
    if(ui.name.value === "admin"){
      ui.name.value = "";
      return;
    } else{
      data[ui.name.value] = {profileName: ui.name.value};
      data.nameValue = ui.name.value;
      data[data.nameValue].password = ui.createPassword.value;
      ui.questionProfileCreation.style.display = 'none';
      ui.questionGender.style.display = 'flex';
      ui.questionDob.style.display = 'none';
      ui.questionCountry.style.display = 'none';
      ui.profileListContainer.style.visibility = 'hidden';
      ui.nextBtn.classList.remove('active');
      ui.nextBtn.disabled = true;
      ui.loginBtn.style.display = "none";
      data.currentQuestion = 2;
    }
  }
  //The "Next" button was clicked at the: Gender selection
  else if(data.currentQuestion === 2){
    data[data.nameValue].gender = document.querySelector('input[name="gender"]:checked').value;
    ui.questionProfileCreation.style.display = 'none';
    ui.questionGender.style.display = 'none';
    ui.questionDob.style.display = 'flex';
    ui.questionCountry.style.display = 'none';
    ui.dateErrorMessage.style.visibility = "hidden";
    data.currentQuestion = 3;
  }
  //The "Next" button was clicked at the: DOB selection
  else if(data.currentQuestion === 3){
    let dob = new Date(ui.years.value, ui.months.value-1, ui.days.value);
    data[data.nameValue].dob = dob;
    ui.questionProfileCreation.style.display = 'none';
    ui.questionGender.style.display = 'none';
    ui.questionDob.style.display = 'none';
    ui.questionCountry.style.display = 'flex';
    data.currentQuestion = 4;
    showData();
  }
  //The "Next" button was clicked at the: Country selection
  else if(data.currentQuestion === 4){
    data[data.nameValue].country = ui.countryselect.value;
    localStorage.setItem(data.nameValue, JSON.stringify(data[data.nameValue]));
    localStorage.setItem('currentProfile', data.nameValue);
    updateExistingProfilesListInStorage('create', data.nameValue);
    window.open("main.html", "_self");
  }
  //The "Next" button was clicked at the: Login with an existing profile
  else if(data.currentQuestion === "login"){
    //Admin user:
    if(ui.loginName.value === "admin" && ui.loginPassword.value === "winettou"){
      //Hide the questions part
      ui.questionsContainer.style.display = "none";
      //Show the list
      ui.profileListContainer.style.visibility = 'visible';
      return;
    }

    let userDataInLs = localStorage.getItem(ui.loginName.value);
    //A regular login: The user exists
    if(userDataInLs !== null){
      let profilePassword = JSON.parse(localStorage.getItem(ui.loginName.value)).password;
      //The login credentials are correct
      if(ui.loginPassword.value === profilePassword){
        localStorage.setItem('currentProfile', ui.loginName.value);
        window.open("main.html", "_self");
      } else{
        //The login credentials are incorrect
        ui.loginPassword.classList.add('incorrect');
        setTimeout(function(){
          ui.loginPassword.classList.remove('incorrect');
        }, 1000);
      }
    } else{
      //A regular login: The user does not exists
      ui.loginName.classList.add('incorrect');
      ui.loginPassword.classList.add('incorrect');
      setTimeout(function(){
        ui.loginName.classList.remove('incorrect');
        ui.loginPassword.classList.remove('incorrect');
      }, 1000);
    }
  }
})

//Go to the screen: Login to an existing profile
ui.loginBtn.addEventListener('click', ()=>{
  ui.questionProfileCreation.style.display = 'none';
  ui.nextBtn.classList.remove('active');
  ui.nextBtn.disabled = true;
  ui.loginBtn.style.display = "none";
  ui.loginName.value = "";
  ui.loginPassword.value = "";

  if(data.nameRegistered === true){
    ui.loginName.value = ui.name.value;
    ui.loginPassword.value = "";
  } else{
    ui.loginName.value = "";
  }

  data.currentQuestion = "login";
  ui.backToCreationBtn.style.display = 'flex';
  ui.profileLogin.style.display = 'flex';
})

//Submit credentials to login to an existing profile
ui.loginName.addEventListener('keyup', ()=>{
  nextButtonState('existingProfileLogin');
});

ui.loginPassword.addEventListener('keyup', ()=>{
  nextButtonState('existingProfileLogin');
});

//Go to the screen: Profile creation
ui.backToCreationBtn.addEventListener('click', ()=>{
  initiateUIState();
  ui.backToCreationBtn.style.display = 'none';
  ui.profileLogin.style.display = 'none';
});

//Profile list: Close the list and return to the profile creation
ui.profileListHidenBtn.addEventListener('click', ()=>{
  //Show the questions part
  ui.questionsContainer.style.display = "flex";
  ui.loginName.value = "";
  ui.loginPassword.value = "";
  ui.nextBtn.classList = "questions-btn";
  //Hide the list
  ui.profileListContainer.style.visibility = 'hidden';
});


//MANAGING THE DATA==========================
//Get list of profiles from local storage
function getExistingProfilesListFromStorage(){
  let existingProfiles = JSON.parse(localStorage.getItem('existingProfilesList'));
  if (existingProfiles === null){
    return [];
  } else{
    return existingProfiles;
  }
}

//Update current profile data in local storage
function updateExistingProfilesListInStorage(action, profileName){
  let retrievedProfileData = getExistingProfilesListFromStorage();
  if(action === 'create'){
    let alreadyExists = retrievedProfileData.indexOf(profileName);
    alreadyExists !== -1 ? console.log('already exists') : retrievedProfileData.push(profileName); 
  } else if(action === 'delete'){
    let position = retrievedProfileData.indexOf(profileName);
    retrievedProfileData.splice(position, 1);
  }
  localStorage.setItem('existingProfilesList', JSON.stringify(retrievedProfileData));
  return getExistingProfilesListFromStorage();
}

//Get the countries and related life expectancy data
async function getData() {
  const res = await fetch(
    '../data/life-expectancy.json'
  );
  const data = await res.json();
  return data;
};

//App Initialisation==========================
(function(){
  listExistingProfiles();
  initiateUIState();
})();
