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
function createDays(expiration, dob){
  let numberOfDays = (dob-expiration)/1000/3600/24/365;
  for(let i=0; i < numberOfDays; i++){

    //data.days.push(new Day({year: , month: , day: }));
  }
}
