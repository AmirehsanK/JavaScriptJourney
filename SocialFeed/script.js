//#region Globals
const deleteTimer = 2000;
const maxChars = 150;
const apiUrl = 'https://bytegrad.com/course-assets/js/1/api';
//#endregion

//#region Elements
const textAreaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');
const feedEl = document.querySelector('.feedbacks');
const submitEl = document.querySelector('.submit-btn');
const hashtagListEl = document.querySelector('.hashtags');
//#endregion

//#region Handles how much character left for feedback input
const InputHandler = () =>{
    const charsNumber = textAreaEl.value.length;
    const charsLeft = maxChars - charsNumber;
    counterEl.innerText = charsLeft.toString();
}
//#endregion

//#region Function for handling form component
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
    //Upload to api
    fetch(apiUrl+'/feedbacks',{
        method: 'POST',
        body: JSON.stringify(feed),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(response => {if(!response.ok)
        console.log('error occurred');
    else
        console.log('Submitted Successfully');}
    )

    textAreaEl.value = '';
    submitEl.blur();
    counterEl.textContent=maxChars.toString();
}
//#endregion

//#region Form visual indicator
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
//#endregion

//#region Render feedback items
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
//#endregion

//#region ClickHandler
const ClickHandler = (event) =>
{
    const clickedEl= event.target;
    const upvoteEl = clickedEl.className.includes( 'upvote' );
    if (upvoteEl)
    {
        const upvoteBtnEl = clickedEl.closest('.upvote');
        upvoteBtnEl.disabled = true;
        //this is only adding an upvote locally
        const upvoteCountEl = upvoteBtnEl.querySelector('.upvote__count');
        let upvoteCount = +upvoteCountEl.textContent;
        upvoteCountEl.textContent = (++upvoteCount).toString();
    }
    else
    {
        clickedEl.closest('.feedback').classList.add('feedback--expand');
    }
}
//#endregion

//#region HashtagClickHandler
const HashtagClickHandler= (event) =>
{
    const clickedEl= event.target;
    if(clickedEl.className==='hashtags')
        return;
    const hashtagCompanyName = clickedEl.textContent.substring(1).trim().toLowerCase();
    feedEl.childNodes.forEach(childNode =>
    {
        if (childNode.nodeType === 3)return;
        const companyName = childNode.querySelector('.feedback__company').textContent.toLowerCase().trim();
        if (hashtagCompanyName !== companyName)
        {
            childNode.remove();
        }
    })
}
//#endregion

//#region Get feedbacks from server
fetch(apiUrl+'/feedbacks').
then(response => response.json()).
then(data => {
    document.querySelector(".spinner").remove();
    data.feedbacks.forEach(feedItem => renderFeedbackItem(feedItem));
}).catch(error => {
    feedEl.textContent = `Failed to fetch items. ${error.message}`;
});
//#endregion

//#region Events
textAreaEl.addEventListener('input', InputHandler);
formEl.addEventListener('submit', SubmitHandler);
feedEl.addEventListener('click', ClickHandler);
hashtagListEl.addEventListener('click', HashtagClickHandler);
//#endregion