const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

// day 1

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const logInInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');

let login = '';



function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');

}  



function authorized() {
  console.log('Авторизован');
  buttonAuth.style.display = 'none';
  userName.style.display = 'block';
  userName.textContent = login;
  buttonOut.style.display = 'block';

}

function NotAuthorized() {
  console.log('Не авторизован');

  function logIn(event) {
    event.preventDefault();
     login = logInInput.value;
     toggleModalAuth();
     checkAuth();
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn)
}

function checkAuth() {
  if(login) {
    authorized()
  } else {
    NotAuthorized()
  } 
}

checkAuth()