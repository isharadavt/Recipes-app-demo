'use strict';
import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   *
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendereing the object to the DOM.
   * @returns {undefined | string} A markup string is returned if render is set to false.
   * @this {Object} View instance
   * @author David IT
   * @todo Finish the implementation.
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length == 0)) {
      return this.renderError();
    }
    this._data = data;
    const markup = this._generateHTML();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(recipe) {
    // if (!recipe || (Array.isArray(recipe) && recipe.length === 0)) {
    //   return this._errorMessage();
    // }

    this._data = recipe;

    const markup = this._generateHTML();
    const newDom = document.createRange().createContextualFragment(markup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // console.log('Cur elements', curElements);
    // console.log('New elements', newElements);

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl);
      // console.log(newElFirstChild);
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr, i) => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderSpinner() {
    const markup = `<div class="spinner">
                          <svg>
                            <use href="${icons}#icon-loader"></use>
                          </svg>
                        </div> `;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
                      <div>
                        <svg>
                          <use href="${icons}#icon-alert-triangle"></use>
                        </svg>
                      </div>
                      <p>${message}</p>
                    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._successMessage) {
    const markup = `<div class="message">
                      <div>
                        <svg>
                          <use href="src/img/icons.svg#icon-smile"></use>
                        </svg>
                      </div>
                      <p>
                        ${message}
                      </p>
                    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
