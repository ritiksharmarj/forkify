import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
   recipe: {},
};

// This function returns nothing but just update state recipe object
export const loadRecipe = async (id) => {
   try {
      const data = await getJSON(`${API_URL}${id}`);

      const { recipe } = data.data;
      state.recipe = {
         cookingTime: recipe.cooking_time,
         id: recipe.id,
         image: recipe.image_url,
         ingredients: recipe.ingredients,
         publisher: recipe.publisher,
         servings: recipe.servings,
         sourceUrl: recipe.source_url,
         title: recipe.title,
      };

      console.log(state.recipe);
   } catch (error) {
      // Temp error handling
      console.error(`${error.message} 💥💥💥`);
   }
};
