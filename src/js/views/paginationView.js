import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _errorMessage = 'No record found for your query. Try another key word.';
  _successMessage = '';

  addHandler(handler) {
    this._parentElement.addEventListener('click', e => {
      const button = e.target.closest('.btn--inline');
      if (!button) return;
      const goto = +button.dataset.goto;
      handler(goto);
    });
  }

  _generateHTML() {
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultPerPage
    );
    const curPage = this._data.page;

    console.log(this._data.result.length);

    //Page is 1 et there are other pages
    if (curPage === 1 && numPages > 1) {
      return `<button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
                <svg class="search__icon">
                  <use href="${icons}#icon-arrow-right"></use>
                </svg>
                <span>Page ${curPage + 1}</span>
              </button>`;
    }

    //Page is last page
    if (curPage === numPages && numPages > 1) {
      return `<button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
                <span>Page ${curPage - 1}</span>
                <svg class="search__icon">
                  <use href="${icons}#icon-arrow-left"></use>
                </svg>
              </button>`;
    }

    //only one page
    if (curPage < numPages) {
      return `<button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
                  <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                  </svg>
                    <span>Page ${curPage - 1}</span>
              </button>
                <button data-goto="${
                  curPage + 1
                }" class="btn--inline pagination__btn--next">
                  <span>Page ${curPage + 1}</span>
                  <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                  </svg>
              </button>
                `;
    }

    return '';
  }
}

export default new PaginationView();
