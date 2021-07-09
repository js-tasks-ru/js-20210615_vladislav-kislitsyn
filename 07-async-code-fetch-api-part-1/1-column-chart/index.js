import fetchJson from './utils/fetch-json.js';
import mockData from "./__mocks__/orders-data.js";

const BACKEND_URL = 'https://course-js.javascript.ru';


export default class ColumnChart {
    element;
    subElements = {};
    chartHeight = 50;
  
    constructor({
      url,
      label,
      link,
      range={
        from: new Date(),
        to: new Date() ,
      },
      formatHeading = data => data,
    } = {}) {
      
      this.url = new URL(url, BACKEND_URL)
      this.label = label;
      this.link = link;
      this.formatHeading = formatHeading;
      this.range = range;

      this.render();
      this.loadData();
    }

    getChartHeader(data){
      const total = data.reduce((a, b) => a + b);
      return this.formatHeading(total);
    }

    async update(from, to) {
      //this.subElements.body.innerHTML = this.getColumnBody(data);
      this.range.from = from;
      this.range.to = to;

      let res = mockData;
      if (this.range.to - this.range.from){
        res = await this.loadData();
      }

      return res;
    }

    async loadData() {
  
      this.url.searchParams.set('from', this.range.from.toISOString());
      this.url.searchParams.set('to', this.range.to.toISOString());
   
      const response = await fetchJson(this.url);

      const values = Object.values(response);

      if (values.length){
        this.updateSubElements(values);
      }

      return values;
    }

    updateSubElements(data){

      this.subElements.header.innerHTML = this.getChartHeader(data);
      this.subElements.body.innerHTML = this.getColumnBody(data);
      this.element.classList.remove('column-chart_loading');

    }

    getColumnBody(data) {

      const maxValue = Math.max(...data);
      const scale = this.chartHeight / maxValue;
    
      return [...data]
          .map(item => {
            const percent = (item / maxValue * 100).toFixed(0);
    
            return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
          })
          .join('');

    }
  
    getLink() {
      return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
    }
  
    get template() {
      return `
        <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
          <div class="column-chart__title">
            Total ${this.label}
            ${this.getLink()}
          </div>
          <div class="column-chart__container">
             <div data-element="header" class="column-chart__header"></div>
            <div data-element="body" class="column-chart__chart"></div>
          </div>
        </div>
      `;
    }
  
    render() {
      const element = document.createElement('div');
  
      element.innerHTML = this.template;
  
      this.element = element.firstElementChild;
  
      //if (this.data.length) {
      //  this.element.classList.remove('column-chart_loading');
      //}
  
      this.subElements = this.getSubElements(this.element);
    }
  
    getSubElements(element) {
      const result = {};
      const elements = element.querySelectorAll('[data-element]');
  
      for (const subElement of elements) {
        const name = subElement.dataset.element;
  
        result[name] = subElement;
      }
  
      return result;
    }
  
    remove () {
      if (this.element) {
        this.element.remove();
      }
    }
  
    destroy() {
      this.remove();
      this.element = null;
      this.subElements = {};
    }
  }
  