/***  Globals ***/
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');

/*** General Helpers ***/
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


const createTree = (...nodes) => {
  for (let i = 0; i < nodes.length - 1; i++) {
    const parent = nodes[i];
    const child = nodes[i + 1];
    parent.appendChild(child);
  }
}

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
  .then(data => {
    createGallery(data.results);
    createModal(data.results);
  });


/*** User Directory ***/
const createGallery = (data) => {
  data.forEach((employee, idx) => {
    const card = createElement('div', 'className', 'card');
    card.setAttribute('data-id', idx);

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

/*** Modal Window ***/
const createModal = (data) => {
  data.forEach((employee, idx) => {
    const modalContainer = createElement('div', 'className', 'modal-container hidden');
    modalContainer.setAttribute('data-id', idx);

    const modal = createElement('div', 'className', 'modal');

    const closeButton = createElement('button', 'id', 'modal-close-btn', 'className', 'modal-close-btn');
    const strong = createElement('strong', 'textContent', 'X');
    closeButton.appendChild(strong);

    const modalInfoContainer = createElement('div', 'className', 'modal-info-container');
    const img = createElement('img', 'className', 'modal-img', 'src', `${employee.picture.large}`, 'alt', 'profile picture');
    const name = createElement('h3', 'id', 'name', 'className', 'modal-name cap', 'textContent', `${employee.name.first} ${employee.name.last}`);
    const email = createElement('p', 'className', 'modal-text', 'textContent', `${employee.email}`);
    const city = createElement('p', 'className', 'modal-text cap', 'textContent', `${employee.location.city}`);
    const phone = createElement('p', 'className', 'modal-text', 'textContent', `${employee.cell}`);
    const address = createElement('p', 'className', 'modal-text', 'textContent', `${employee.location.street.number} ${employee.location.street.name}, ${employee.location.state} ${employee.location.postcode}`); // need state abbrev
    const birthday = createElement('p', 'className', 'modal-text', 'textContent', 'Birthday: 10/21/2015');
    appendMultipleChildren(modalInfoContainer, img, name, email, city, phone, address, birthday);

    appendMultipleChildren(modal, closeButton, modalInfoContainer);

    createTree(body, modalContainer, modal);
  });
};

const displayModal = () => {


};

const hideModal = () => {


};

/*** Event Listeners ***/