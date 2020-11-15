//SELECTORS
const ui = {
  dayEntryModal: document.getElementById('dayEntryModal'),
  dayEntryDate: document.getElementById('dayEntryDate'),
  dayEntryForm: document.getElementById('dayEntryForm'),
  dayEntrySubmit: document.getElementById('dayEntrySubmit'),
  dayEntryDelete: document.getElementById('dayEntryDelete'),
  dayEntryModalClose: document.getElementById('dayEntryModalClose'),
  mainVisualization: document.getElementById('mainVisualization'),
}

// DATA
const data = {
  dob: new Date(1986,0,31),
  expiration: new Date(2066,1,1),
  days:[],
}


// LOGICS
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
  //Append first year label
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
  today = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
  let domPositionOfToday = document.getElementById(today).offsetTop;
  window.scrollTo(0, domPositionOfToday - window.innerHeight/2);
  document.getElementById(today).classList.add('today');
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


//Init the app
(function appInit(){
  createDaysDataObjects(data.expiration, data.dob);
  visualizeDays(data.days);
  highlightToday();
  attachActionToDays();
})();
