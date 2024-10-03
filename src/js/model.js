//import { async } from 'regenerator-runtime';
import { API_KEY, API_URL } from './config.js';
import { AJAX } from './helpers.js';
import { RESULT_PER_PAGE } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: '',
    resultPerPage: RESULT_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

function _createRecepeObject(data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    image: recipe.image_url,
    bookmarked: false,
    ...(recipe.key && { key: recipe.key }),
  };
}
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
    state.recipe = _createRecepeObject(data);
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async query => {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.result = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {}
};

export function getResultPerPage(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * this.state.search.resultPerPage;
  const end = page * this.state.search.resultPerPage;
  return this.state.search.result.slice(start, end);
}

export function updateServings(servings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity / state.recipe.servings) * servings;
  });

  state.recipe.servings = servings;
}

export function addBookmark(recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
    console.log('Bookmarked');
  }
  persistBookmark();
}

export function removeBookmark(bookmarkId) {
  const index = state.bookmarks.findIndex(
    bookmark => bookmark.id == bookmarkId
  );
  state.recipe.bookmarked = false;
  state.bookmarks.splice(index, 1);
  persistBookmark();
  console.log(state.bookmarks);
}

export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArray = ing[1].replaceAll(' ', '').split(',');
        const ingArray = ing[1].split(',').map(e => e.trim());

        if (ingArray.length !== 3)
          throw new Error(
            'Wrong format. Please follow the format in the hint :)'
          );

        const [quantity, unit, description] = ingArray;

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
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = _createRecepeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
}

function clearBookmarks() {
  localStorage.clear('bookmarks');
}

function persistBookmark() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

function init() {
  let bookmarks = localStorage.getItem('bookmarks');
  if (bookmarks) {
    bookmarks = JSON.parse(bookmarks);
    state.bookmarks = bookmarks;
  }
  console.log(bookmarks);
}

init();

//localStorage.removeItem('bookmarks');
