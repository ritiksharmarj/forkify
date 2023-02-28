import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

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

      // Update results view to mark selected search results
      resultsView.update(model.getSearchResultsPage());

      // Updating bookmarks view
      bookmarksView.update(model.state.bookmarks);

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

// Pagination function to update the search results with current page
const controlPagination = (goToPage) => {
   // Render NEW search results
   resultsView.render(model.getSearchResultsPage(goToPage));

   // Render NEW pagination buttons
   paginationView.render(model.state.search);
};

const controlServings = (newServings) => {
   // Update the recipe servings (in state)
   model.updateServings(newServings);

   // Update the recipe view
   // recipeView.render(model.state.recipe);
   recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
   // 1. Add/remove bookmark
   if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
   else model.deleteBookmark(model.state.recipe.id);

   // 2. Update recipe view
   recipeView.update(model.state.recipe);

   // 3. Render bookmarks
   bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
   bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipeUpload = (newRecipe) => {
   console.log(newRecipe);

   // Upload the new recipe data
};

const init = () => {
   bookmarksView.addHandlerRender(controlBookmarks);
   recipeView.addHandlerRender(controlRecipes);
   recipeView.addHandlerUpdateServings(controlServings);
   recipeView.addHandlerAddBookmark(controlAddBookmark);
   searchView.addHandlerSearch(controlSearchResults);
   paginationView.addHandlerClick(controlPagination);
   addRecipeView.addHandlerUpload(controlAddRecipeUpload);
};
init();
