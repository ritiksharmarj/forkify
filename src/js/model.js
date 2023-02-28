import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
   recipe: {},
   search: {
      query: '',
      results: [],
      page: 1,
      resultsPerPage: RES_PER_PAGE,
   },
   bookmarks: [],
};

const createRecipeObject = (data) => {
   const { recipe } = data.data;
   return {
      cookingTime: recipe.cooking_time,
      id: recipe.id,
      image: recipe.image_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      servings: recipe.servings,
      sourceUrl: recipe.source_url,
      title: recipe.title,
      ...(recipe.key && { key: recipe.key }),
   };
};

/**
 * This function returns nothing but just update state recipe object
 * This function works for the result recipe section
 */
export const loadRecipe = async (id) => {
   try {
      const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

      state.recipe = createRecipeObject(data);

      if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
         state.recipe.bookmarked = true;
      } else {
         state.recipe.bookmarked = false;
      }
   } catch (error) {
      throw error;
   }
};

/**
 * This function returns nothing but just update state search object
 * This function works for the search results recipe section
 */
export const loadSearchResults = async (query) => {
   try {
      state.search.query = query;

      const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

      state.search.results = data.data.recipes.map((recipe) => {
         return {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            image: recipe.image_url,
            ...(recipe.key && { key: recipe.key }),
         };
      });

      // Set page = 1 for every new search results
      state.search.page = 1;
   } catch (error) {
      throw error;
   }
};

// Pagination function
export const getSearchResultsPage = (page = state.search.page) => {
   // Update page state with current page
   state.search.page = page;

   // At a time, we'll have 10 results
   const start = (page - 1) * state.search.resultsPerPage; // array starts at index 0
   const end = page * state.search.resultsPerPage; // so if page = 1 then there will be 10 results

   return state.search.results.slice(start, end);
};

export const updateServings = (newServings) => {
   state.recipe.ingredients.forEach((ingredient) => {
      // newQuantity = oldQuantity * newServings / oldServings (2 * 8 / 4 = 4)
      ingredient.quantity =
         (ingredient.quantity * newServings) / state.recipe.servings;
   });

   // Update old servings
   state.recipe.servings = newServings;
};

// Store bookmarks with local storage
const persistBookmarks = () => {
   localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = (recipe) => {
   // Add bookmark
   state.bookmarks.push(recipe);

   // Mark current recipe as bookmarked
   if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

   persistBookmarks();
};

export const deleteBookmark = (id) => {
   // Delete bookmark
   const index = state.bookmarks.findIndex((el) => el.id === id);
   state.bookmarks.splice(index, 1);

   // Mark current recipe as NOT bookmarked
   if (id === state.recipe.id) state.recipe.bookmarked = false;

   persistBookmarks();
};

// Get bookmarks item from the local storage on page loads
const init = () => {
   const storage = localStorage.getItem('bookmarks');

   // If there is any data stored in the bookmarks
   if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async (newRecipe) => {
   try {
      const ingredients = Object.entries(newRecipe)
         .filter(
            (entry) => entry[0].startsWith('ingredient') && entry[1] !== ''
         )
         .map((ing) => {
            // const ingArr = ing[1].replaceAll(' ', '').split(',');
            const ingArr = ing[1].split(',').map((el) => el.trim());
            if (ingArr.length !== 3)
               throw new Error(
                  'Wrong ingredient format! Please use the correct format :)'
               );

            const [quantity, unit, description] = ingArr;

            return { quantity: quantity ? +quantity : null, unit, description };
         });

      const recipe = {
         title: newRecipe.title,
         source_url: newRecipe.sourceUrl,
         image_url: newRecipe.image,
         publisher: newRecipe.publisher,
         cooking_time: +newRecipe.cookingTime,
         servings: +newRecipe.servings,
         ingredients,
      };

      const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
      state.recipe = createRecipeObject(data);
      addBookmark(state.recipe);
   } catch (error) {
      throw error;
   }
};
