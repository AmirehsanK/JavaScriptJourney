const text = document.querySelector('textarea');
const numberOfCharacterEl = document.querySelector('.stat__number--characters')
const twitter = document.querySelector('.stat__number--twitter');
const facebook = document.querySelector('.stat__number--facebook');
const Words = document.querySelector('.stat__number--words');

text.addEventListener('input', InputHandler)

const InputHandler = () => {
    if (text.value.includes('<script>')) {
        alert('Wrong input xD')
        text.value = text.value.replace('<script>', '');
    }
    const numberOfCharacters = text.value.length;
    const twitterCharacterLeft = 280 - numberOfCharacters;
    const facebookCharacterLeft = 603206 - numberOfCharacters;
    let numberOfWords = text.value.split(' ').length;
    if (text.value.length === 0)
        numberOfWords = 0;
    if (twitterCharacterLeft < 0) {
        twitter.classList.add('stat__number--limit')
    } else {
        twitter.classList.remove('stat__number--limit')
    }
    if (facebookCharacterLeft < 0) {
        facebook.classList.add('stat__number--limit')
    } else {
        facebook.classList.remove('stat__number--limit')
    }


    Words.textContent = numberOfWords;
    numberOfCharacterEl.textContent = numberOfCharacters;
    twitter.textContent = twitterCharacterLeft;
    facebook.textContent = facebookCharacterLeft;
}

