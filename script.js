// Hamburger Menu Toggle
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobile-nav");

hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("active");
  mobileNav.classList.toggle("active");
});

// Close mobile nav when a link is clicked
const mobileLinks = mobileNav.querySelectorAll("a");
mobileLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    hamburger.classList.remove("active");
    mobileNav.classList.remove("active");
  });
});

// 1. Random User Generator
const generateUserBtn = document.getElementById("generate-user-btn");
const userContainer = document.getElementById("user-container");
const userLoading = document.getElementById("user-loading");

generateUserBtn.addEventListener("click", function () {
  userLoading.style.display = "block";

  fetch("https://randomuser.me/api/")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      userLoading.style.display = "none";
      const user = data.results[0];

      const card = document.createElement("div");
      card.className = "user-card";

      card.innerHTML =
        '<img src="' +
        user.picture.large +
        '" alt="Profile Picture">' +
        '<p class="user-name">' +
        user.name.first +
        " " +
        user.name.last +
        "</p>" +
        '<p class="user-detail"><span class="user-label">Email:</span> ' +
        user.email +
        "</p>" +
        '<p class="user-detail"><span class="user-label">Country:</span> ' +
        user.location.country +
        "</p>";

      userContainer.appendChild(card);
    })
    .catch(function () {
      userLoading.style.display = "none";
      alert("Failed to fetch user data. Please try again.");
    });
});

// 2. Weather Search
const searchWeatherBtn = document.getElementById("search-weather-btn");
const cityInput = document.getElementById("city-input");
const weatherContainer = document.getElementById("weather-container");
const weatherLoading = document.getElementById("weather-loading");

function getWeatherCondition(code) {
  const conditions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return conditions[code] || "Unknown";
}

searchWeatherBtn.addEventListener("click", function () {
  const city = cityInput.value.trim();
  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  weatherContainer.innerHTML = "";
  weatherLoading.style.display = "block";

  fetch(
    "https://geocoding-api.open-meteo.com/v1/search?name=" +
      encodeURIComponent(city) +
      "&count=1",
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (geoData) {
      if (!geoData.results || geoData.results.length === 0) {
        weatherLoading.style.display = "none";
        weatherContainer.innerHTML =
          '<p class="weather-error">City not found. Please try another city.</p>';
        return;
      }

      const lat = geoData.results[0].latitude;
      const lon = geoData.results[0].longitude;
      const cityName = geoData.results[0].name;
      const country = geoData.results[0].country || "";

      return fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=" +
          lat +
          "&longitude=" +
          lon +
          "&current_weather=true",
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (weatherData) {
          weatherLoading.style.display = "none";
          const weather = weatherData.current_weather;

          const card = document.createElement("div");
          card.className = "weather-card";

          card.innerHTML =
            "<h3>" +
            cityName +
            ", " +
            country +
            "</h3>" +
            '<div class="weather-detail"><span class="weather-label">Temperature</span><span>' +
            weather.temperature +
            "°C</span></div>" +
            '<div class="weather-detail"><span class="weather-label">Wind Speed</span><span>' +
            weather.windspeed +
            " km/h</span></div>" +
            '<div class="weather-detail"><span class="weather-label">Condition</span><span>' +
            getWeatherCondition(weather.weathercode) +
            "</span></div>";

          weatherContainer.innerHTML = "";
          weatherContainer.appendChild(card);
        });
    })
    .catch(function () {
      weatherLoading.style.display = "none";
      weatherContainer.innerHTML =
        '<p class="weather-error">Failed to fetch weather data. Please try again.</p>';
    });
});

cityInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchWeatherBtn.click();
  }
});

// 3. Dynamic To-Do List
const addTodoBtn = document.getElementById("add-todo-btn");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(function (task) {
    createTaskElement(task.text, task.completed);
  });
}

function saveTasks() {
  const tasks = [];
  const items = todoList.querySelectorAll("li");
  items.forEach(function (item) {
    tasks.push({
      text: item.querySelector(".todo-text").textContent,
      completed: item.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTaskElement(text, completed) {
  const li = document.createElement("li");
  if (completed) {
    li.className = "completed";
  }

  const span = document.createElement("span");
  span.className = "todo-text";
  span.textContent = text;
  span.addEventListener("click", function () {
    li.classList.toggle("completed");
    saveTasks();
  });

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "todo-actions";

  const completeBtn = document.createElement("button");
  completeBtn.className = "complete-btn";
  completeBtn.textContent = "Complete";
  completeBtn.addEventListener("click", function () {
    li.classList.toggle("completed");
    saveTasks();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", function () {
    todoList.removeChild(li);
    saveTasks();
  });

  actionsDiv.appendChild(completeBtn);
  actionsDiv.appendChild(deleteBtn);
  li.appendChild(span);
  li.appendChild(actionsDiv);
  todoList.appendChild(li);
}

addTodoBtn.addEventListener("click", function () {
  const text = todoInput.value.trim();
  if (text === "") {
    alert("Please enter a task.");
    return;
  }
  createTaskElement(text, false);
  saveTasks();
  todoInput.value = "";
});

todoInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTodoBtn.click();
  }
});

loadTasks();

// 4. Live Search Filter
const products = [
  {
    name: "Laptop",
    price: "$899.99",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    link: "https://www.amazon.com/s?k=laptop",
  },
  {
    name: "Phone",
    price: "$699.99",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    link: "https://www.amazon.com/s?k=phone",
  },
  {
    name: "Headphones",
    price: "$199.99",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    link: "https://www.amazon.com/s?k=headphones",
  },
  {
    name: "Keyboard",
    price: "$129.99",
    image:
      "https://images.unsplash.com/photo-1561112078-7d24e04c3407?w=400&h=300&fit=crop",
    link: "https://www.amazon.com/s?k=keyboard",
  },
  {
    name: "Mouse",
    price: "$59.99",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    link: "https://www.amazon.com/s?k=mouse",
  },
  {
    name: "Camera",
    price: "$1,299.99",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
    link: "https://www.amazon.com/s?k=camera",
  },
  {
    name: "Smartwatch",
    price: "$349.99",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    link: "https://www.amazon.com/s?k=smartwatch",
  },
  {
    name: "Tablet",
    price: "$499.99",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
    link: "https://www.amazon.com/s?k=tablet",
  },
  {
    name: "Speaker",
    price: "$149.99",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
    link: "https://www.amazon.com/s?k=speaker",
  },
  {
    name: "Monitor",
    price: "$399.99",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
    link: "https://www.amazon.com/s?k=monitor",
  },
];

const productSearch = document.getElementById("product-search");
const productList = document.getElementById("product-list");

function renderProducts(list) {
  productList.innerHTML = "";

  if (list.length === 0) {
    productList.innerHTML =
      '<p style="text-align:center; color:#999; padding:20px; grid-column: 1/-1;">No products found.</p>';
    return;
  }

  list.forEach(function (product) {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML =
      '<img src="' +
      product.image +
      '" alt="' +
      product.name +
      '">' +
      '<div class="product-info">' +
      "<h3>" +
      product.name +
      "</h3>" +
      '<p class="product-price">' +
      product.price +
      "</p>" +
      '<a href="' +
      product.link +
      '" target="_blank" class="buy-btn">Buy Now</a>' +
      "</div>";

    productList.appendChild(card);
  });
}

renderProducts(products);

productSearch.addEventListener("input", function () {
  const query = productSearch.value.toLowerCase().trim();
  const filtered = products.filter(function (product) {
    return product.name.toLowerCase().includes(query);
  });
  renderProducts(filtered);
});
