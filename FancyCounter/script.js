const increasebuttonEl = document.querySelector('.counter_button--increase');
const decreasebuttonEl = document.querySelector('.counter_button--decrease');
const counterValueEl = document.querySelector('.counter_value');
const resetButtonEl = document.querySelector('.counter_reset-button');
const counterEL = document.querySelector('.counter');
const titleEl = document.querySelector('.counter_title');

increasebuttonEl.addEventListener('click', Increment);
decreasebuttonEl.addEventListener('click', Decrement);
resetButtonEl.addEventListener('click', ResetCounter)

function Increment() {
    const currentValue = counterValueEl.textContent;
    const currentValueAsNumber = +currentValue;
    let newValue = currentValueAsNumber + 1;
    if (currentValue > 10) {
        counterEL.classList.add('counter-limit');
        titleEl.textContent = 'Limited ! Buy pro subscription for above 11!';
    } else {
        counterValueEl.textContent = newValue;
    }
}

function Decrement() {
    const currentValue = counterValueEl.textContent;
    const currentValueAsNumber = +currentValue;
    let newValue = currentValueAsNumber - 1;
    if (newValue < 0) {
        newValue = 0;
        counterEL.classList.remove('counter-limit');
        titleEl.textContent = 'Amirehsan Counter';
    }
    if (newValue === 10) {
        counterEL.classList.remove('counter-limit');
        titleEl.textContent = 'Amirehsan Counter';
    }

    counterValueEl.textContent = newValue;
}

function ResetCounter() {
    counterValueEl.textContent = 0;
    counterEL.classList.remove('counter-limit');
    titleEl.textContent = 'Amirehsan Counter';
}
