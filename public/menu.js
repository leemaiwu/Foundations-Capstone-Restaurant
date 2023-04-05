const submitNameBtn = document.querySelector('.submit-name')

const baseURL = 'http://localhost:5500/'

function nameSuggestion () {
    const suggestedName = document.getElementById('restaurant-name').value

    let body = {suggestedName}

    axios.post('/name', body)
    .then(() => {
    })
    .catch((err) => {
        console.log(err)
        alert('Error submitting name suggestion')
    })
    clearNameSuggestion()
}

function clearNameSuggestion () {
    document.getElementById('restaurant-name').value = ""
}

submitNameBtn.addEventListener('click', nameSuggestion)