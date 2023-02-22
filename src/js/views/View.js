import icons from '../../img/icons.svg';

export default class View {
   _data;

   render(data) {
      /**
       * 1. If there is no data
       * 2. If there is data but the data is an array and it is empty.
       */
      if (!data || (Array.isArray(data) && data.length === 0))
         return this.renderError();

      this._data = data;
      const markup = this._generateMarkup();

      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
   }

   _clear() {
      this._parentElement.innerHTML = '';
   }

   renderSpinner() {
      const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;

      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
   }

   renderError(errorMessage = this._errorMessage) {
      const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${errorMessage}</p>
        </div>
      `;

      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
   }
}
