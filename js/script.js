document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
r
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  if (page === "home") {
    initWeatherWidget();
    initQuoteWidget();
  } else if (page === "events") {
    initEventFilters();
    initFavorites();
  } else if (page === "study") {
    initTodoList();
    initTimer();
  } else if (page === "dining") {
    initDiningFilter(); 
  }
});

function initWeatherWidget() {
  const locationEl = document.getElementById("weather-location");
  const tempEl = document.getElementById("weather-temp");
  const descEl = document.getElementById("weather-desc");
  const refreshBtn = document.getElementById("refresh-weather");

  if (!locationEl || !tempEl || !descEl || !refreshBtn) return;

  async function fetchWeather() {
    try {
      // WeatherAPI.com configuration
      const apiKey = "a9c142f7ef5d40949d030700250812";
      const city = "Newberry,SC";
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Weather request failed");

      const data = await response.json();

      locationEl.textContent = `${data.location.name}, ${data.location.region}`;
      tempEl.textContent = `${Math.round(data.current.temp_f)} °F`;
      descEl.textContent = data.current.condition.text;
    } catch (error) {
      console.error(error);
      locationEl.textContent = "Unavailable";
      tempEl.textContent = "--";
      descEl.textContent = "Unable to load weather.";
    }
  }

  refreshBtn.addEventListener("click", fetchWeather);
  fetchWeather();
}


function initQuoteWidget() {
  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");
  const newQuoteBtn = document.getElementById("new-quote");

  if (!quoteText || !quoteAuthor || !newQuoteBtn) return;

  async function fetchQuote() {
    try {
      const response = await fetch("https://api.quotable.io/random?tags=inspirational|motivational");
      if (!response.ok) throw new Error("Quote request failed");
      const data = await response.json();

      quoteText.textContent = data.content;
      quoteAuthor.textContent = data.author ? `— ${data.author}` : "— Unknown";
    } catch (error) {
      console.error(error);
      quoteText.textContent = "Unable to load quote. Try again.";
      quoteAuthor.textContent = "";
    }
  }

  newQuoteBtn.addEventListener("click", fetchQuote);

  fetchQuote();
}


function initEventFilters() {
  const filterButtons = document.querySelectorAll(".event-filter");
  const eventCards = document.querySelectorAll(".event-card");

  if (!filterButtons.length || !eventCards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {

      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      eventCards.forEach((card) => {
        const category = card.dataset.category;
        if (filter === "all" || category === filter) {
          card.classList.remove("d-none");
        } else {
          card.classList.add("d-none");
        }
      });
    });
  });
}


function initFavorites() {
  const favoritesList = document.getElementById("favorites-list");
  const favoritesEmptyText = document.getElementById("favorites-empty-text");
  const favoriteButtons = document.querySelectorAll(".favorite-btn");

  if (!favoritesList || !favoritesEmptyText || !favoriteButtons.length) return;

  let favorites = JSON.parse(localStorage.getItem("campusFavorites") || "[]");

  function renderFavorites() {
    favoritesList.innerHTML = "";
    if (favorites.length === 0) {
      favoritesEmptyText.style.display = "block";
      return;
    }

    favoritesEmptyText.style.display = "none";

    favorites.forEach((html) => {
      const wrapper = document.createElement("div");
      wrapper.className = "col-md-6";
      wrapper.innerHTML = html;
      favoritesList.appendChild(wrapper);
    });
  }

  favoriteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".event-card");
      if (!card) return;

      const cardHtml = card.outerHTML;

      const index = favorites.indexOf(cardHtml);
      if (index === -1) {
        favorites.push(cardHtml);
        btn.textContent = "★";
        btn.setAttribute("aria-label", "Remove this event from saved");
      } else {
        favorites.splice(index, 1);
        btn.textContent = "☆";
        btn.setAttribute("aria-label", "Save this event");
      }

      localStorage.setItem("campusFavorites", JSON.stringify(favorites));
      renderFavorites();
    });
  });

  renderFavorites();
}



function initTodoList() {
  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  const clearCompletedBtn = document.getElementById("clear-completed");

  if (!form || !input || !list || !clearCompletedBtn) return;

  let todos = JSON.parse(localStorage.getItem("campusTodos") || "[]");

  function saveTodos() {
    localStorage.setItem("campusTodos", JSON.stringify(todos));
  }

  function renderTodos() {
    list.innerHTML = "";

    todos.forEach((todo, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      if (todo.completed) li.classList.add("completed");

      const textSpan = document.createElement("span");
      textSpan.textContent = todo.text;

      const btnGroup = document.createElement("div");
      btnGroup.className = "btn-group btn-group-sm";

      const toggleBtn = document.createElement("button");
      toggleBtn.className = "btn btn-outline-success";
      toggleBtn.textContent = todo.completed ? "Undo" : "Done";
      toggleBtn.addEventListener("click", () => {
        todos[index].completed = !todos[index].completed;
        saveTodos();
        renderTodos();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-outline-danger";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
      });

      btnGroup.appendChild(toggleBtn);
      btnGroup.appendChild(deleteBtn);

      li.appendChild(textSpan);
      li.appendChild(btnGroup);
      list.appendChild(li);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    todos.push({ text: value, completed: false });
    input.value = "";
    saveTodos();
    renderTodos();
  });

  clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter((t) => !t.completed);
    saveTodos();
    renderTodos();
  });

  renderTodos();
}


function initTimer() {
  const display = document.getElementById("timer-display");
  const startBtn = document.getElementById("start-timer");
  const pauseBtn = document.getElementById("pause-timer");
  const resetBtn = document.getElementById("reset-timer");

  if (!display || !startBtn || !pauseBtn || !resetBtn) return;

  let duration = 25 * 60; 
  let remaining = duration;
  let intervalId = null;

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function updateDisplay() {
    display.textContent = formatTime(remaining);
  }

  function startTimer() {
    if (intervalId !== null) return; 
    intervalId = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        remaining = 0;
        clearInterval(intervalId);
        intervalId = null;
        alert("Time's up! Take a short break.");
      }
      updateDisplay();
    }, 1000);
  }

  function pauseTimer() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function resetTimer() {
    pauseTimer();
    remaining = duration;
    updateDisplay();
  }

  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);

  updateDisplay();
}

function initDiningFilter() {
  const select = document.getElementById("diet-filter");
  if (!select) return;

  select.addEventListener("change", () => {
    console.log("Selected dietary preference:", select.value);
  });
}
