//SELECTORS==========================
const ui = {
  dayEntryModal: document.getElementById('dayEntryModal'),
  dayEntryImage: document.querySelector('.dayEntryImage'),
  dayEntryImageBtn: document.querySelector('.dayEntryImageBtn'),
  imageUrlInsertForm: document.querySelector('.imageUrlInsertForm'),
  imageUrlInsertField: document.querySelector('.imageUrlInsertField'),
  imageUrlSaveBtn: document.querySelector('#imageUrlSaveBtn'),
  dayEntryDate: document.getElementById('dayEntryDate'),
  dayEntryForm: document.getElementById('dayEntryForm'),
  dayEntrySubmit: document.getElementById('dayEntrySubmit'),
  dayEntryDelete: document.getElementById('dayEntryDelete'),
  dayEntryModalClose: document.getElementById('dayEntryModalClose'),
  mainVisualization: document.getElementById('mainVisualization'),
  statsName: document.getElementById('statsName'),
  statsExpectancy: document.getElementById('statsExpectancy'),
  statsLifespan: document.getElementById('statsLifespan'),
  statsYearSelect: document.getElementById('statsYearSelect'),
  progressDob: document.getElementById('progressElapsedDob'),
  progressExpirationOutlivedView: document.getElementById('progressElapsedExpiration'),
  progressExpiration: document.getElementById('progressRemainingExpiration'),
  progressElapsed: document.getElementById('progressElapsed'),
  progressRemaining: document.getElementById('progressRemaining'),
  progressExtra: document.getElementById('progressExtra'),
  changeAnswers: document.getElementById('changeAnswers'),
  firstBirthday: null,
  lastExpectedDay: null,
  firstBirthdayId: null,
  lastExpectedDayId: null,
}
// DATA==============================
const data = {
  answers: {
    name: null,
    dob: new Date(),
    gender: null,
    country: null,
  },
  countryList: {},
  expectancy: null,
  expiration: new Date(),
  today: new Date(),
  outlivedExpectancy: null,
  currentProfile: localStorage.getItem('currentProfile'),
  setFirstBirthdayDefaultMessage: null,
  setLastExpectedDayDefaultMessage: null,
  setFirstBirthdayDefaultImage: null,
  setLastExpectedDayDefaultImage: null,
  openedModalId: null
}


//DATA LOGICS=============================
//Get answers from the questionnaire
function getAnswers(){
  data.answers.name = getCurrentProfileFromStorage().profileName;
  let dob = new Date(getCurrentProfileFromStorage().dob);
  data.answers.dob = dob;
  data.answers.gender = getCurrentProfileFromStorage().gender;
  data.answers.country = getCurrentProfileFromStorage().country;

  data.setFirstBirthdayDefaultImage = getCurrentProfileFromStorage().setFirstBirthdayDefaultImage;
  data.setLastExpectedDayDefaultImage = getCurrentProfileFromStorage().setLastExpectedDayDefaultImage;
  data.setFirstBirthdayDefaultMessage = getCurrentProfileFromStorage().setFirstBirthdayDefaultMessage;
  data.setLastExpectedDayDefaultMessage = getCurrentProfileFromStorage().setLastExpectedDayDefaultMessage;
};


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
  getLifeExpectancyAndExpiration();
  outlivedExpectancyCheck();
  showStatsProgressNumbers();
  populateYearSelector();
  visualizeWithinExpectactionDays();
  visualizeAboveExpectactionDays();
  highlightOutlivedExpectancy();
  highlightFirstBirthday();
  highlightOutlivedExpectancy();
  highlightToday();
  highlightAllDaysWithEntry();
  attachActionToDays();
};

//Get current profile data from local storage
function getCurrentProfileFromStorage(){
  return JSON.parse(localStorage.getItem(data.currentProfile));
}

//Update current profile data in local storage
function updateCurrentProfileInStorage(keyName, value){
  let retrievedProfileData = getCurrentProfileFromStorage();
  retrievedProfileData[keyName] = value;
  localStorage.setItem(data.currentProfile, JSON.stringify(retrievedProfileData));
  return getCurrentProfileFromStorage();
}



//Calculate user's life expiration
function getLifeExpectancyAndExpiration(){
  data.expiration.setFullYear(new Date(data.answers.dob).getFullYear() + data.countryList[data.answers.country][data.answers.gender]);
  data.expiration.setMonth(new Date(data.answers.dob).getMonth());
  data.expiration.setDate(new Date(data.answers.dob).getDate());
  data.expectancy = data.countryList[data.answers.country][data.answers.gender];
}

//Saving day-entry to local storage
function saveDayEntryToLocalStorage (dayId, attribute, content) {
  let currentStorageEntries = getCurrentProfileFromStorage().entries;
  if (currentStorageEntries === undefined) {
   currentStorageEntries = {};
  }
  if(currentStorageEntries[dayId] === undefined){
    currentStorageEntries[dayId] = {"message" : "","image" : "/images/imagePlaceholder.png"};
  }
  currentStorageEntries[dayId][attribute] = content;
  updateCurrentProfileInStorage(
    "entries",
    currentStorageEntries
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
  let currentStorageEntries = getCurrentProfileFromStorage().entries;
  if (currentStorageEntries === undefined) {
    return "";
  } else {
    let content = currentStorageEntries[dayId];
    if (content === undefined) {
      return "";
    } else {
      return content;
    }
  }
}

//Deleting day-entry from local storage
function deleteDayEntryFromLocalStorage(dayId){
  let currentStorageEntries = getCurrentProfileFromStorage().entries;
  delete currentStorageEntries[dayId];
  updateCurrentProfileInStorage(
    "entries",
    currentStorageEntries
  );
  document.getElementById(dayId).classList.remove('hasEntry');
}


//Saving day-entry image to local storage
function saveDayImageToLocalStorage (dayId, imageUrl) {
  let currentStorageEntries = getCurrentProfileFromStorage().entries;
  if (currentStorageEntries === undefined) {
   currentStorageEntries = {};
  }
  currentStorageEntries[dayId]["ivan"] = {image: imageUrl};
  updateCurrentProfileInStorage(
    "entries",
    currentStorageEntries
  );
}




//DISPLAYING=============================
//Display user's stats (birth, expected life lenght, expect termination year) and the life progress bar
function showStatsProgressNumbers(){
  //Stats under the progress bar
  ui.statsName.innerText = data.answers.name + ", ";
  ui.statsExpectancy.innerText = Math.round(data.expectancy) + ": ";
  ui.statsLifespan.innerText = `${new Date(data.answers.dob).getDate()}.${new Date(data.answers.dob).getMonth()+1}. ${new Date(data.answers.dob).getFullYear()} - ${data.expiration.getDate()}.${data.expiration.getMonth()+1}. ${data.expiration.getFullYear()}`;
  //The visual progress bar of life
  
  ui.progressDob.innerText = new Date(data.answers.dob).getFullYear();
  ui.progressExpiration.innerText = data.expiration.getFullYear();
  let currentAge = data.today.getFullYear() - new Date(data.answers.dob).getFullYear();

  //--Still within the expectancy
  if(currentAge <= data.expectancy){
    ui.progressExtra.style.display = "none";
    ui.progressElapsed.style.width = `${currentAge / Math.round(data.expectancy)*100}%`;
    ui.progressRemaining.style.width = `${100 - (currentAge / Math.round(data.expectancy))*100}%`;
  } 
  //--Already outlived the expectancy
  else if(currentAge > data.expectancy){
    ui.progressRemaining.style.display = "none";
    let aboveExpectancy = currentAge - data.expectancy;
    ui.progressElapsed.style.width = `${100 - (aboveExpectancy/data.expectancy * 100)}%`;
    ui.progressExtra.style.display = "block";
    ui.progressExtra.style.width = `${aboveExpectancy/data.expectancy * 100}%`;
    ui.progressExpirationOutlivedView.innerText = data.expiration.getFullYear();
  }
}

//Show a selector with all years of user's life 
function populateYearSelector(){
  let startingYear = new Date(data.answers.dob).getFullYear();
  let lastExpectedYear = new Date(data.expiration).getFullYear();
  let currentYear = new Date(data.today).getFullYear();
  let listUntilYear;
  let yearsList = '';
  data.outlivedExpectancy === true ? listUntilYear = currentYear : listUntilYear =lastExpectedYear;

  for(let i = startingYear; i <= listUntilYear; i++){
    yearsList += `
    <option value="${i}">${i}</option>
    `;
  };
  ui.statsYearSelect.innerHTML = yearsList;
}


//Visualize all individual days within the expectation
function visualizeWithinExpectactionDays(){
  let days = [];

  //Get an array with all days from the DOB until the life termination
  days.push(new Date(data.answers.dob));
  let numberOfDays = (data.expiration - data.answers.dob)/1000/3600/24;
  let nextDate = new Date(data.answers.dob);
  for(let i = 1; i < numberOfDays; i++){
    nextDate.setDate(nextDate.getDate() + 1);
    days.push(new Date(nextDate));
  };

  //Make sure a year label is appended o the first year, if the DOB is not on the 1.1. which would make it get the year label automatically
  if(new Date(data.answers.dob).getDate() !==1 ){
    let yearLabel = document.createElement("div");
    yearLabel.innerText = days[0].getFullYear();
    yearLabel.classList.add('yearLabel');
    yearLabel.id = days[0].getFullYear();
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
      yearLabel.id = day.getFullYear();
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
    ui.mainVisualization.appendChild(domDay);
    domDay.classList.add('day');
    domDay.innerText = day.getDate();

    //Attach data attributes to the day
    domDay.setAttribute("data-year", day.getFullYear());
    domDay.setAttribute("data-month", day.getMonth()+1);
    domDay.setAttribute("data-day", day.getDate());

    // //Mark the day as a normal day
      domDay.classList.add('regularDay');
  })

};


//Visualize all individual days above the expectation
function visualizeAboveExpectactionDays(){
  let days = [];

  //Get an array with all days after the expiration until today
  let numberOfDays = ((data.today - data.expiration)/1000/3600/24)+1;
  let nextDate = new Date(data.expiration);
  for(let i = 1; i < numberOfDays; i++){
    nextDate.setDate(nextDate.getDate() + 1);
    days.push(new Date(nextDate));
  };

    //Append all days of the user's life
    days.forEach(day => {
      //Create a day DOM element
      let domDay = document.createElement("div");

      //If this is the first day of the year add a year label before it
      if (day.getMonth() === 0 && day.getDate() === 1){
        let yearLabel = document.createElement("div");
        yearLabel.innerText = day.getFullYear();
        yearLabel.classList.add('yearLabel');
        yearLabel.id = day.getFullYear();
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
      ui.mainVisualization.appendChild(domDay);
      domDay.classList.add('day');
      domDay.innerText = day.getDate();

      //Attach data attributes to the day
      domDay.setAttribute("data-year", day.getFullYear());
      domDay.setAttribute("data-month", day.getMonth()+1);
      domDay.setAttribute("data-day", day.getDate());

      // //Mark the day as an above-expectancy day
      domDay.classList.add('extraDay');
    });

};


//Inform the user they have outlived their life expectancy
function highlightOutlivedExpectancy(){
  if(data.outlivedExpectancy === true){
    let lastExpectedDay = `${new Date(data.expiration).getFullYear()}-${new Date(data.expiration).getMonth()+1}-${new Date(data.expiration).getDate()}`;
    ui.lastExpectedDay = document.getElementById(lastExpectedDay);
    ui.lastExpectedDay.className = '';
    ui.lastExpectedDay.classList.add('day');
    ui.lastExpectedDay.classList.add('lastExpectedDay');
    ui.lastExpectedDayId = lastExpectedDay;
   
   //Populate the last expected day with a congratulation message but do not re-populate it if the user overwrites it
    if(data.setLastExpectedDayDefaultMessage === undefined){
     saveDayEntryToLocalStorage (ui.lastExpectedDayId, "message", "Based on the average life expectancy, this was the last day of your life! Congratulations if you can see this message! All following days will be highlight with a special color so that you can remind yourself of enjoying them even more!")
     updateCurrentProfileInStorage(
       "setLastExpectedDayDefaultMessage",
       'true'
     );
    }

    //Assign to the last expected day a default image but do not re-assign it if the user overwrites it
    if(data.setLastExpectedDayDefaultImage === undefined){
      getDayEntryFromLocalStorage (ui.lastExpectedDayId);
      saveDayEntryToLocalStorage (ui.lastExpectedDayId, "image", "/images/end.png")
      updateCurrentProfileInStorage("setLastExpectedDayDefaultImage", 'true');
  }
  }
}

//Check whether the user outlived their life expectancy
function outlivedExpectancyCheck(){
  let todayDate = new Date();
  if(todayDate > data.expiration){
   data.outlivedExpectancy = true;
   window.scrollTo(0, document.body.scrollHeight);
  }
}

//Highlight the first birthday
function highlightFirstBirthday(){
  let firstBirthday = `${new Date(data.answers.dob).getFullYear()}-${new Date(data.answers.dob).getMonth()+1}-${new Date(data.answers.dob).getDate()}`;
  ui.firstBirthday = document.getElementById(firstBirthday);
  ui.firstBirthday.className = '';
  ui.firstBirthday.classList.add('day');
  ui.firstBirthday.classList.add('firstBirthday');
  ui.firstBirthdayId = firstBirthday;

  //Populate the first birthday with a default message but do not re-populate it if the user overwrites it
 if(data.setFirstBirthdayDefaultMessage === undefined){
  getDayEntryFromLocalStorage (ui.firstBirthdayId);
  saveDayEntryToLocalStorage (ui.firstBirthdayId, "message", "This is the day when you were born!");
  updateCurrentProfileInStorage("setFirstBirthdayDefaultMessage", 'true');
 }
  //Assign to the first birthday a default image but do not re-assign it if the user overwrites it
  if(data.setFirstBirthdayDefaultImage=== undefined){
    getDayEntryFromLocalStorage (ui.firstBirthdayId);
    saveDayEntryToLocalStorage (ui.firstBirthdayId, "image", "/images/birth.png")
    updateCurrentProfileInStorage("setFirstBirthdayDefaultImage", 'true');
  }

 
}

//Highlight today
function highlightToday(){
  let todayDate = new Date();
  let todaySelector = `${todayDate.getFullYear()}-${todayDate.getMonth()+1}-${todayDate.getDate()}`;
  let domPositionOfToday = document.getElementById(todaySelector).offsetTop;
  window.scrollTo(0, domPositionOfToday - window.innerHeight/2);
  document.getElementById(todaySelector).className = '';
  document.getElementById(todaySelector).classList.add('day');
  document.getElementById(todaySelector).classList.add('today');
};



//Mark upon app load all days that have an entry attached to them
function highlightAllDaysWithEntry(){
  let currentStorageEntries = getCurrentProfileFromStorage().entries;
  if (currentStorageEntries !== undefined) {
    let daysWithEntry = Object.keys(currentStorageEntries);
    daysWithEntry.forEach(day => {
      //If there is a day in the local storage which is outside of the user's lifespan, just ignore it
      if(document.getElementById(day) !== null){
        document.getElementById(day).classList.add('hasEntry');
      }
    })
  }
};

//Displaying of day-entry modal
function displayModal(input){
  ui.dayEntryModal.classList.add('visible');
  ui.dayEntryModal.setAttribute("data-day",input.clickedDayId);
  ui.dayEntryDate.innerText = `${input.day}. ${input.month}. ${input.year}`;
  if(getDayEntryFromLocalStorage (input.clickedDayId).message === undefined){
    ui.dayEntryForm.value = "";
  } else{
    ui.dayEntryForm.value = getDayEntryFromLocalStorage (input.clickedDayId).message;
  }

  if(getDayEntryFromLocalStorage (input.clickedDayId).image !== undefined){
    ui.dayEntryImage.src = getDayEntryFromLocalStorage (input.clickedDayId).image;
  }else{
    ui.dayEntryImage.src = '/images/imagePlaceholder.png';
  }
};

//Closing day-entry modal
function hideModal(){
 ui.dayEntryModal.classList.remove('visible');
};



//EVENT TRIGGERS=============================
//Click: Move to a selecter year
ui.statsYearSelect.addEventListener('change', (e)=>{
  e.preventDefault();
  let domPositionOfSelectedYear= document.getElementById(ui.statsYearSelect.value).offsetTop;
  window.scrollTo(0, domPositionOfSelectedYear - window.innerHeight/5);
})

//Click: Open day-entry modal
function attachActionToDays(){
  Array.from(document.querySelectorAll('.day')).forEach(item=>{
    item.addEventListener('click',()=>{
    let clickedDayId = `${item.getAttribute('data-year')}-${item.getAttribute('data-month')}-${item.getAttribute('data-day')}`;
    displayModal({clickedDayId:clickedDayId, year:item.getAttribute('data-year'), month: item.getAttribute('data-month'), day: item.getAttribute('data-day')});
    data.openedModalId = clickedDayId;
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
  saveDayEntryToLocalStorage(dayId, "message", content);
  hideModal();
});

//Click: Trigger adding image to a day entry
ui.dayEntryImage.addEventListener('click', (e)=>{
  e.preventDefault();
  if(ui.imageUrlInsertForm.style.display === "" || ui.imageUrlInsertForm.style.display === "none"){
    ui.imageUrlInsertForm.style.display = "block";
    if(getDayEntryFromLocalStorage (data.openedModalId).image === undefined){
      ui.imageUrlInsertField.placeholder = "Insert some image URL";
    } else{
      ui.imageUrlInsertField.value = getDayEntryFromLocalStorage (data.openedModalId).image;
    }
  }
  else{
    ui.imageUrlInsertForm.style.display = "none";
  }
});

//Click: Save Image URL
ui.imageUrlSaveBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  if(ui.imageUrlInsertField.value !== ""){
    saveDayEntryToLocalStorage(data.openedModalId, "image", ui.imageUrlInsertField.value);
    ui.imageUrlInsertForm.style.display = "none";
    ui.dayEntryImage.src = ui.imageUrlInsertField.value;
  }
})




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
  getAnswers();
  getExpectancyStats();
  processExpectancyStats();

})();


