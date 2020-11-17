const ui = {
  nextBtn: document.getElementById('nextBtn'),
};


//Make the 'Next' button invisible by default
ui.nextBtn.visibility = 'hidden';


//Display the next button
Array.from(document.querySelectorAll('.radioOption')).forEach(radioOption =>{
  radioOption.addEventListener('click', (e)=>{
    ui.nextBtn.visibility = 1;
  })
});


//Save the value
ui.nextBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  localStorage.setItem('gender', document.querySelector('input[name="gender"]:checked').value);
})