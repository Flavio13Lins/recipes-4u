const urlPost =
  "https://script.google.com/macros/s/AKfycbx7viZKs2_1Dx0r9wGJnchVfNjFwvK0BhZf1q5lGYdi-x0ZOreFfOJbUfKdsUvZxSdo/exec";
const urlGet =
  "https://script.google.com/macros/s/AKfycbywRz8G0HtKh9GdRezR8KCAHYpd9_LF8Y0yMOWmqba1Xfz9L6puekDU1lP7p6hLn-c/exec";

const dishesTypesImageMap = {
  Breakfast:
    "https://www.eatingwell.com/thmb/ZIsM-f-uVmqWx7JlJNsBFMCVOaY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/HashBrown-5-e1941c86066346e8a592e4c589d4933d.jpg",
  Brunch:
    "https://www.eatingwell.com/thmb/8fMwVWsZ0CI-_WbkYF7ZoThxr1k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/southwest-breakfast-skillet-dc3cdefe714e41f0a7407b1ecdb59d8a.jpg",
  Snack:
    "https://www.eatingwell.com/thmb/I6NRF7hmW6ksdD8VY7Npa8hP6_M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/baked-broccoli-cheddar-quinoa-bites-b6788e13b0614dd6a58917cd39ebd052.jpg",
  Lunch:
    "https://www.eatingwell.com/thmb/q2rvYFNneAOW9H1sBz03toE1DCA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/creamy-tomato-salmon-f1e766aa2ad7406eafba375f92504fac.jpg",
  Dessert:
    "https://www.southernliving.com/thmb/Trx1HnCYT8bR05Ln7TpL03VSGA8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/2644701_Lava_cake_134-2000-04036c204eec495f9ef8903a21b425ae.jpg",
  Drink:
    "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FPhoto%2FRecipes%2F2023-07-painkiller-cocktail%2FPainkiller-Cocktail_065",
  Dinner:
    "https://www.realsimple.com/thmb/LxM_HDq7JxFZ2RLyApNnIhOaxvA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/garlicky-layered-potatoes-recipe-1120foo-6b5e1d939de6490e971e7065f138b35f.jpg",
};

const loading = `<span class="loading loading-ring loading-lg text-success"></span>`;

async function getRecipeByIndex(index) {
  const res = await fetch(urlGet);
  const recipes = await res.json();
  return recipes[index];
}

async function loadPage() {
  const res = await fetch(urlGet);
  const recipes = await res.json();
  const recipesContainer = document.getElementById("recipes-container");

  recipesContainer.innerHTML = "";

  let index = 0;
  for (let event of recipes) {
    recipesContainer.innerHTML += `
    <div class="card w-64 bg-base-100 shadow-xl image-full">
    <figure><img src="${
      dishesTypesImageMap[event.Type]
    }" alt="event" /></figure>
      <div class="card-body">
        <div class="flex justify-end dropdown dropdown-end">
          <label tabindex="${index}" class="btn btn-xs btn-square btn-outline btn-success">✏️</label>
          <ul tabindex="${index}" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li class="btn btn-outline btn-xs btn-info" onclick="showEditModal(${index})"><a>Edit</a></li>
            <li class="btn btn-outline btn-xs btn-error" onclick="showDeleteModal(${index})"><a>Delete</a></li>
          </ul>
        </div>
        <h2 class="card-title">${event.Name}</h2>
        <p>${event.Type}<br/>from ${event.Location}</p>
        <div class="card-actions justify-end">
          <button class="btn btn-sm btn-outline btn-success" onclick="showDetailsModal(${index})">Details</button>
        </div>
      </div>
    </div>
    `;
    index += 1;
  }
}

async function showDetailsModal(index) {
  if (index >= 0) {
    document.getElementById("detailsName").innerHTML = loading;
    document.getElementById("detailsIngredients").innerHTML = loading;
    document.getElementById("detailsSteps").innerHTML = loading;
    document.getElementById("details").showModal();
    const selectedRecipe = await getRecipeByIndex(index);
    if (selectedRecipe) {
      document.getElementById("detailsName").innerText = selectedRecipe.Name;
      document.getElementById("detailsIngredients").innerText =
        selectedRecipe.Ingredients;
      document.getElementById("detailsSteps").innerText = selectedRecipe.Steps;
    }
  }
}

async function showEditModal(index) {
  if (index >= 0) {
    const selectedRecipe = await getRecipeByIndex(index);
    if (selectedRecipe) {
      document.getElementById("edit").showModal();

      document.getElementById("editRecipeIndexRow").value = index;
      document.getElementById("editRecipeName").value = selectedRecipe.Name;
      document.getElementById("editRecipeLocation").value =
        selectedRecipe.Location;
      document.getElementById("editRecipeType").value = selectedRecipe.Type;
      document.getElementById("editRecipeIngredients").value =
        selectedRecipe.Ingredients;
      document.getElementById("editRecipeSteps").value = selectedRecipe.Steps;
    }
  }
}

async function cancelEdit() {
  document.getElementById("editRecipeIndexRow").value = null;
  document.getElementById("editRecipeName").value = "";
  document.getElementById("editRecipeLocation").value = "";
  document.getElementById("editRecipeType").value = "Breakfast";
  document.getElementById("editRecipeIngredients").value = "";
  document.getElementById("editRecipeSteps").value = "";
}

async function showDeleteModal(index) {
  if (index >= 0) {
    document.getElementById("deleteRecipeIndexRow").value = index;
    document.getElementById("delete").showModal();
  }
}

async function cancelDelete() {
  document.getElementById("deleteRecipeIndexRow").value = null;
}

function resetFormValues() {
  document.getElementById("editRecipeIndexRow").value = null;
  document.getElementById("editRecipeName").value = "";
  document.getElementById("editRecipeLocation").value = "";
  document.getElementById("editRecipeType").value = "Breakfast";
  document.getElementById("editRecipeIngredients").value = "";
  document.getElementById("editRecipeSteps").value = "";

  document.getElementById("deleteRecipeIndexRow").value = null;

  document.getElementById("newRecipeName").value = "";
  document.getElementById("newRecipeLocation").value = "";
  document.getElementById("newRecipeType").value = "Breakfast";
  document.getElementById("newRecipeIngredients").value = "";
  document.getElementById("newRecipeSteps").value = "";
}

async function insertRecipe() {
  var name = document.getElementById("newRecipeName").value;
  var location = document.getElementById("newRecipeLocation").value;
  var type = document.getElementById("newRecipeType").value;
  var ingredients = document.getElementById("newRecipeIngredients").value;
  var steps = document.getElementById("newRecipeSteps").value;
  if (name && location && type) {
    const data = {
      action: "insert",
      name,
      type,
      location,
      ingredients,
      steps,
    };

    let options = {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    document.getElementById("recipes-container").innerHTML = loading;

    await fetch(urlPost, options)
      .then((response) => console.log("Request sent:", { response }))
      .catch((error) => console.error("Error sending request:", error));

    resetFormValues();
    await loadPage();
  }
}

async function editRecipe() {
  var rowIndex = document.getElementById("editRecipeIndexRow").value;

  var name = document.getElementById("editRecipeName").value;
  var location = document.getElementById("editRecipeLocation").value;
  var type = document.getElementById("editRecipeType").value;
  var ingredients = document.getElementById("editRecipeIngredients").value;
  var steps = document.getElementById("editRecipeSteps").value;

  if (rowIndex >= 0 && name && location && type) {
    const data = {
      action: "update",
      rowIndex,
      name,
      type,
      location,
      ingredients,
      steps,
    };

    let options = {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    document.getElementById("recipes-container").innerHTML = loading;

    await fetch(urlPost, options)
      .then((response) => console.log("Update sent:", { response }))
      .catch((error) => console.error("Error sending request:", error));

    resetFormValues();
    await loadPage();
  }
}

async function deleteRecipe() {
  var rowIndex = document.getElementById("deleteRecipeIndexRow").value;

  if (rowIndex >= 0) {
    document.getElementById("recipes-container").innerHTML = loading;

    const data = {
      action: "delete",
      rowIndex,
    };

    let options = {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    await fetch(urlPost, options)
      .then((response) => console.log("Delete sent:", { response }))
      .catch((error) => console.error("Error sending request:", error));

    resetFormValues();
    await loadPage();
  }
}

loadPage();
resetFormValues();
