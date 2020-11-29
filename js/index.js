//SELECTORS==========================
const ui = {
  profileListContainer: document.getElementById('profileListContainer'),
  profileList: document.querySelector('.profileList'),
  nextBtn: document.getElementById('nextBtn'),
  questionProfileName: document.getElementById('question-profileName'),
  questionGender: document.getElementById('question-gender'),
  questionDob: document.getElementById('question-dob'),
  questionCountry: document.getElementById('question-country'),
  countryselect: document.getElementById('countryselect'),
  name: document.getElementById('name'),
  year: document.getElementById('year'),
  month: document.getElementById('month'),
  day: document.getElementById('day'),
};

//DATA==========================
const data = {
  currentQuestion: 1,
  nameValue: null,
}


//MANAGING THE UI
//Upon load
ui.nextBtn.style.visibility = 'visible';
ui.questionProfileName.style.display = 'visible';
ui.questionGender.style.display = 'none';
ui.questionDob.style.display = 'none';
ui.questionCountry.style.display = 'none';
ui.nextBtn.style.visibility = 'hidden';
ui.profileListContainer.style.visibility = 'visible';

//Make sure there are no pre-filled answers
window.addEventListener('load', ()=>{
  Array.from(document.querySelectorAll('.radioOption')).forEach(radioOption =>{
    radioOption.checked = false;
    console.log('cleared');
  });
})

//Populate the list of available profiles
function listExistingProfiles(){
  ui.profileList.innerHTML = "";
  let profiles = getExistingProfilesListFromStorage();
  if(profiles.length === 0){
    console.log('There are no profiles yet');
    let profileListItem = document.createElement("li");
      profileListItem.classList.add('profileListItem');
      profileListItem.classList.add('py-1');
      profileListItem.innerHTML = `<p>There are no profiles yet.</p>`;
      ui.profileList.appendChild(profileListItem);
  } else{
    profiles.forEach(profile => {
      let profileListItem = document.createElement("li");
      profileListItem.id = profile;
      profileListItem.classList.add('profileListItem');
      profileListItem.classList.add('py-1');
      profileListItem.innerHTML = `<p>${profile}</p>`;
      ui.profileList.appendChild(profileListItem);
  
      profileListItem.addEventListener('click', (e)=>{
        if(e.target.classList.contains('profileListItem')){
          localStorage.setItem('currentProfile', profile);
          window.open("main.html", "_self");
        }
      })
  
      let deleteButton = document.createElement("button");
      deleteButton.innerText = 'x';
      profileListItem.appendChild(deleteButton);
      deleteButton.addEventListener('click',(e)=>{
        e.preventDefault();
        e.target.parentNode.remove();
        updateExistingProfilesListInStorage('delete', profile);
        localStorage.removeItem(profile);
      })
    })
  }
}



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



//EVENT LISTENERS==========================
//Display the next button
Array.from(document.querySelectorAll('.radioOption')).forEach(radioOption =>{
  radioOption.addEventListener('click', (e)=>{
    ui.nextBtn.style.visibility = 'visible';
  })
});

document.getElementById('question-profileName').addEventListener('keyup', ()=>{
  if(ui.name.value.length !== 0){
    ui.nextBtn.style.visibility = 'visible';
  } else{
    ui.nextBtn.style.visibility = 'hidden';
  }
})

document.getElementById('question-dob').addEventListener('keyup', ()=>{
  if(ui.day.value !== null && ui.month.value !== null && ui.year.value.length === 4){
    ui.nextBtn.style.visibility = 'visible';
  } else{
    ui.nextBtn.style.visibility = 'hidden';
  }
})



//Save the value
ui.nextBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  if(data.currentQuestion === 1){
    data[ui.name.value] = {profileName: ui.name.value};
    data.nameValue = ui.name.value;
    ui.questionProfileName.style.display = 'none';
    ui.questionGender.style.display = 'flex';
    ui.questionDob.style.display = 'none';
    ui.questionCountry.style.display = 'none';
    ui.nextBtn.style.visibility = 'hidden';
    ui.profileListContainer.style.visibility = 'hidden';
    data.currentQuestion = 2;
  }
  else if(data.currentQuestion === 2){
    data[data.nameValue].gender = document.querySelector('input[name="gender"]:checked').value;
    ui.questionProfileName.style.display = 'none';
    ui.questionGender.style.display = 'none';
    ui.questionDob.style.display = 'flex';
    ui.questionCountry.style.display = 'none';
    ui.nextBtn.style.visibility = 'hidden';
    data.currentQuestion = 3;
  }
  else if(data.currentQuestion === 3){
    let dob = new Date(ui.year.value, ui.month.value-1, ui.day.value);
    data[data.nameValue].dob = dob;
    ui.questionProfileName.style.display = 'none';
    ui.questionGender.style.display = 'none';
    ui.questionDob.style.display = 'none';
    ui.questionCountry.style.display = 'flex';
    ui.nextBtn.style.visibility = 'flex';
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

//Get the countries and related life expectancy data
async function getData() {
  const res = await fetch(
    '../data/life-expectancy.json'
  );
  const data = await res.json();
  return data;
};


//Create the selection of countries
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
};

//App init
listExistingProfiles();