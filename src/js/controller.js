import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async () => {
   try {
      // Get hash id from the url like #5ed6604591c37cdc054bcb37
      const id = window.location.hash.slice(1);

      // Return nothing if there is no id
      if (!id) return;

      // Render spinner before fetching and loading the recipe
      recipeView.renderSpinner();

      // Loading recipe
      await model.loadRecipe(id);

      // Rendering recipe
      recipeView.render(model.state.recipe);
   } catch (error) {
      recipeView.renderError();
   }
};

const init = () => {
   recipeView.addHandlerRender(controlRecipes);
};
init();
