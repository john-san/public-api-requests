/***  Globals ***/
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');
const searchContainer = document.querySelector('.search-container');
const state = {
  results: [],
  dataIDStr: null,
  dataIDNum: null,
  lastIdx: null,
  filterResults: []
};

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

const hide = (node) => {
  node.classList.add('hidden');
}

const show = (node) => {
  node.classList.remove('hidden');
}

const currentModal = () => {
  return document.querySelector(`.modal-container[data-id='${state.dataIDStr}']`);
}

/*** State Helpers  ***/
// retrieves dataID. If not on current element, traverse up to find dataID
const getDataID =  (target) => {
  if (target.getAttribute('data-id')) {
    return target.getAttribute('data-id');
  } else if (target.parentNode.getAttribute('data-id')) {
    return target.parentNode.getAttribute('data-id');
  } else if (target.parentNode.parentNode.getAttribute('data-id')) {
    return target.parentNode.parentNode.getAttribute('data-id');
  } else if (target.parentNode.parentNode.parentNode.getAttribute('data-id')) {
    return target.parentNode.parentNode.parentNode.getAttribute('data-id');
  }
}

const setStateID = (dataIDStr) => {
  state.dataIDStr =  dataIDStr;
  state.dataIDNum = parseInt(dataIDStr);
}

const resetStateID = () => {
  state.dataIDStr =  null;
  state.dataIDNum = null;
}

const incrementStateID = () => {
  state.dataIDNum += 1;
  state.dataIDStr = state.dataIDNum.toString();
}

const decrementStateID = () => {
  state.dataIDNum -= 1;
  state.dataIDStr = state.dataIDNum.toString();
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

const wipeGalleryAndModals = () => {
  [...gallery.children].forEach(child => gallery.removeChild(child));

  [...document.querySelectorAll('.modal-container')].forEach(child => body.removeChild(child));

}

/*** Modal Window ***/
const createModals = (data) => {
  data.forEach((employee, idx) => {
    const modalContainer = createElement('div', 'className', 'modal-container hidden');
    modalContainer.setAttribute('data-id', idx);

    const modal = createElement('div', 'className', 'modal');

    const closeButton = createElement('button', 'id', 'modal-close-btn', 'className', 'modal-close-btn');
    const strong = createElement('strong', 'className', 'close-x','textContent', 'X');
    closeButton.appendChild(strong);

    const modalInfoContainer = createElement('div', 'className', 'modal-info-container');
    const img = createElement('img', 'className', 'modal-img', 'src', `${employee.picture.large}`, 'alt', 'profile picture');
    const name = createElement('h3', 'id', 'name', 'className', 'modal-name cap', 'textContent', `${employee.name.first} ${employee.name.last}`);
    const email = createElement('p', 'className', 'modal-text', 'textContent', `${employee.email}`);
    const city = createElement('p', 'className', 'modal-text cap', 'textContent', `${employee.location.city}`);
    const phone = createElement('p', 'className', 'modal-text', 'textContent', `${employee.cell}`);
    const address = createElement('p', 'className', 'modal-text', 'textContent', `${employee.location.street.number} ${employee.location.street.name}, ${employee.location.state} ${employee.location.postcode}`); 
    const birthday = createElement('p', 'className', 'modal-text', 'textContent', 'Birthday: 10/21/2015');
    appendMultipleChildren(modalInfoContainer, img, name, email, city, phone, address, birthday);

    const modelBtnContainer = createElement('div', 'className', 'modal-btn-container');
    const modalPrev = createElement('button', 'id', 'modal-prev', 'className', 'modal-prev-btn', 'textContent', 'Prev');
    const modalNext = createElement('button', 'id', 'modal-next', 'className', 'modal-next-btn', 'textContent', 'Next');
    appendMultipleChildren(modelBtnContainer, modalPrev, modalNext);

    appendMultipleChildren(modal, closeButton, modalInfoContainer, modelBtnContainer);

    createTree(body, modalContainer, modal);
  });
};

const displayModal = (target) => {
  setStateID(getDataID(target));
  show(currentModal());
};

const hideModal = (target) => {
  hide(currentModal());
  resetStateID();
};

const nextModal = () => {
  if (state.dataIDNum < state.lastIdx) {
    hide(currentModal());
    incrementStateID();
    show(currentModal());
  }
}

const prevModal = () => {
  if (state.dataIDNum > 0) {
    hide(currentModal());
    decrementStateID();
    show(currentModal());
  }
}

/*** Search/Filter ***/
const createSearchForm = () => {
  const form = createElement('form', 'action', '#', 'method', 'get');
  
  const searchInput = createElement('input', 'type', 'search', 'id', 'search-input', 'className', 'search-input', 'placeholder', 'Search by name...');
  const searchSubmit = createElement('input', 'type', 'submit', 'value', 'Search', 'id', 'search-submit', 'className', 'search-submit');

  appendMultipleChildren(form, searchInput, searchSubmit);
  searchContainer.appendChild(form);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const searchStr = document.getElementById('search-input').value;
    filterResults(searchStr);
  });

  searchInput.addEventListener('keyup', e => {
    const searchStr = e.target.value;
    filterResults(searchStr);
  });
};

const filterResults = (str) => {
  const prevResults = state.filterResults;

  const cleanedStr = str.toLowerCase().trim();
  state.filterResults = state.results.filter(employee => {
    const fullName = `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`
    return fullName.includes(cleanedStr);
  });

  if (arraysMatch(prevResults, state.filterResults) === false) {
    state.lastIdx = state.filterResults.length - 1;
    wipeGalleryAndModals();
    createGallery(state.filterResults);
    createModals(state.filterResults);
  }
}

/*** Search/Filter Helpers ***/
// Checks if two arrays are the same. modified from https://gomakethings.com/how-to-check-if-two-arrays-are-equal-with-vanilla-js/
const arraysMatch = (arr1, arr2) => {
	// Check if the arrays are the same length
	if (arr1.length !== arr2.length) {
    return false;
  }
	// Check if all items exist and are in the same order
	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i])  {
      return false;
    }
	}
	
	return true;
};

/*** Event Listeners ***/
gallery.addEventListener('click', e => {
  if (e.target.classList.value.includes("card")) {
    displayModal(e.target);
  }
});

body.addEventListener('click', e => {
  if (e.target.id === 'modal-close-btn' || e.target.className === "close-x") {
    hideModal(e.target);
  }

  if (e.target.id === 'modal-next') {
    nextModal();
  } else if (e.target.id === 'modal-prev') {
    prevModal();
  }
});

/*** Initialize ***/
fetchData('https://randomuser.me/api/?nat=us&results=12')
  .then(data => {
    state.results = data.results;
    state.lastIdx = data.results.length - 1;
    createGallery(data.results);
    createModals(data.results);
  });

createSearchForm();