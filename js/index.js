let Meals = document.getElementById("Meals");
let SearchContainer = document.getElementById("SearchContainer");
let ContactUs = document.getElementById("contact-us");
const loadingScreen = document.querySelector(".loading-screen");

const hideLoadingScreen = () => {
  loadingScreen.style.display = "none";
};
const showLoadingScreen = () => {
  loadingScreen.style.display = "flix";
};

sidWidth = $(".Sidebar").width();
let row = $(".Home .container");
row.width(row.width() - sidWidth);

function openSidebar() {
  $(".Sidebar").animate({left: "0px"}, 500);
  $(".Sidebar i.open-close-icon").addClass("fa-x");
  $(".Sidebar i.open-close-icon").removeClass("fa-align-justify");
  for (let i = 0; i < 5; i++) {
    $(".Sidebar .Links li")
      .eq(i)
      .animate({top: 0}, (i + 5) * 200);
  }

  row.width(row.width() - sidWidth);
}
function closeSidebar() {
  let boxWidth = $(".Main-header").outerWidth();
  $(".Sidebar").animate({left: -boxWidth}, 500);
  $(".Sidebar i.open-close-icon").removeClass("fa-x");
  $(".Sidebar i.open-close-icon").addClass("fa-align-justify");
  $(".Sidebar .Links li").animate({top: 300}, 500);

  row.width(row.width() + sidWidth);
}

$(".Sidebar i.open-close-icon").click(() => {
  if ($(".Sidebar").css("left") == "0px") {
    closeSidebar();
  } else {
    openSidebar();
  }
});

function firstReload() {
  SearchContainer.innerHTML = "";
  searchByName(" ");
  ContactUs.classList.replace("d-flex", "d-none");
  Meals.classList.replace("d-none", "d-flex");
}

firstReload();

async function searchByName(value) {
  showLoadingScreen();

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`
  );
  response = await response.json();

  response.meals ? displayMeals(response.meals) : displayMeals([]);
  closeSidebar();
  hideLoadingScreen();
}

async function searchByFirstLetter(value) {
  showLoadingScreen();
  value == "" ? (value = "a") : "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${value}`
  );
  response = await response.json();

  response.meals ? displayMeals(response.meals) : displayMeals([]);
  hideLoadingScreen();
  closeSidebar();
}

function showSearchInputs() {
  ContactUs.classList.replace("d-flex", "d-none");
  Meals.classList.replace("d-none", "d-flex");
  SearchContainer.innerHTML = `
      <div class="row ps-5 py-5">
          <div class="col-md-6">
              <input onkeyup="searchByName(this.value)" class="form-control  border-top-0 border-start-0 border-end-0 " type="text" placeholder="Search By Name">
          </div>
          <div class="col-md-6">
              <input onkeyup="searchByFirstLetter(this.value)" maxlength="1" class="form-control  border-top-0 border-start-0 border-end-0 " type="text" placeholder="Search By First Litter...">
          </div>
      </div>
  `;
  Meals.innerHTML = "";
  closeSidebar();
}

//Meals
function displayMeals(array) {
  const mealsHTML = array
    .slice(0, 20)
    .map(
      (item) => `
      <div class=".col-12 col-md-6 col-lg-4 col-xl-3">
          <div onclick="getMealDetails('${item.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
              <img class="w-100" src="${item.strMealThumb}" alt="">
              <div class="meal-layer p-2 position-absolute d-flex align-items-center text-black">
                  <h3>${item.strMeal}</h3>
              </div>
          </div>
      </div> 
  `
    )
    .join("");
  Meals.innerHTML = mealsHTML;
  window.scrollTo(0, 0);
}

async function getMealDetails(mealID) {
  ContactUs.classList.replace("d-flex", "d-none");
  Meals.classList.replace("d-none", "d-flex");
  SearchContainer.innerHTML = "";
  showLoadingScreen();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  response = await response.json();
  displayMealDetails(response.meals[0]);
  closeSidebar();
  hideLoadingScreen();
}
function displayMealDetails(meal) {
  let ingredients = ``;
  for (let i = 0; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="my-1 mx-1 p-1 alert-success bg-white rounded text-black">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }
  let tags = meal.strTags?.split(",");
  if (!tags) tags = [];
  let tagsStr = "";
  console.log(tags);
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `<li class="my-3 mx-1 p-1 alert-success bg-white text-black rounded">${tags[i]}</li>`;
  }
  const mealsHTML = `
  <div class="col-md-4">
    <img class="w-100" src="${meal.strMealThumb}" alt="">
    <h2 class="text-center">${meal.strMeal}</h2>
  </div>
  <div class="col-md-8">
    <h2>Instructions</h2>
    <p class="lh-sm">${meal.strInstructions}</p>
    <h5>Areas : <span>${meal.strArea}</span></h5>
    <h5>Category : <span>${meal.strCategory}</span></h5>
    <h5>Recipes : <br>
      <div>
        <ul class="d-flex lh-1 flex-wrap list-unstyled">
          ${ingredients}
        </ul>
      </div>
    </h5>
    ${
      tagsStr
        ? `<h5>Tags : <br>
      <ul class="d-flex lh-1 flex-wrap list-unstyled">
        ${tagsStr}
      </ul>
    </h5>`
        : ""
    }

    <a class="btn btn-success text-white" target="_blank" href="${
      meal.strSource
    }">Source</a>
    <a class="btn btn-danger text-white" target="_blank" href="${
      meal.strYoutube
    }">Youtube</a>
  </div>
  `;
  Meals.innerHTML = mealsHTML;
  window.scrollTo(0, 0);
}

//Category
async function getCategories() {
  ContactUs.classList.replace("d-flex", "d-none");
  Meals.classList.replace("d-none", "d-flex");
  SearchContainer.innerHTML = "";
  showLoadingScreen();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  response = await response.json();
  displayCategories(response.categories);
  closeSidebar();
  hideLoadingScreen();
}
function displayCategories(array) {
  const mealsHTML = array
    .map(
      (item) => `
      <div class="col-xl-3 col-lg-6">
          <div onclick="getCategoryMeals('${
            item.strCategory
          }')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
              <img class="w-100" src="${item.strCategoryThumb}" alt="">
              <div class="meal-layer p-2 position-absolute text-center text-black">
                  <h3>${item.strCategory}</h3>
                  <p>${item.strCategoryDescription
                    .split(" ")
                    .slice(0, 21)
                    .join(" ")}<p/>
              </div>
          </div>
      </div> 
  `
    )
    .join("");
  Meals.innerHTML = mealsHTML;
}
async function getCategoryMeals(category) {
  showLoadingScreen();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  response = await response.json();
  displayMeals(response.meals.slice(0, 20));
  hideLoadingScreen();
  closeSidebar();
}
//

//Area
async function getArea() {
  ContactUs.classList.replace("d-flex", "d-none");
  Meals.classList.replace("d-none", "d-flex");
  showLoadingScreen();
  SearchContainer.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  response = await response.json();
  displayArea(response.meals);
  closeSidebar();
  hideLoadingScreen();
}

function displayArea(array) {
  const mealsHTML = array
    .map(
      (item) => `
      <div class="col-xl-3 col-lg-6">
          <div onclick="getAreaMeals('${item.strArea}')" class="rounded-2 text-center cursor-pointer">
              <i class="fa-solid fa-city fa-3x text-danger"></i>
              <h3>${item.strArea}</h3>
          </div>
      </div> 
  `
    )
    .join("");
  Meals.innerHTML = mealsHTML;
}
async function getAreaMeals(area) {
  showLoadingScreen();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  response = await response.json();
  displayMeals(response.meals.slice(0, 20));
  closeSidebar();
  hideLoadingScreen();
}
//

//Ingredient
async function getIngredient() {
  showLoadingScreen();
  ContactUs.classList.replace("d-flex", "d-none");
  Meals.classList.replace("d-none", "d-flex");
  SearchContainer.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  response = await response.json();
  displayIngredient(response.meals.slice(0, 25));
  closeSidebar();
  hideLoadingScreen();
}
function displayIngredient(array) {
  const mealsHTML = array
    .map(
      (item) => `
      <div class="col-xl-3 col-lg-6">
          <div onclick="getIngredientMeals('${
            item.strIngredient
          }')" class="rounded-2 text-center cursor-pointer">
              <i class="fa-solid fa-bowl-food fa-3x green-color"></i>
              <h3>${item.strIngredient}</h3>
              <p>${item.strDescription.split(" ").slice(0, 21).join(" ")}<p/>
          </div>
      </div> 
  `
    )
    .join("");
  Meals.innerHTML = mealsHTML;
}
async function getIngredientMeals(ingredient) {
  showLoadingScreen();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  response = await response.json();
  displayMeals(response.meals.slice(0, 20));
  closeSidebar();
  hideLoadingScreen();
}
//
function showContactUs() {
  SearchContainer.innerHTML = "";
  Meals.classList.replace("d-flex", "d-none");
  ContactUs.classList.replace("d-none", "d-flex");
  closeSidebar();
}
// contact
const userName = document.getElementById("name");
const userEmail = document.getElementById("email");
const userPhone = document.getElementById("phone");
const userAge = document.getElementById("age");
const userPassword = document.getElementById("password");
const userRePassword = document.getElementById("rePassword");
const userNameAlert = document.getElementById("namealert");
const userEmailAlert = document.getElementById("emailalert");
const userPhoneAlert = document.getElementById("phonealert");
const userAgeAlert = document.getElementById("agealert");
const userpasswordAlert = document.getElementById("passwordalert");
const userRepasswordAlert = document.getElementById("repasswordalert");
userName.addEventListener("focus", () => {
  nameToached = true;
});
userEmail.addEventListener("focus", () => {
  emailToached = true;
});
userPhone.addEventListener("focus", () => {
  phoneToached = true;
});
userAge.addEventListener("focus", () => {
  ageToached = true;
});
userPassword.addEventListener("focus", () => {
  passwordToached = true;
});
userRePassword.addEventListener("focus", () => {
  repasswordToached = true;
});

let nameToached = false,
  emailToached = false,
  phoneToached = false,
  ageToached = false,
  passwordToached = false,
  repasswordToached = false;

function validation() {
  if (nameToached) {
    if (userNameValid()) {
      userName.classList.remove("is-invalid");
      userName.classList.add("is-valid");
      userNameAlert.classList.replace("d-block", "d-none");
    } else {
      userName.classList.replace("is-valid", "is-invalid");
      userNameAlert.classList.replace("d-none", "d-block");
    }
  }

  if (emailToached) {
    if (userEmailValid()) {
      userEmail.classList.remove("is-invalid");
      userEmail.classList.add("is-valid");
      userEmailAlert.classList.replace("d-block", "d-none");
    } else {
      userEmail.classList.replace("is-valid", "is-invalid");
      userEmailAlert.classList.replace("d-none", "d-block");
    }
  }

  if (phoneToached) {
    if (userPhoneValid()) {
      userPhone.classList.remove("is-invalid");
      userPhone.classList.add("is-valid");
      userPhoneAlert.classList.replace("d-block", "d-none");
    } else {
      userPhone.classList.replace("is-valid", "is-invalid");
      userPhoneAlert.classList.replace("d-none", "d-block");
    }
  }

  if (ageToached) {
    if (userAgeValid()) {
      userAge.classList.remove("is-invalid");
      userAge.classList.add("is-valid");
      userAgeAlert.classList.replace("d-block", "d-none");
    } else {
      userAge.classList.replace("is-valid", "is-invalid");
      userAgeAlert.classList.replace("d-none", "d-block");
    }
  }

  if (passwordToached) {
    if (userPasswordValid()) {
      userPassword.classList.remove("is-invalid");
      userPassword.classList.add("is-valid");
      userpasswordAlert.classList.replace("d-block", "d-none");
    } else {
      userPassword.classList.replace("is-valid", "is-invalid");
      userpasswordAlert.classList.replace("d-none", "d-block");
    }
  }

  if (repasswordToached) {
    if (userRePasswordValid()) {
      userRePassword.classList.remove("is-invalid");
      userRePassword.classList.add("is-valid");
      userRepasswordAlert.classList.replace("d-block", "d-none");
    } else {
      userRePassword.classList.replace("is-valid", "is-invalid");
      userRepasswordAlert.classList.replace("d-none", "d-block");
    }
  }

  if (
    userNameValid() &&
    userEmailValid() &&
    userPhoneValid() &&
    userAgeValid() &&
    userPasswordValid() &&
    userRePasswordValid()
  ) {
    document.getElementById("submitBtn").removeAttribute("disabled");
  } else {
    document.getElementById("submitBtn").setAttribute("disabled", "true");
  }
}

function userNameValid() {
  return /^[a-zA-Z ]+$/.test(userName.value);
}

function userEmailValid() {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    userEmail.value
  );
}

function userPhoneValid() {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
    userPhone.value
  );
}

function userAgeValid() {
  return /^[1-9][0-9]?$|^100$/.test(userAge.value);
}

function userPasswordValid() {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(userPassword.value);
}

function userRePasswordValid() {
  return userPassword.value == userRePassword.value;
}
