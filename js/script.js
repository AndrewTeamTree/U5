const randomUserUrl =
  'https://randomuser.me/api/?results=12&inc=dob,name,gender,location,phone,email,picture'
const gallery = document.getElementById('gallery')

// Add a search bar and select its input and button elements
const header = document.querySelector('header')
const searchHTML = `  <form action="#" method="get">
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
      <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>`
header.insertAdjacentHTML('beforeend', searchHTML)

fetch('http://localhost:3000/fetch-random-users')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Process the data as needed
    })
    .catch(error => console.error('Error fetching data from proxy server:', error));


function showModal(user) {
  const modalContainer = document.createElement('div')
  modalContainer.classList.add('modal-container')
  modalContainer.innerHTML = `
    <div class="modal">
      <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
      <div class="modal-info-container">
        ${
          user.picture
            ? `<img class="modal-img" src="${user.picture.large}" alt="profile picture">`
            : ''
        }
        <h3 class="modal-name cap">${user.name.first || ''} ${
    user.name.last || ''
  }</h3>
        <p class="modal-text">${user.email || ''}</p>
        <p class="modal-text cap">${user.location.city || ''}</p>
        <hr>
        ${user.phone ? `<p class="modal-text">${user.phone}</p>` : ''}
        ${
          user.location.street
            ? `<p class="modal-text">${user.location.street.number || ''} ${
                user.location.street.name || ''
              }, ${user.location.city || ''}, ${user.location.state || ''} ${
                user.location.postcode || ''
              }</p>`
            : ''
        }
        ${
          user.dob
            ? `<p class="modal-text">Birthday: ${new Date(
                user.dob.date
              ).toLocaleDateString()}</p>`
            : ''
        }
      </div>
    </div>
    <div class="modal-btn-container">
      <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
      <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
  `

  // Append modal to body
  document.body.appendChild(modalContainer)

  // Event listeners for modal navigation buttons
  const prevButton = modalContainer.querySelector('#modal-prev')
  prevButton.addEventListener('click', () => {
    handleModalNavigation('prev')
    modalContainer.remove()
  })

  const nextButton = modalContainer.querySelector('#modal-next')
  nextButton.addEventListener('click', (e) => {
    handleModalNavigation('next')
    modalContainer.remove()
  })

  // Close modal when close button is clicked
  const closeButton = modalContainer.querySelector('#modal-close-btn')
  closeButton.addEventListener('click', () => {
    modalContainer.remove() // Remove the modal from the DOM
  })
}

// Function to handle modal navigation
function handleModalNavigation(direction) {
  if (direction === 'next') {
    currentIndex = (currentIndex + 1) % users.length // Increment index or loop back to 0 if at the end
  } else if (direction === 'prev') {
    currentIndex = (currentIndex - 1 + users.length) % users.length // Decrement index or loop back to the end if at 0
  }

  const user = users[currentIndex]
  showModal(user)
}

let users = [] // Array to store the fetched users
let currentIndex = 0 // Index of the currently displayed user

// Fetch user data from the API
fetch(randomUserUrl)
  .then((response) => response.json())
  .then((data) => {
    // Store the fetched users
    users = data.results
    // Process the fetched data and display it in the gallery
    displayGallery(users)
  })
  .catch((error) => console.error('Error fetching data:', error))

// Function to display user profiles in the gallery
function displayGallery(users) {
  users.forEach((user) => {
    generateHTML(user)
  })
}

// Generate the markup for each profile
function generateHTML(user) {
  const card = document.createElement('div')
  card.classList.add('card')
  card.innerHTML = `
    <div class="card-img-container">
      <img class="card-img" src="${user.picture.medium}" alt="profile picture">
    </div>
    <div class="card-info-container">
      <h3 class="card-name cap">${user.name.first} ${user.name.last}</h3>
      <p class="card-text">${user.email}</p>
      <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
    </div>
  `

  // Add event listener to each card
  card.addEventListener('click', () => {
    showModal(user)
  })

  gallery.appendChild(card)
}

// Add event listener for the search input
const searchInput = document.getElementById('search-input')
searchInput.addEventListener('input', () => {
  const currentValue = searchInput.value.trim().toLowerCase()
  const cards = document.querySelectorAll('.card')

  cards.forEach((card) => {
    const name = card
      .querySelector('.card-name')
      .textContent.trim()
      .toLowerCase()
    if (name.includes(currentValue)) {
      card.style.display = 'block'
    } else {
      card.style.display = 'none'
    }
  })
})
