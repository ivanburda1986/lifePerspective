const ui = {
  nextBtn: document.getElementById('nextBtn'),
  questionCountry: document.getElementById('question-country'),
  questionGender: document.getElementById('question-gender')
};


//Make the 'Next' button invisible by default
ui.nextBtn.style.visibility = 'hidden';
ui.questionCountry.style.display = 'none';


//Display the next button
Array.from(document.querySelectorAll('.radioOption')).forEach(radioOption =>{
  radioOption.addEventListener('click', (e)=>{
    ui.nextBtn.style.visibility = 'visible';
  })
});


//Save the value
ui.nextBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  localStorage.setItem('gender', document.querySelector('input[name="gender"]:checked').value);
ui.nextBtn.style.visibility = 'hidden';
ui.questionGender.style.display = 'none';
ui.questionCountry.style.display = 'flex';
})

//Get the countries and related life expectancy data
async function getData() {
  const res = await fetch(
    '../data/life-expectancy.json'
  );
  const data = await res.json();
  return data;
}

let countries = getData();