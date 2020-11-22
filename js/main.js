//SELECTORS==========================
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
  changeAnswers: document.getElementById('changeAnswers'),
}
// DATA==============================
const data = {
  answers: {
    dob: null,
    gender: null,
    country: null,
  },
  countryList: {},
  expectancy: null,
  expiration: null,
  today: new Date(),
}


//DATA LOGICS=============================
//Get JSON with life expectancy data
async function getExpectancyStats() {
  const res = await fetch(
    '../data/life-expectancy.json'
  );
  const expectancyStats = await res.json();
  return expectancyStats;
};

async function processExpectancyStats(){
  let expectancyStats = await getExpectancyStats();
  expectancyStats.map(dataItem => {
    data.countryList[dataItem.country] = {};
    data.countryList[dataItem.country].rating = dataItem.rating;
    data.countryList[dataItem.country].man = dataItem.males;
    data.countryList[dataItem.country].woman = dataItem.females;
    data.countryList[dataItem.country].other = dataItem.both;
  });
  getLifeExpectancyAndExiration();
  showStatsProgressNumbers();
  visualizeDays();
  highlightToday();
  highlightAllDaysWithEntry();
  attachActionToDays();
};

//Get answers from the questionnaire
function getAnswers(){
  data.answers.dob = new Date(localStorage.getItem('dob'));
  data.answers.gender = localStorage.getItem('gender');
  data.answers.country = localStorage.getItem('country');
};

//Calculate user's life expiration
function getLifeExpectancyAndExiration(){
  let expiration = new Date();
  expiration.setFullYear(data.answers.dob.getFullYear() + data.countryList[data.answers.country][data.answers.gender]);
  expiration.setMonth(data.answers.dob.getMonth());
  expiration.setDate(data.answers.dob.getDate());
  data.expiration = expiration;
  data.expectancy = data.countryList[data.answers.country][data.answers.gender];
}

//Saving day-entry to local storage
function saveDayEntryToLocalStorage (dayId, content) {
  let currentStorageEntries = JSON.parse(localStorage.getItem('entries'));
  currentStorageEntries[dayId] = {message:content};
  localStorage.setItem(
    "entries",
    JSON.stringify(currentStorageEntries)
  );

  //Make the day marked as having an entry
  if(content !== ""){
    document.getElementById(dayId).classList.add('hasEntry');
  } else{
    document.getElementById(dayId).classList.remove('hasEntry');
  }
}

//Getting day-entry from local storage
function getDayEntryFromLocalStorage (dayId) {
  let currentStorageEntries = JSON.parse(localStorage.getItem('entries'));
  if (currentStorageEntries === null) {
    return "";
  } else {
    let content = currentStorageEntries[dayId];
    if (content === undefined) {
      return "";
    } else {
      return content.message;
    }
  }
}

//Deleting day-entry from local storage
function deleteDayEntryFromLocalStorage(dayId){
  let currentStorageEntries = JSON.parse(localStorage.getItem('entries'));
  delete currentStorageEntries[dayId];
  localStorage.setItem(
    "entries",
    JSON.stringify(currentStorageEntries)
  );
  document.getElementById(dayId).classList.remove('hasEntry');
}




//DISPLAYING=============================
//Display user's stats (birth, expected life lenght, expect termination year) and the life progress bar
function showStatsProgressNumbers(){
  ui.statsDob.innerText = `${data.answers.dob.getDate()}.${data.answers.dob.getMonth()+1}. ${data.answers.dob.getFullYear()}, `;
  ui.statsExpectancy.innerText = Math.round(data.expectancy) + ", ";
  ui.statsExpirationDate.innerText = `${data.expiration.getDate()}.${data.expiration.getMonth()+1}. ${data.expiration.getFullYear()}`;
  
  ui.progressDob.innerText = data.answers.dob.getFullYear();
  ui.progressExpiration.innerText = data.expiration.getFullYear();
  let currentAge = data.today.getFullYear() - data.answers.dob.getFullYear();
  ui.progressElapsed.style.width = `${currentAge / Math.round(data.expectancy)*100}%`;
  ui.progressRemaining.style.width = `${100 - (currentAge / Math.round(data.expectancy))*100}%`;
}

//Visualize all individual days
function visualizeDays(){
  //Get an array with all days from the DOB until the life termination
  let days = [];
  days.push(new Date(data.answers.dob));
  let numberOfDays = (data.expiration - data.answers.dob)/1000/3600/24;
  let nextDate = data.answers.dob;
  for(let i = 1; i < numberOfDays; i++){
    nextDate.setDate(nextDate.getDate() + 1);
    days.push(new Date(nextDate));
  };

  //Append a label to the first year
  if(data.answers.dob.getMonth() === 1 && data.answers.dob.getDate()===1){
    let yearLabel = document.createElement("div");
    yearLabel.innerText = days[0].getFullYear();
    yearLabel.classList.add('yearLabel');
    ui.mainVisualization.appendChild(yearLabel);
  }

  //Append all days of the user's life
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
      monthLabel.classList.add('monthLabel');
      ui.mainVisualization.appendChild(monthLabel);
    }

    //Appened the day to DOM and give it a unique ID
    domDay.id = `${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}`;
    domDay.classList.add('day');
    ui.mainVisualization.appendChild(domDay);
    domDay.innerText = day.getDate();

    //Attach data attributes to the day
    domDay.setAttribute("data-year", day.getFullYear());
    domDay.setAttribute("data-month", day.getMonth()+1);
    domDay.setAttribute("data-day", day.getDate());

  })
}

//Highlight today
function highlightToday(){
  let today = new Date();
  if(today > data.expiration){
    console.log('the person is already dead');
  } else{
    today = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
    let domPositionOfToday = document.getElementById(today).offsetTop;
    window.scrollTo(0, domPositionOfToday - window.innerHeight/2);
    document.getElementById(today).classList.add('today');
  }
}

//Mark upon app load all days that have an entry attached to them
function highlightAllDaysWithEntry(){
  let currentStorageEntries = JSON.parse(localStorage.getItem('entries'));
  if (currentStorageEntries !== null) {
    let daysWithEntry = Object.keys(currentStorageEntries);
    daysWithEntry.forEach(day => {
      document.getElementById(day).classList.add('hasEntry');
    })
  }
}

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



//EVENT TRIGGERS=============================
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

//On load the disable the submit button if there is no content


//Click: Delete day-entry modal
ui.dayEntryDelete.addEventListener('click',(e)=>{
  e.preventDefault();
  let dayId = ui.dayEntryModal.getAttribute('data-day');
  deleteDayEntryFromLocalStorage(dayId);
  hideModal();
});

//Click: Go back to the answers
ui.changeAnswers.addEventListener('click', (e)=>{
  window.open('index.html', "_self");
});


//Init the app
(function appInit(){
  getExpectancyStats();
  processExpectancyStats();
  getAnswers();
})();
