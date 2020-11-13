// DATA
const data = {
  dob: new Date(1986,0,31),
  expiration: new Date(2066,1,1),
  days:[]

}

// OBJECTS
function Day(){

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
  document.getElementById('mainVisualization').appendChild(yearLabel);

  //Add all days of life
  days.forEach(day => {
    //Create a day DOM element
    let domDay = document.createElement("div");

    //If this is the first day of the year add the year label before it
    if (day.getMonth() === 0 && day.getDate() === 1){
      let yearLabel = document.createElement("div");
      yearLabel.innerText = day.getFullYear();
      yearLabel.classList.add('yearLabel');
      document.getElementById('mainVisualization').appendChild(yearLabel);
    }

    if (day.getDate() === 1){
      let monthLabel = document.createElement("div");
      monthLabel.innerText = day.getMonth()+1;
      monthLabel.classList.add('day');
      monthLabel.classList.add('monthLabel');
      document.getElementById('mainVisualization').appendChild(monthLabel);
    }

    //Appened the day to DOM
    domDay.id = `${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}`;
    domDay.classList.add('day');
    document.getElementById('mainVisualization').appendChild(domDay);
    domDay.innerText = day.getDate();

    //Attach data attributes to the day
    domDay.setAttribute("data-year", day.getFullYear());
    domDay.setAttribute("data-month", day.getMonth()+1);
    domDay.setAttribute("data-day", day.getDate());

    
  })

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

//Open the modal to crud a day entry
function displayModal(input){
  document.getElementById('dayEntryModal').classList.add('visible');
  document.getElementById('dayEntryModal').setAttribute("data-day",input.clickedDayId);
  document.getElementById('entry-date').innerText = `${input.day}. ${input.month}. ${input.year}`;

}

function hideModal(){
  document.getElementById('dayEntryModal').classList.remove('visible');
}




//EVENTS
//Add a day entry - open modal
function attachActionToDays(){
  Array.from(document.querySelectorAll('.day')).forEach(item=>{
    item.addEventListener('click',()=>{
    let clickedDayId = `${item.getAttribute('data-year')}-${item.getAttribute('data-month')}-${item.getAttribute('data-day')}`;
    displayModal({clickedDayId:clickedDayId, year:item.getAttribute('data-year'), month: item.getAttribute('data-month'), day: item.getAttribute('data-day')});
    })
  });
}



//Close the modal
document.getElementById('dayEntryModal-close').addEventListener('click',(e)=>{
  hideModal();
});




//Init the app
(function appInit(){
  createDaysDataObjects(data.expiration, data.dob);
  visualizeDays(data.days);
  highlightToday();
  attachActionToDays();
})();
