const ui = {
  nextBtn: document.getElementById('nextBtn'),
  questionCountry: document.getElementById('question-country'),
  questionGender: document.getElementById('question-gender')
};


//Make the 'Next' button invisible by default
ui.nextBtn.style.display = 'none';
ui.questionCountry.style.display = 'none';


//Display the next button
Array.from(document.querySelectorAll('.radioOption')).forEach(radioOption =>{
  radioOption.addEventListener('click', (e)=>{
    ui.nextBtn.style.display = 'flex';
  })
});


//Save the value
ui.nextBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  localStorage.setItem('gender', document.querySelector('input[name="gender"]:checked').value);
  ui.nextBtn.style.display = 'none';
ui.questionGender.style.display = 'none';
ui.questionCountry.style.display = 'flex';
})