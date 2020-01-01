/***  Globals ***/
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');
const header = document.querySelector('header');
const searchContainer = document.querySelector('.search-container');
const state = {
  results: [],
  dataIDStr: null,
  dataIDNum: null,
  activeModal: false,
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

const appendChildren = (parent, ...children) => {
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

const remove = (node) => {
  const parent = node.parentNode;
  parent.removeChild(node);
}

const removeIfExists = (node) => {
  if (node) {
    const parent = node.parentNode;
    parent.removeChild(node);
  }
}

// modified animateCSS helper, from https://github.com/daneden/animate.css
const animateCSS = (element, animationName, callback, speed = "fast") => {
  const node = element;
  node.classList.add('animated', animationName, speed);

  function handleAnimationEnd() {
    node.classList.remove('animated', animationName, speed);
    node.removeEventListener('animationend', handleAnimationEnd);

    if (typeof callback === 'function') callback()
  }

  node.addEventListener('animationend', handleAnimationEnd);
};

/*** State Helpers  ***/
// retrieves dataID. If not on current element, traverse up to find dataID
const getDataID = (target) => {
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
  state.dataIDStr = dataIDStr;
  state.dataIDNum = parseInt(dataIDStr);
  state.activeModal = true;
}

const resetStateID = () => {
  state.dataIDStr = null;
  state.dataIDNum = null;
  state.activeModal = false;
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
async function getJSON(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function fetchData(url) {
  return await getJSON(url);
}

// updates state & renders data
function handleEmployeeData(data) {
  state.results = data.results;
  state.lastIdx = data.results.length - 1;
  createGallery(data.results);
  createModals(data.results);
}

/*** User Directory ***/
// renders gallery(employee cards)
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
    appendChildren(cardInfoContainer, cardName, email, location);

    appendChildren(card, cardImgContainer, cardInfoContainer);

    gallery.appendChild(card);
  });

}

const wipeGalleryAndModals = () => {
  [...gallery.children].forEach(child => gallery.removeChild(child));
  [...document.querySelectorAll('.modal-container')].forEach(child => body.removeChild(child));
}

/*** Modal Window ***/
// renders hidden modals for each employee
const createModals = (data) => {
  data.forEach((employee, idx) => {
    const modalContainer = createElement('div', 'className', 'modal-container hidden');
    modalContainer.setAttribute('data-id', idx);

    const modal = createElement('div', 'className', 'modal');

    const closeButton = createElement('button', 'id', 'modal-close-btn', 'className', 'modal-close-btn');
    const strong = createElement('strong', 'className', 'close-x', 'textContent', 'X');
    closeButton.appendChild(strong);

    const modalInfoContainer = createElement('div', 'className', 'modal-info-container');
    const img = createElement('img', 'className', 'modal-img', 'src', `${employee.picture.large}`, 'alt', 'profile picture');
    const name = createElement('h3', 'id', 'name', 'className', 'modal-name cap', 'textContent', `${employee.name.first} ${employee.name.last}`);
    const email = createElement('p', 'className', 'modal-text');
    const emailLink = createElement('a', 'textContent', `${employee.email}`, 'href', `mailto:${employee.email}`);
    email.appendChild(emailLink);
    const city = createElement('p', 'className', 'modal-text cap', 'textContent', `${employee.location.city}`);
    const hr = document.createElement('hr');
    const phone = createElement('p', 'className', 'modal-text');
    const phoneLink = createElement('a', 'textContent', `${employee.cell}`, 'href', `tel:${employee.cell}`);
    phone.appendChild(phoneLink);
    const address = createElement('p', 'className', 'modal-text', 'textContent', `${employee.location.street.number} ${employee.location.street.name}, ${employee.location.state} ${employee.location.postcode}`);
    const birthday = createElement('p', 'className', 'modal-text', 'textContent', `Birthday: ${getDate(employee)}`);
    appendChildren(modalInfoContainer, img, name, email, city, hr, phone, address, birthday);

    const modelBtnContainer = createElement('div', 'className', 'modal-btn-container');
    const modalPrev = createElement('button', 'id', 'modal-prev', 'className', 'modal-prev-btn', 'textContent', 'Prev');
    const modalNext = createElement('button', 'id', 'modal-next', 'className', 'modal-next-btn', 'textContent', 'Next');
    appendChildren(modelBtnContainer, modalPrev, modalNext);

    appendChildren(modal, closeButton, modalInfoContainer, modelBtnContainer);

    createTree(body, modalContainer, modal);
  });
};

/*** Modal interaction ***/
const displayModal = (target) => {
  setStateID(getDataID(target));
  show(currentModal());
};

const hideModal = () => {
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

/*** Modal Helpers ***/
// parse birthday in createModals
const getDate = (employee) => {
  const date = new Date(employee.dob.date);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getYear();
  return `${month}/${day}/${year}`;
}

// gets current Modal based off of state.dataIDStr
const currentModal = () => {
  return document.querySelector(`.modal-container[data-id='${state.dataIDStr}']`);
}

/*** Search/Filter ***/
// renders search form
const createSearchForm = () => {
  const form = createElement('form', 'action', '#', 'method', 'get');

  const searchInput = createElement('input', 'type', 'search', 'id', 'search-input', 'className', 'search-input', 'placeholder', 'Search by name...');
  const searchSubmit = createElement('input', 'type', 'submit', 'value', 'Search', 'id', 'search-submit', 'className', 'search-submit');

  appendChildren(form, searchInput, searchSubmit);
  searchContainer.appendChild(form);

  form.addEventListener('submit', filterHandler);
  searchInput.addEventListener('keyup', filterHandler);
};

// callback for search form events 
const filterHandler = (e) => {
  if (e.type === "submit") {
    e.preventDefault();
  }
  const searchStr = document.getElementById('search-input').value;
  filterEmployees(searchStr);
}

// filters employees based off of search input.
const filterEmployees = (str) => {
  // if no results, show on screen text 'no-results'
  function handleNoResults() {
    if (state.filterResults.length === 0) {
      if (!document.querySelector('#no-results')) {
        showBodyMessage('No results found.', 'no-results')
        const div = createElement('div', 'className', 'no-results', 'textContent', 'No results found')
      }
    } else {
      cleanUpBodyMessage('no-results');
    }
  }

  function renderResults() {
    // only re-render when different results are found
    if (arraysMatch(prevResults, state.filterResults) === false) {
      state.lastIdx = state.filterResults.length - 1;
      wipeGalleryAndModals();
      createGallery(state.filterResults);
      createModals(state.filterResults);
    }
  }

  const prevResults = state.filterResults;
  const cleanedStr = str.toLowerCase().trim();
  state.filterResults = state.results.filter(employee => {
    const fullName = `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`
    return fullName.includes(cleanedStr);
  });

  handleNoResults();
  renderResults();
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
    if (arr1[i] !== arr2[i]) {
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
    hideModal();
  }

  if (e.target.id === 'modal-next') {
    nextModal();
  } else if (e.target.id === 'modal-prev') {
    prevModal();
  }
});

// keyboard support for modals
body.addEventListener('keyup', e => {
  if (state.activeModal) {
    const key = e.key;
    if (key === "Escape") {
      hideModal();
    } else if (key === "ArrowLeft") {
      prevModal();
    } else if (key === "ArrowRight") {
      nextModal();
    }
  }
});

/*** Alerts & Messages ***/
const showAlert = (alertClassName, text, animationEntrance = 'slideInDown', animationExit = null) => {

  const div = createElement('div', 'className', `alert alert-${alertClassName}`, 'textContent', text);
  const body = document.querySelector('body');
  const firstChild = body.firstElementChild;
  body.insertBefore(div, firstChild);
  animateCSS(div, animationEntrance);

  if (animationExit !== null) {
    cleanUpAlert(div, animationExit);
  }
}

function cleanUpAlert(node, animationExit = 'fadeOut', speed = 2000) {
  setTimeout(() => {
    animateCSS(node, animationExit, () => {
      body.removeChild(node);
    });
  }, speed);
}

const showBodyMessage = (text, id) => {
  const div = createElement('div', 'textContent', text, 'id', id, 'className', 'body-message');
  body.insertBefore(div, gallery);
}

const cleanUpBodyMessage = (id) => {
  removeIfExists(document.getElementById(id));
}

/*** Initialize ***/
document.addEventListener('DOMContentLoaded', () => {
  showBodyMessage('Loading...', 'loading-message');

  fetchData('https://randomuser.me/api/?nat=us&results=12')
    .then(handleEmployeeData)
    .then(() => showAlert('success', 'Data loaded successfully!', 'slideInDown', 'fadeOut'))
    .catch(error => {
      showAlert('danger', 'Something went wrong!', 'slideInDown', 'fadeOut');
      console.error(error);
    })
    .finally(() => cleanUpBodyMessage('loading-message'));

  createSearchForm();
});
