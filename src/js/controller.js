import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// Single recipe section function
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

// Render all the recipes for query in recipe search results section
const controlSearchResults = async () => {
   try {
      resultsView.renderSpinner();

      // Get query from the search input field
      const query = searchView.getQuery();

      // Return nothing if there is no query
      if (!query) return;

      // Load search results
      await model.loadSearchResults(query);

      // Render search results
      // resultsView.render(model.state.search.results);
      resultsView.render(model.getSearchResultsPage());

      // Render initial pagination buttons
      paginationView.render(model.state.search);
   } catch (error) {
      console.log(error);
   }
};

const controlPagination = (goToPage) => {
   // Render NEW search results
   resultsView.render(model.getSearchResultsPage(goToPage));

   // Render NEW pagination buttons
   paginationView.render(model.state.search);
};

const init = () => {
   recipeView.addHandlerRender(controlRecipes);
   searchView.addHandlerSearch(controlSearchResults);
   paginationView.addHandlerClick(controlPagination);
};
init();
