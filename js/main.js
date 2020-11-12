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
function createDaysDataObjects(expiration, dob){
  data.days.push(new Date(dob));
  let numberOfDays = (expiration-dob)/1000/3600/24;
  let nextDate = dob;
  for(let i = 1; i < numberOfDays; i++){
    nextDate.setDate(nextDate.getDate() + 1);
    data.days.push(new Date(nextDate));
  }
};

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

    //Appened the day to DOM
    domDay.id = `${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}`;
    domDay.classList.add('day');
    document.getElementById('mainVisualization').appendChild(domDay);

    //Attach data attributes to the day
    domDay.setAttribute("data-year", day.getFullYear());
    domDay.setAttribute("data-month", day.getMonth()+1);
    domDay.setAttribute("data-day", day.getDate());
  })

  data.days = [];
}

(function appInit(){
  createDaysDataObjects(data.expiration, data.dob);
  visualizeDays(data.days);
})();
