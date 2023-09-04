const apiKey = 'a77ac1eb251367968851d8acde5cdc53';
const hash = '921538e4e015f172aec43d8203aa8497';
const ts = '1';

// Marvel official api
let url = `http://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${apiKey}&hash=${hash}`;

url = "https://akabab.github.io/superhero-api/api/all.json";

// To store the favorited super heros
let favorites = [];

// To toggle between home and favorites
let toShow = "HOME";
const homeBtnEl = document.getElementById("homeBtn");
const favBtnEl = document.getElementById("favBtn");

// Event listener to show favorites
favBtnEl.addEventListener("click", () => {
  toShow = "FAVORITES";
  document.querySelector(".cards-container").innerHTML = "";
  fetchData();
});

// Event listener to toggle back to the home page
homeBtnEl.addEventListener("click", () => {
  toShow = "HOME";
  document.querySelector(".cards-container").innerHTML = "";
  fetchData();
});

// This function fetches the data from the API and renders it on the DOM
const fetchData = async () => {
  try {
    // To get the data from the API.
    const response = await fetch(url);
    let data = await response.json();

    // If toShow is FAVORITES then favorites data is rendered on the DOM
    if (toShow === "FAVORITES") {
      data = favorites;
    }
    const comics = data;

    // Iterate over the data and render one by one
    comics.forEach((comic) => {
      // It creates the card element
      const card = document.createElement('div');
      card.classList.add('card');

      // Image element
      let image = `${comic?.images?.lg}`;
      let img = document.createElement('img');
      img.classList.add("card-img");
      img.src = image;
      img.alt = 'Comic Cover';
      card.appendChild(img);

      // Title element
      const title = document.createElement('div');
      title.classList.add('card-title');
      let name = comic?.biography?.fullName;
      if (!name || name?.length == 0) {
        name = comic?.name;
      }
      title.textContent = name;

      // Description Element
      const description = document.createElement('div');
      description.classList.add('card-description');
      description.textContent = comic?.work?.occupation;

      // Action buttons
      const actions = document.createElement('div');
      actions.classList.add('card-actions');

      // Show detail anchor link
      const convertedName = name.toLowerCase().replace(/ /g, "-");

      const link = document.createElement('a');
      link.textContent = 'Go to Hero Page';
      link.href = `https://www.marvel.com/characters/${convertedName}`;
      link.target = '_blank';

      link.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default link behavior
        window.open(link.href, '_blank'); // Open the URL in a new tab
      });

      // Favorite Button to add to favorites
      const favoriteButton = document.createElement('button');
      if (toShow === "HOME") {
        favoriteButton.textContent = 'Add to Favorites';
        favoriteButton.addEventListener('click', () => {
          favorites.push(comic);
          saveFavoritesToLocalStorage();
          alert(`Comic "${comic.name}" has been added to your favorites.`);
        });
      } else {
        favoriteButton.textContent = 'Remove From Favorites';
        favoriteButton.addEventListener('click', () => {
          favorites = favorites.filter((favComic) => favComic.name !== comic.name);
          saveFavoritesToLocalStorage();
          card.remove();
          alert(`Comic "${comic.name}" has been removed from the favorites.`);
        });
      }

      actions.appendChild(link);
      actions.appendChild(favoriteButton);

      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(actions);

      // It appends the card to the cards container
      document.querySelector('.cards-container').appendChild(card);
    });
  } catch (error) {
    console.error(error);
  }
};

// Function to save favorites to local storage
const saveFavoritesToLocalStorage = () => {
  localStorage.setItem('favorites', JSON.stringify(favorites));
};

// Function to load favorites from local storage
const loadFavoritesFromLocalStorage = () => {
  const storedFavorites = localStorage.getItem('favorites');
  if (storedFavorites) {
    favorites = JSON.parse(storedFavorites);
  }
};

// Load favorites from local storage on page load
loadFavoritesFromLocalStorage();

// fetchData() will be called for the very first time to render the data
fetchData();
