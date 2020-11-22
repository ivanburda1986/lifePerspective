//SELECTORS==========================
const ui = {
  nextBtn: document.getElementById('nextBtn'),
  questionCountry: document.getElementById('question-country'),
  questionGender: document.getElementById('question-gender'),
  questionDob: document.getElementById('question-dob'),
  countryselect: document.getElementById('countryselect'),
  year: document.getElementById('year'),
  month: document.getElementById('month'),
  day: document.getElementById('day'),
};

//DATA==========================
const data = {
  currentQuestion: 1
}


//MANAGING THE UI

//Make the 'Next' button invisible by default
ui.nextBtn.style.visibility = 'hidden';
ui.questionCountry.style.display = 'none';
ui.questionDob.style.display = 'none';

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

document.addEventListener('keyup', ()=>{
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
    localStorage.setItem('gender', document.querySelector('input[name="gender"]:checked').value);
    ui.questionGender.style.display = 'none';
    ui.questionDob.style.display = 'flex';
    ui.nextBtn.style.visibility = 'hidden';
    data.currentQuestion = 2;
  }
  else if(data.currentQuestion === 2){
    let dob = new Date(ui.year.value, ui.month.value-1, ui.day.value);
    localStorage.setItem('dob', dob);
    ui.questionDob.style.display = 'none';
    ui.questionCountry.style.display = 'flex';
    data.currentQuestion = 3;
    showData();
  }
  else if(data.currentQuestion === 3){
    localStorage.setItem('country', ui.countryselect.value);
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