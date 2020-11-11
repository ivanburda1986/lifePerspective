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
  let numberOfDays = (expiration-dob)/1000/3600/24;
  let nextDate = dob;
  for(let i = 1; i < numberOfDays; i++){
    nextDate.setDate(nextDate.getDate() + 1);
    data.days.push(new Date(nextDate));
  }
};

function visualizeDays(days){
  days.forEach(day => {
    let domDay = document.createElement("div");
    domDay.classList.add('day');
    domDay.id = `${day.getYear()}-${day.getMonth()}-${day.getDate()}`;
    document.getElementById('mainVisualization').appendChild(domDay);
  })
}
