const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
   return new Promise(function (_, reject) {
      setTimeout(function () {
         reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
   });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const showRecipe = async () => {
   try {
      const response = await fetch(
         'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
      );
      const data = await response.json();

      if (!response.ok) throw new Error(`${data.message} (${response.status})`);

      let { recipe } = data.data;
      recipe = {
         cookingTime: recipe.cooking_time,
         id: recipe.id,
         image: recipe.image_url,
         ingredients: recipe.ingredients,
         publisher: recipe.publisher,
         servings: recipe.servings,
         sourceUrl: recipe.source_url,
         title: recipe.title,
      };

      console.log(recipe);
   } catch (error) {
      alert(error.message);
   }
};
showRecipe();
