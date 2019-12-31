/***  Globals ***/
const gallery = document.getElementById('gallery');




/***  API Usage ***/
function fetchData(url) {
  return fetch(url)
          .then(checkStatus)
          .then(res => res.json())
          .catch(error => console.log('Looks like there was a problem!', error));
}

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

fetchData('https://randomuser.me/api/?nat=us&results=12')
  // .then(data => console.log(data));
  .then(data => createGallery(data.results))

/*** User Directory ***/
const createGallery = (data) => {
  data.forEach(employee => {
    const card = createElement('div', 'className', 'card');

    const cardImgContainer = createElement('div', 'className', 'card-img-container');
    const img = createElement('img', 'className', 'card-img', 'alt', 'profile picture', 'src', `${employee.picture.large}`);
    cardImgContainer.appendChild(img);

    const cardInfoContainer = createElement('div', 'className', 'card-info-container');
    const cardName = createElement('h3', 'id', 'name', 'className', 'card-name cap', 'textContent', `${employee.name.first} ${employee.name.last}`);
    const email = createElement('p', 'className', 'card-text', 'textContent', `${employee.email}`);
    const location = createElement('p', 'className', 'card-text cap', 'textContent', `${employee.location.city}, ${employee.location.state}`);
    appendMultipleChildren(cardInfoContainer, cardName, email, location);

    appendMultipleChildren(card, cardImgContainer, cardInfoContainer);

    gallery.appendChild(card);
  });

}

/*** User Directory Helpers ***/
const createElement = (el, prop, val, prop2 = null, val2 = null, prop3 = null, val3 = null, prop4 = null, val4 = null) => {
  const element = document.createElement(el);
  element[prop] = val;
  if (prop2 !== null && val2 !== null) {
     element[prop2] = val2;
  }
  if (prop3 !== null && val3 !== null) {
    element[prop3] = val3;
  }
  if (prop4 !== null && val4 !== null) {
    element[prop4] = val4;
 }
  return element;
}

const appendMultipleChildren = (parent, ...children) => {
  children.forEach(child => parent.appendChild(child));
}

/*** Modal Window ***/

