//SELECTORS
const ui = {
  dayEntryModal: document.getElementById('dayEntryModal'),
  dayEntryDate: document.getElementById('dayEntryDate'),
  dayEntryForm: document.getElementById('dayEntryForm'),
  dayEntrySubmit: document.getElementById('dayEntrySubmit'),
  dayEntryDelete: document.getElementById('dayEntryDelete'),
  dayEntryModalClose: document.getElementById('dayEntryModalClose'),
  mainVisualization: document.getElementById('mainVisualization'),
  statsDob: document.getElementById('statsDOB'),
  statsExpectancy: document.getElementById('statsExpectancy'),
  statsExpirationDate: document.getElementById('statsExpirationDate'),
  progressDob: document.getElementById('progressElapsed'),
  progressExpiration: document.getElementById('progressRemaining'),
  progressElapsed: document.getElementById('progressElapsed'),
  progressRemaining: document.getElementById('progressRemaining'),
}



// DATA
const data = {
  answers: {
    dob: null,
    expiration: null,
    gender: 'other',
    expectancy: null,
  },
  days:[],
  today: new Date(),
}


// LOGICS
//Calculate the expiration date
//Get the countries and related life expectancy data
async function getData() {
  const res = await fetch(
    '../data/life-expectancy.json'
  );
  const fetchedData = await res.json();
  return fetchedData;
};
async function calcExpiration(){
  let fetchedData = await getData();
  let countryList = {};
  fetchedData.map(dataItem => {
    countryList[dataItem.country] = {};
    countryList[dataItem.country].rating = dataItem.rating;
    countryList[dataItem.country].man = dataItem.males;
    countryList[dataItem.country].woman = dataItem.females;
    countryList[dataItem.country].other = dataItem.both;
  });

  let newExp = new Date();
  newExp.setFullYear(data.answers.dob.getFullYear() + countryList[data.answers.country][data.answers.gender]);
  newExp.setMonth(data.answers.dob.getMonth());
  newExp.setDate(data.answers.dob.getDate());
  data.answers.expiration = newExp;
  data.answers.expectancy = countryList[data.answers.country][data.answers.gender];
}


//Set the DOB, gender and the expiration
function setData(){
  data.answers.dob = new Date(localStorage.getItem('dob'));
  data.answers.gender = localStorage.getItem('gender');
  data.answers.country = localStorage.getItem('country');
  calcExpiration();
  
};

function showStatsProgressNumbers(){
  ui.statsDob.innerText = `${data.answers.dob.getDate()}.${data.answers.dob.getMonth()+1}. ${data.answers.dob.getFullYear()}, `;
  ui.statsExpectancy.innerText = Math.round(data.answers.expectancy) + ", ";
  ui.statsExpirationDate.innerText = `${data.answers.expiration.getDate()}.${data.answers.expiration.getMonth()+1}. ${data.answers.expiration.getFullYear()}`;
  ui.progressDob.innerText = data.answers.dob.getFullYear();
  ui.progressExpiration.innerText = data.answers.expiration.getFullYear();

  let currentAge = data.today.getFullYear() - data.answers.dob.getFullYear();
  ui.progressElapsed.style.width = `${currentAge / Math.round(data.answers.expectancy)*100}%`;
  ui.progressRemaining.style.width = `${100 - (currentAge / Math.round(data.answers.expectancy))*100}%`;

}



//Create data objects for individual days
function createDaysDataObjects(expiration, dob){
  data.days.push(new Date(dob));
  let numberOfDays = (expiration-dob)/1000/3600/24;
  let nextDate = dob;
  for(let i = 1; i < numberOfDays; i++){
    nextDate.setDate(nextDate.getDate() + 1);
    data.days.push(new Date(nextDate));
  }
};

//Visualize all individual days
function visualizeDays(days){
  // Append first year label
  let yearLabel = document.createElement("div");
  yearLabel.innerText = days[0].getFullYear();
  yearLabel.classList.add('yearLabel');
  ui.mainVisualization.appendChild(yearLabel);

  //Add all days of life
  days.forEach(day => {
    //Create a day DOM element
    let domDay = document.createElement("div");

    //If this is the first day of the year add a year label before it
    if (day.getMonth() === 0 && day.getDate() === 1){
      let yearLabel = document.createElement("div");
      yearLabel.innerText = day.getFullYear();
      yearLabel.classList.add('yearLabel');
      ui.mainVisualization.appendChild(yearLabel);
    }

    //If this is the first day of a month add a month label before it
    if (day.getDate() === 1){
      let monthLabel = document.createElement("div");
      monthLabel.innerText = day.getMonth()+1;
      //monthLabel.classList.add('day');
      monthLabel.classList.add('monthLabel');
      ui.mainVisualization.appendChild(monthLabel);
    }

    //Appened the day to DOM
    domDay.id = `${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}`;
    domDay.classList.add('day');
    ui.mainVisualization.appendChild(domDay);
    domDay.innerText = day.getDate();

    //Attach data attributes to the day
    domDay.setAttribute("data-year", day.getFullYear());
    domDay.setAttribute("data-month", day.getMonth()+1);
    domDay.setAttribute("data-day", day.getDate());

  })

  //Get rid of the day-data because it is not needed any longer
  data.days = [];
}

//Highlight today
function highlightToday(){
  let today = new Date();
  if(today > data.answers.expiration){
    console.log('the person is already dead');
  } else{
    today = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
    let domPositionOfToday = document.getElementById(today).offsetTop;
    window.scrollTo(0, domPositionOfToday - window.innerHeight/2);
    document.getElementById(today).classList.add('today');
  }
}

//Mark all days that have an entry


//Displaying of day-entry modal
function displayModal(input){
  ui.dayEntryModal.classList.add('visible');
  ui.dayEntryModal.setAttribute("data-day",input.clickedDayId);
  ui.dayEntryDate.innerText = `${input.day}. ${input.month}. ${input.year}`;
  ui.dayEntryForm.value = getDayEntryFromLocalStorage (input.clickedDayId);

}

//Closing day-entry modal
function hideModal(){
 ui.dayEntryModal.classList.remove('visible');
}

//Saving day-entry to local storage
function saveDayEntryToLocalStorage (dayId, content) {
  localStorage.setItem(
    dayId,
     JSON.stringify({message:content})
  );
  if(content !== ""){
    document.getElementById(dayId).classList.add('hasEntry');
  } else{
    document.getElementById(dayId).classList.remove('hasEntry');
  }
}

//Getting day-entry from local storage
function getDayEntryFromLocalStorage (dayId) {
  let content = JSON.parse(localStorage.getItem(dayId));
  if (content === null) {
    return "";
  } else {
    return content.message;
  }
}

//Deleting day-entry from local storage
function deleteDayEntryFromLocalStorage(dayId){
  localStorage.removeItem(dayId);
  document.getElementById(dayId).classList.remove('hasEntry');
}

//EVENTS
//Click: Open day-entry modal
function attachActionToDays(){
  Array.from(document.querySelectorAll('.day')).forEach(item=>{
    item.addEventListener('click',()=>{
    let clickedDayId = `${item.getAttribute('data-year')}-${item.getAttribute('data-month')}-${item.getAttribute('data-day')}`;
    displayModal({clickedDayId:clickedDayId, year:item.getAttribute('data-year'), month: item.getAttribute('data-month'), day: item.getAttribute('data-day')});
    })
  });
}

//Click: Close day-entry modal
ui.dayEntryModalClose.addEventListener('click',(e)=>{
  hideModal();
});

//Click: Save day-entry text and close the modal
ui.dayEntrySubmit.addEventListener('click', (e)=>{
  e.preventDefault();
  let dayId = ui.dayEntryModal.getAttribute('data-day');
  let content = ui.dayEntryForm.value;
  saveDayEntryToLocalStorage(dayId, content);
  hideModal();
});

//Click: Delete day-entry modal
ui.dayEntryDelete.addEventListener('click',(e)=>{
  e.preventDefault();
  let dayId = ui.dayEntryModal.getAttribute('data-day');
  deleteDayEntryFromLocalStorage(dayId);
  hideModal();
});

//Click: Save questionaire answer

//Init the app
(function appInit(){
  // setData();
  // showStatsProgressNumbers();
  // createDaysDataObjects(data.answers.expiration, data.answers.dob);
  // visualizeDays(data.days);
  // highlightToday();
  // attachActionToDays();
})();
