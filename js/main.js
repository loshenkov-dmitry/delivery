"use strict"


const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const logInInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart')
let login = localStorage.getItem('User');

const cart = []


const getData = async function(url) {

  const response = await fetch(url)

  if(!response.ok) {
    throw new Error(`Ошибка по адресу: ${url},
     статус ошибка: ${response.status}`)
  }

  return await response.json()

};

getData('./db/partners.json')

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');

} 

function toggleModal() {
  modal.classList.toggle("is-open");
}



function authorized() {

  function logOut() {
    login = '';
    
    localStorage.removeItem('User')
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut)
    checkAuth();

  }


  console.log('Авторизован');
  buttonAuth.style.display = 'none';
  userName.style.display = 'block';
  userName.textContent = login;
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex'
  buttonOut.addEventListener('click', logOut)

}

function NotAuthorized() {
  console.log('Не авторизован');

  function logIn(event) {
    event.preventDefault();
     login = logInInput.value;
     localStorage.setItem('User', login)
     toggleModalAuth();
     buttonAuth.removeEventListener('click', toggleModalAuth);
     closeAuth.removeEventListener('click', toggleModalAuth);
     logInForm.removeEventListener('submit', logIn);
     logInForm.reset();
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


function createCardRestaurant(restaurant) {

  const { image, kitchen, name, price, products, stars, time_of_delivery: timeOfDelivery} = restaurant

  const card = `
  <a class="card card-restaurant" data-products='${products}'>
  <img src="${image}" alt="image" class="card-image"/>
  <div class="card-text">
    <div class="card-heading">
      <h3 class="card-title">${name}</h3>
      <span class="card-tag tag">${timeOfDelivery} мин</span>
    </div>
    <!-- /.card-heading -->
    <div class="card-info">
      <div class="rating">
      ${stars}
      </div>
      <div class="price">От ${price} ₽</div>
      <div class="category">${kitchen}</div>
    </div>
  </div>
</a>
`;

  cardsRestaurants.insertAdjacentHTML('beforeend', card)


}



function createCardGood(goods) {

  const { description, id, image, name, price, } = goods

  const card = document.createElement('div')
  card.className = 'card';
  card.innerHTML = `
  <img src="${image}" alt="image" class="card-image"/>
  <div class="card-text">
    <div class="card-heading">
      <h3 class="card-title card-title-reg">${name}</h3>
    </div>
    <div class="card-info">
      <div class="ingredients">${description}
      </div>
    </div>
    <div class="card-buttons">
      <button class="button button-primary button-add-cart" id="${id}">
        <span class="button-card-text">В корзину</span>
        <span class="button-cart-svg"></span>
      </button>
      <strong class="card-price-bold">${price} ₽</strong>
    </div>
  </div>
 `

 cardsMenu.insertAdjacentElement('beforeend', card)

}

function openGoods(event) {

  const target = event.target;
  
  const restaurant = target.closest('.card-restaurant');

  if(restaurant) {

    restaurant.dataset.products

    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');
    getData(`./db/${restaurant.dataset.products}`).then(function(data) {
      data.forEach(createCardGood)
    })

    cardsMenu.textContent = '';

  }


}


function addToCart(event) {

  const target = event.target;

  const buttonAddToCart = target.closest('.button-add-cart');

  if(buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price-bold').textContent;
    const id = buttonAddToCart.id;

    const food = cart.find(function(item){
      return item.id === id
    })

    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1
      })

    }
    console.log(cart)

  }
}

function renderCart() {
  modalBody.textContent = '';


  cart.forEach(function({ id, title, cost, count }){
    const itemCart = `
    <div class="food-row">
    <span class="food-name">${title}</span>
    <strong class="food-price">${cost}</strong>
    <div class="food-counter">
      <button class="counter-button counter-minus" data-id=${id}>-</button>
      <span class="counter">${count}</span>
      <button class="counter-button counter-plus" data-id=${id}>+</button>
    </div>
  </div>
  `;

  modalBody.insertAdjacentHTML('afterbegin', itemCart);

  });

  const totalPrice = cart.reduce(function(result, item) {
    return result + (parseFloat(item.cost) * item.count);
  }, 0)

  modalPrice.textContent = totalPrice + ' ₽';
}


function changeCount(event) {
  const target = event.target;
  if(target.classList.contains('counter-button')) {
    const food = cart.find(function(item) {
      return item.id === target.dataset.id
    })

    
  if (target.classList.contains('counter-minus')) {
    food.count-- 
    if(food.count === 0) {
      cart.splice(cart.indexOf(food), 1)
    }
  }

    
  if (target.classList.contains('counter-plus')) food.count++


  renderCart()

  }

  



}




function init() {
  getData('./db/partners.json').then(function(data){
    data.forEach(createCardRestaurant)
  })
  
  cartButton.addEventListener("click", function(){
    renderCart()
    toggleModal()
  });

  modalBody.addEventListener("click", changeCount) 

  closeButton.addEventListener("click", toggleModal);
  
  cardsMenu.addEventListener('click', addToCart);

  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', function() {
    containerPromo.classList.remove('hide')
      restaurants.classList.remove('hide')
      menu.classList.add('hide')
  })


  buttonClearCart.addEventListener('click', function() {
    cart.length = 0;
    renderCart()
  })
  
  checkAuth();

  new Swiper('.swiper-container', {
    loop: true,
    sliderPerView: 1,
  })
}


init()
