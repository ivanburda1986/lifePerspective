//SELECTORS==========================
const ui = {
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

//Make sure there are no pre-filled answers
window.addEventListener('load', ()=>{
  Array.from(document.querySelectorAll('.radioOption')).forEach(radioOption =>{
    radioOption.checked = false;
    console.log('cleared');
  });
})


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