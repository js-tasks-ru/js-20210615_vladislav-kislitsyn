export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], data=[]) {
      this.headerConfig = headerConfig; // id title sortable sortType
      this.data = data.data;

      this.render();
  }

  get headerTemplate(){

    return this.headerConfig.map(({id, title, sortable, sortType}) => {

      return `
          <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
            <span>${title}</span>
              <span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
              </span>
          </div>`;

    }).join('');
  }

  get tableTemplate(){
    return `
    <div class="sortable-table">
  
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerTemplate}
      </div>
  
      <div data-element="body" class="sortable-table__body">
        ${this.tableRowsTemplate(this.data)}
      </div>
      render
    </div>`;

  }

  render(){
    const elem = document.createElement('div');
    elem.innerHTML = this.tableTemplate;

    this.element = elem.firstElementChild;
    this.initSubElements();
  }

  initSubElements(){
    const nodeList = this.element.querySelectorAll('[data-element]');

    this.subElements = Array.from(nodeList).reduce(
        (acc, element) => (
            { ...acc, [element.dataset.element]: element }
        ), 
        {}
    );
  }

  tableRowsTemplate(data){

    return data.map((product) => {
      
      return `
          <a href="/products/${product.id}" class="sortable-table__row">
            ${this.itemTableRowTemplate(product)}
          </a>`

      }).join('');
  }

  itemTableRowTemplate(product){

    return this.headerConfig.map(({id, template}) => {

      if (template !== undefined){
        return template(product[id]);
      }

      return `<div class="sortable-table__cell">${product[id]}</div>`;

    }).join('');

  }

  sort(field, order){

    const sortData = (field, order) => {
      
      const dataToSort = [...this.data];
      const directions = {asc: 1, desc: -1};
      const columnToSort = this.headerConfig.find(itemConfig => itemConfig.id === field);

      return dataToSort.sort((a, b) => {

          const res = columnToSort.sortType === 'string' 
                        ? a[field].localeCompare(b[field], ['ru', 'en']) 
                        : (a[field] - b[field]);

          return directions[order] * res;
        });

    };

    const sortedData = sortData(field, order);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const columnToSort = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    columnToSort.dataset.order = order;

    this.subElements.body.innerHTML = this.tableRowsTemplate( sortedData );

  }

  remove(){

    if(this.element !== null)
      this.element.remove();
  }

  destroy() {
    this.remove();
    this.rowElements = {};
    this.element = null;
  }

}

