const wrapper = document.querySelector('.wrapper')
const orderLink = document.querySelector('.order')
const btnPopup = document.querySelector('.order-button')
const toGoRadio = document.getElementById('to-go')
const pickupPopup = document.getElementById('pickup-popup')
const dineInRadio = document.getElementById('dine-in')
const orderForm = document.getElementById('order-form')
const orderContainer = document.getElementById('orders-container')
const closeForm = document.querySelector('.close-form')
let counter = 1

const baseURL = 'http://localhost:5500/'

function placeOrder () {
    wrapper.classList.remove('active')
}

function orderWindow () {
    wrapper.classList.add('active-popup')
    orderForm.reset()
    const inOrGoRadio = document.querySelector(`input[name="in-or-go"]:checked`)
    if (!inOrGoRadio) {
        pickupPopup.style.display = 'none'
        document.getElementById('pickup-time').removeAttribute('required')
    }
}

function hideOrderWindow () {
    wrapper.classList.remove('active-popup')
}

function displayPickup () {
    if (toGoRadio.checked) {
        pickupPopup.style.display = 'block'
        document.getElementById('pickup-time').setAttribute('required', 'required')
    }
}

function hidePickup () {
    if (dineInRadio.checked) {
        pickupPopup.style.display = 'none'
        document.getElementById('pickup-time').removeAttribute('required')
    }
}

function submitOrder (event) {
    event.preventDefault()
    const name = document.getElementById('name').value
    const meal = document.getElementById('meal').value
    const sides = document.getElementById('sides').value
    const drink = document.getElementById('drink').value
    const inOrGoRadio = document.querySelector(`input[name="in-or-go"]:checked`).value
    const pickingUp = document.getElementById('pickup-time').value

    const inOrGo = inOrGoRadio ? inOrGoRadio.value : null;
    const pickupTime = document.getElementById('pickup-time') ? pickingUp : null;
    const diningPreference = inOrGo === 'To-Go' ? `To Go, Pickup Time: ${pickupTime}` : 'Dine in';

    let body = {name, meal, sides, drink, inOrGoRadio, pickingUp}

    axios.post('http://localhost:5500/order', body)
    .then((response) => {
        let data = response.data[0]
        let drinkid = data.drink_name
        let pickuptime = data.pickup_time

        axios.get('http://localhost:5500/order?drink_name=' + drinkid + '&pickup_time=' + pickuptime)
        .then((response) => {
            let {drink_name, pickup_time} = response.data[0]
            const order = document.createElement('div')
            order.classList.add('ordered-list')
            order.innerHTML = 
                `
                <p># ${counter}</p>
                <p>Name: ${name}</p>
                <p>Meal: ${meal} with ${sides}</p>
                <p>Drink: ${drink_name}</p>
                <p>${inOrGoRadio}</p>
                <p>${pickup_time}</p>
                <div class="bothOrderedButtons">
                <button class="orderedEditButton">Edit</button>
                <button class="orderedDeleteButton">Delete</button>
                </div>
                `
            orderContainer.appendChild(order)
            hideOrderWindow()
            counter += 1
        })
    })
}

orderLink.addEventListener('click', placeOrder)
btnPopup.addEventListener('click', orderWindow)
toGoRadio.addEventListener('change', displayPickup)
dineInRadio.addEventListener('change', hidePickup)
orderForm.addEventListener('submit', submitOrder)
closeForm.addEventListener('click', () => {
    wrapper.classList.toggle('active-popup')
})
