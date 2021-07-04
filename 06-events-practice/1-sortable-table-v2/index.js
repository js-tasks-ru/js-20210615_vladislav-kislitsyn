export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], {
    data = [],
    sorted = {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc'
    }
  } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;

    this.render();
  }

  //-----------changes related to the task --------------------------

  render() {
    const elem = document.createElement('div');
    const { id, order } = this.sorted;
    const sortedData = this.sortData(id, order);
    // init elements with specified sorting order
    elem.innerHTML = this.getTable(sortedData);
  
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
    // add listener with event handler onClickSortTable
    this.subElements.header.addEventListener('pointerdown', this.onClickSortTable);
  } 

  // sortData was inner function in the previous task
  sortData(field, order) {
    const arr = [...this.data];
    const columnToSort = this.headerConfig.find(item => item.id === field);
    const directions = {asc: 1, desc: -1};

    return arr.sort((a, b) => {

      const res = columnToSort.sortType === 'string' 
                        ? a[field].localeCompare(b[field], ['ru', 'en']) 
                        : (a[field] - b[field]);
      
      return directions[order] * res;

    });

  }

  // event handler
  onClickSortTable = event => {
    const column = event.target.closest('[data-sortable]');
    const {id, sortable, order} = column.dataset;

    if (sortable === 'false'){
      console.error("Column %s is not sortable", id);
      return;
    }

    const reverseOrder = (order) => { 
      return order === 'asc'? 'desc' : 'asc';
    };

    const sortedData = this.sortData(id, reverseOrder(order));
    const arrow = column.querySelector('.sortable-table__sort-arrow');
    column.dataset.order = reverseOrder(order);

    if (arrow === null) {
      column.append(this.subElements.arrow);
    }

    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  };

  // added data-order tag
  getHeaderRow({ id, title, sortable }) {
    const order = this.sorted.id === id ? this.sorted.order : 'asc';

    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
        <span>${title}</span>${this.getHeaderSortingArrow(id)}
      </div>
    `;
  }

  // logic for sorting arrow
  getHeaderSortingArrow(id) {
    let ret = "";
    if (this.sorted.id === id){
      ret = `<span data-element="arrow" class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>`
    }

    return ret;
  }

  //-----------------------------------------------------------------

  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headerConfig.map(item => this.getHeaderRow(item)).join('')}
    </div>`;
  }

  getTableBody(data) {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(data)}
      </div>`;
  }

  getTableRows(data) {
    return data.map(item => `
      <div class="sortable-table__row">
        ${this.getTableRow(item, data)}
      </div>`
    ).join('');
  }

  getTableRow(item) {
    const cells = this.headerConfig.map(({ id, template }) => {
      return {
        id,
        template
      };      
    });

    return cells.map(({ id, template }) => {
      return template
        ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getTable(data) {
    return `
      <div class="sortable-table">
        ${this.getTableHeader()}
        ${this.getTableBody(data)}
      </div>`;
  }

  remove() {
    if (this.element !== null)
      this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
    this.element = null;
  }
}
