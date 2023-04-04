const wrapper = document.querySelector('.wrapper')
const orderLink = document.querySelector('.order')
const btnPopup = document.querySelector('.order-button')
const toGoRadio = document.getElementById('to-go')
const pickupPopup = document.getElementById('pickup-popup')
const dineInRadio = document.getElementById('dine-in')
const orderForm = document.getElementById('order-form')
const orderContainer = document.querySelector('.orders-container')
const orderHistoryContainer = document.querySelector('.order-history-container')
const closeForm = document.querySelector('.close-form')
let formCounter = 1

const baseURL = 'http://localhost:5500/'

function orderHistory () {
    axios.get('/allorders')
    .then((response) => {
        let counter = 1

        response.data.forEach((element) => {
        let {name, meal, sides, drink_name, is_to_go, pickup_time} = element

        if (pickup_time === null) {
            pickup_time = ' '
        }

        const order = document.createElement('div')
                order.classList.add('ordered-list')
                order.innerHTML = 
                    `
                    <p># ${counter}</p>
                    <p>Name: ${name}</p>
                    <p>Meal: ${meal} with ${sides}</p>
                    <p>Drink: ${drink_name}</p>
                    <p>${is_to_go} ${pickup_time}</p>
                    <div class="bothOrderedButtons">
                    <button class="orderedEditButton">Edit</button>
                    <button class="orderedDeleteButton">Delete</button>
                    </div>
                    `
                orderHistoryContainer.appendChild(order)
                counter++
        })
    })
}

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

    let body = {name, meal, sides, drink, inOrGoRadio, pickingUp}

    axios.post('/order', body)
    .then((response) => {
        let data = response.data[0]
        let drinkid = data.drink_name
        let pickuptime = data.pickup_time

        axios.get('/ordered?drink_name=' + drinkid + '&pickup_time=' + pickuptime)
        .then((response) => {
            let {drink_name, pickup_time} = response.data[0]
            console.log(pickup_time)
            if (pickup_time === null) {
                pickup_time = ' '
            }
            const order = document.createElement('div')
            order.classList.add('ordered-list')
            order.innerHTML = 
                `
                <p># ${formCounter}</p>
                <p>Name: ${name}</p>
                <p>Meal: ${meal} with ${sides}</p>
                <p>Drink: ${drink_name}</p>
                <p>${inOrGoRadio} ${pickup_time}</p>
                <div class="bothOrderedButtons">
                <button class="orderedEditButton">Edit</button>
                <button class="orderedDeleteButton">Delete</button>
                </div>
                `
            orderContainer.appendChild(order)
            hideOrderWindow()
            formCounter++
        })
    })
}

window.addEventListener('load', orderHistory)
orderLink.addEventListener('click', placeOrder)
btnPopup.addEventListener('click', orderWindow)
toGoRadio.addEventListener('change', displayPickup)
dineInRadio.addEventListener('change', hidePickup)
orderForm.addEventListener('submit', submitOrder)
closeForm.addEventListener('click', () => {
    wrapper.classList.toggle('active-popup')
})
