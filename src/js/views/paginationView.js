import icons from '../../img/icons.svg';
import View from './View.js';

class PaginationView extends View {
   _parentElement = document.querySelector('.pagination');

   addHandlerClick(handler) {
      this._parentElement.addEventListener('click', (e) => {
         const btn = e.target.closest('.btn--inline');

         // If there is no button return nothing
         if (!btn) return;

         const goToPage = +btn.dataset.goto;
         handler(goToPage);
      });
   }

   _generateMarkup() {
      const currentPage = this._data.page;

      // Total number of pages
      const numPages = Math.ceil(
         this._data.results.length / this._data.resultsPerPage
      );

      // Page 1, and there are other pages
      if (currentPage === 1 && numPages > 1)
         return this._generateMarkupButton('next', currentPage);

      // Last page
      if (currentPage === numPages && numPages > 1)
         return this._generateMarkupButton('prev', currentPage);

      // Other page
      if (currentPage < numPages)
         return `${this._generateMarkupButton(
            'next',
            currentPage
         )}${this._generateMarkupButton('prev', currentPage)}`;

      // Page 1, and there are NO other pages
      return '';
   }

   _generateMarkupButton(type, currentPage) {
      return `
      <button data-goto="${
         type === 'next' ? currentPage + 1 : currentPage - 1
      }" class="btn--inline pagination__btn--${type}">
        ${type === 'next' ? `<span>Page ${currentPage + 1}</span>` : ''}
        <svg class="search__icon">
           <use href="${icons}#icon-arrow-${
         type === 'next' ? 'right' : 'left'
      }"></use>
        </svg>
        ${type === 'prev' ? `<span>Page ${currentPage - 1}</span>` : ''}
      </button>
    `;
   }
}

export default new PaginationView();
