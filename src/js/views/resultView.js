import View from './view';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No record found for your query. Try another key word.';
  _successMessage = '';

  _generateHTML() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultView();
