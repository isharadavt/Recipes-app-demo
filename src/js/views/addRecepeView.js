import View from './view';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _successMessage = 'Recipe was successfully uploaded.';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addShowWindowHandler();
    this._addCloseWindowHandler();
  }
  _toogleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addShowWindowHandler() {
    this._btnOpen.addEventListener('click', this._toogleWindow.bind(this));
  }

  _addCloseWindowHandler() {
    this._btnClose.addEventListener('click', this._toogleWindow.bind(this));
    this._overlay.addEventListener('click', this._toogleWindow.bind(this));
  }

  addUploadHandler(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = Object.fromEntries([...new FormData(this)]);
      handler(data);
      // console.log('MY DATA', [...new FormData(this)]);
    });
  }

  _generateHTML() {}
}

export default new AddRecipeView();
