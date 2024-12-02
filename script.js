const apiKey = "*********";
const apiUrl = "https://api.spoonacular.com/recipes/findByIngredients";

const searchButton = document.getElementById("searchButton");
const ingredientInput = document.getElementById("ingredientInput");
const recipesContainer = document.getElementById("recipesContainer");

searchButton.addEventListener("click", () => {
  const ingredients = ingredientInput.value.trim();

  if (ingredients === "") {
    alert("Please enter some ingredients.");
    return;
  }

  async function fetchRecipes(ingredients) {
    try {
      // Construct the API URL
      const url = `${apiUrl}?ingredients=${encodeURIComponent(ingredients)}&number=10&apiKey=${apiKey}`;
  
      // Fetch data from the API
      const response = await fetch(url);
  
      // Check if the response is OK (status 200-299)
      if (!response.ok) {
        // Handle specific HTTP status codes
        if (response.status === 401) {
          throw new Error("Invalid API key. Please check your API key and try again.");
        } else if (response.status === 403) {
          throw new Error("API rate limit exceeded. Please wait and try again later.");
        } else if (response.status === 404) {
          throw new Error("The requested data was not found. Please check your query.");
        } else {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
      }
  
      // Parse the JSON response
      const data = await response.json();
  
      // Check if the API returned any recipes
      if (!data || data.length === 0) {
        throw new Error("No recipes found for the given ingredients. Please try different ingredients.");
      }
  
      // If everything is fine, display the recipes
      displayRecipes(data);
    } catch (error) {
      // Catch network errors or any other unexpected errors
      console.error(error);
      recipesContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
  }  

function displayRecipes(recipes) {
  recipesContainer.innerHTML = ""; // Clear previous results

  if (recipes.length === 0) {
    recipesContainer.innerHTML = "<p>No recipes found. Try different ingredients.</p>";
    return;
  }

  recipes.forEach(recipe => {
    const recipeCard = document.createElement("div");
    recipeCard.className = "recipe-card";

    recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
    `;

    recipesContainer.appendChild(recipeCard);
  });
}

