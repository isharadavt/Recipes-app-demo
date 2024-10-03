import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecepeView from './views/addRecepeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';

const controlRecipes = async () => {
  try {
    recipeView.renderSpinner();

    resultView.update(model.getResultPerPage());

    const id = window.location.hash.slice(1);

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);

    bookmarkView.update(model.state.bookmarks);

    //controlServings();

    //ignore-prettier
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultView.renderSpinner();

    await model.loadSearchResults(query);

    resultView.render(model.getResultPerPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (page) {
  resultView.render(model.getResultPerPage(page));
  paginationView.render(model.state.search);
};

const controlServings = function (servings) {
  //Update servings in state
  model.updateServings(servings);
  //Render recipe
  recipeView.update(model.state.recipe);
  // console.log(model.state.recipe.servings);
};

const controlBookmarks = () => {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
};

const controlLoadBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecepeView.renderSpinner();
    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);
    addRecepeView.renderMessage();
    bookmarkView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecepeView._toogleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    addRecepeView.renderError(error.message);
  }
};
controlSearchResult();
const init = () => {
  bookmarkView.addHandler(controlLoadBookmarks);
  recipeView.addHandler(controlRecipes);
  recipeView.addServingsHandler(controlServings);
  searchView.addHandler(controlSearchResult);
  recipeView.addBookmarksHandler(controlBookmarks);
  paginationView.addHandler(controlPagination);
  addRecepeView.addUploadHandler(controlAddRecipe);
};

init();

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
