import { async } from 'regenerator-runtime';

export const state = {
   recipe: {},
};

// This function returns nothing but just update state recipe object
export const loadRecipe = async (id) => {
   try {
      const response = await fetch(
         `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
      );
      const data = await response.json();

      if (!response.ok) throw new Error(`${data.message} (${response.status})`);

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
      alert(error.message);
   }
};
