function nextStep(step) {
  var currentStep = document.querySelector('.step-form.active');
  var nextStep = document.getElementById('step' + step);

  if (currentStep && nextStep) { 
    if (validateForm(currentStep)) {  
      currentStep.classList.remove('active');
      nextStep.classList.add('active');
    } else { 
      alert('Por favor, completa todos los campos antes de continuar.');
    } 
  } 
}  

function previousStep(step) {
    var currentStep = document.querySelector('.step-form.active');
    var previousStep = document.getElementById('step' + step);

    if (currentStep && previousStep) {
        currentStep.classList.remove('active');
        previousStep.classList.add('active');
    }
}

function validateForm(form) {
    var inputs = form.querySelectorAll('input, textarea');
    
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value.trim() === '') {
            return false;
        }
    }

    return true;
}