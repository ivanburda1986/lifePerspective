//SELECTORS==========================
const ui = {
  questionProfileName: document.getElementById('question-profileName'),
  questionGender: document.getElementById('question-gender'),
  questionDob: document.getElementById('question-dob'),
  countryselect: document.getElementById('countryselect'),
  name: document.getElementById('createName'),
  years: document.getElementById('years'),
  months: document.getElementById('months'),
  days: document.getElementById('days'),
  dateErrorMessage: document.getElementById('dateErrorMessage'),
  questionCountry: document.getElementById('question-country'),
  nextBtn: document.getElementById('nextBtn'),
  profileListContainer: document.getElementById('profileListContainer'),
  profileList: document.querySelector('.profileList'),
};

//DATA==========================
const data = {
  currentQuestion: 1,
  nameValue: null,
  today: new Date(),
}


//MANAGING THE UI
//Upon load
function initiateUIState(){
  //Make sure only the first question is displayed
  ui.questionProfileName.style.display = 'visible';
  ui.questionGender.style.display = 'none';
  ui.questionDob.style.display = 'none';
  ui.questionCountry.style.display = 'none';
  ui.profileListContainer.style.visibility = 'hidden';

  //Make sure that no value is selected for the radio selection of gender
  Array.from(document.querySelectorAll('.radioOption')).forEach(radioOption =>{
    radioOption.checked = false;
    console.log('cleared');
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
  }());
}


//Display the list of available profiles
function listExistingProfiles(){
  ui.profileList.innerHTML = "";
  let profiles = getExistingProfilesListFromStorage();
  if(profiles.length === 0){
    ui.profileListContainer.style.display = "none";
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


//EVENT LISTENERS==========================
//Display the next button
Array.from(document.querySelectorAll('.radioOption')).forEach(radioOption =>{
  radioOption.addEventListener('click', (e)=>{

  })
});

document.getElementById('question-profileName').addEventListener('keyup', ()=>{
  if(ui.name.value.length !== 0){

  } else{

  }
})

document.getElementById('question-dob').addEventListener('keyup', ()=>{
  if(ui.day.value !== null && ui.month.value !== null && ui.year.value.length === 4){

  } else{

  }
})

//Manage questions navigation and save the answers
ui.nextBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  if(data.currentQuestion === 1){
    data[ui.name.value] = {profileName: ui.name.value};
    data.nameValue = ui.name.value;
    ui.questionProfileName.style.display = 'none';
    ui.questionGender.style.display = 'flex';
    ui.questionDob.style.display = 'none';
    ui.questionCountry.style.display = 'none';
    ui.profileListContainer.style.visibility = 'hidden';
    data.currentQuestion = 2;
  }
  else if(data.currentQuestion === 2){
    data[data.nameValue].gender = document.querySelector('input[name="gender"]:checked').value;
    ui.questionProfileName.style.display = 'none';
    ui.questionGender.style.display = 'none';
    ui.questionDob.style.display = 'flex';
    ui.questionCountry.style.display = 'none';
    data.currentQuestion = 3;
  }
  else if(data.currentQuestion === 3){
    let dob = new Date(ui.years.value, ui.months.value-1, ui.days.value);
    data[data.nameValue].dob = dob;
    ui.questionProfileName.style.display = 'none';
    ui.questionGender.style.display = 'none';
    ui.questionDob.style.display = 'none';
    ui.questionCountry.style.display = 'flex';
    data.currentQuestion = 4;
    showData();
  }
  else if(data.currentQuestion === 4){
    data[data.nameValue].country = ui.countryselect.value;
    localStorage.setItem(data.nameValue, JSON.stringify(data[data.nameValue]));
    localStorage.setItem('currentProfile', data.nameValue);
    updateExistingProfilesListInStorage('create', data.nameValue);
    window.open("main.html", "_self");
  }
})

//Upon any date selection change make sure the date is valid
ui.days.addEventListener('change', (e)=>{
  e.preventDefault();
  validateDobEntry();
})

ui.months.addEventListener('change', (e)=>{
  e.preventDefault();
  validateDobEntry();
})

ui.years.addEventListener('change', (e)=>{
  e.preventDefault();
  validateDobEntry();
})


//VALIDATIONS==========================
function validateDobEntry(){
  let monthLengths={"1":31, "2":29, "3":31, "4":30, "5":31, "6": 30, "7":31, "8": 31, "9":30, "10": 31, "11":30, "12":31 };
  //Check leap year february
  if(parseInt(ui.years.value)%4!==0 && parseInt(ui.months.value) === 2 && parseInt(ui.days.value) >= 29 ){{
    ui.dateErrorMessage.getElementsByTagName("p")[0].innerText = "Invalid date.";
    return;
  }};
  //Check months and corresponding selected day
  if(ui.days.value > monthLengths[ui.months.value]){
    ui.dateErrorMessage.getElementsByTagName("p")[0].innerText = "Invalid date.";
  }
  else{
    ui.dateErrorMessage.getElementsByTagName("p")[0].innerText = "";
  }
  
}

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
