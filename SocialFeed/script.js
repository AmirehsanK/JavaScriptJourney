//Global
const deleteTimer = 2000;
const maxChars = 150;

const textAreaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');
const feedEl = document.querySelector('.feedbacks');
const submitEl = document.querySelector('.submit-btn');

//Handles how much character left for feedback input
const InputHandler = () =>{
    const charsNumber = textAreaEl.value.length;
    const charsLeft = maxChars - charsNumber;
    counterEl.innerText = charsLeft.toString();
}
//Function for handling form component
const SubmitHandler = (event) =>{
    event.preventDefault();
    const text =  textAreaEl.value;
    if (!(text.includes('#') && text.length >= 5)) {
        showVisualIndicator(false);
        textAreaEl.focus();
        return;
    } else {
        showVisualIndicator(true);
    }
    const hashtag = text.split(' ').find(_ => _.includes('#'));
    const company = hashtag.substring(1).toUpperCase();
    const badgeLetter = company.substring(0,1);
    const upvoteCount = 0;
    const daysPassed = 0;
    const feed = {
        upvoteCount: upvoteCount,
        daysAgo: daysPassed,
        company: company,
        badgeLetter: badgeLetter,
        text: text
    };
    renderFeedbackItem(feed);
    textAreaEl.value = '';
    submitEl.blur();
    counterEl.textContent=maxChars.toString();
}

const showVisualIndicator = (validator)=>
{
    if (validator === true)
    {
        formEl.classList.add('form--valid');
        setTimeout(() => formEl.classList.remove('form--valid'), deleteTimer);
    }
    else if (validator === false)
    {
        formEl.classList.add('form--invalid');
        setTimeout(() => formEl.classList.remove('form--invalid'), deleteTimer);
    }
}

const renderFeedbackItem = feedback => {
    const feedItem = `
    <li class="feedback">
            <button class="upvote">
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${feedback.upvoteCount}</span>
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${feedback.badgeLetter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${feedback.company}</p>
                <p class="feedback__text">
                ${feedback.text}
                </p>
            </div>
            <p class="feedback__date">${feedback.daysAgo === 0 ? 'NEW' : `${feedback.daysAgo}d`}</p>
        </li>
    `;
    feedEl.insertAdjacentHTML('beforeend', feedItem);
}


textAreaEl.addEventListener('input', InputHandler)
formEl.addEventListener('submit', SubmitHandler)

fetch('https://bytegrad.com/course-assets/js/1/api/feedbacks').
then(response => response.json()).
then(data => {
    document.querySelector(".spinner").remove();
    data.feedbacks.forEach(feedItem => renderFeedbackItem(feedItem));
}).catch(error => {
    feedEl.textContent = `Failed to fetch items. ${error.message}`;
});