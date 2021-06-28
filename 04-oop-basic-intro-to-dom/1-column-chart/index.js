export default class ColumnChart {
    element;
    chartHeight = 50;
    chartColumnElements = {}; // {header:, body:}

    constructor({ data=[], label, value, link='', formatHeading=null } = {}) {
        this.data = data;
        this.label = label;
        this.value = value;
        this.link = link;
        this.formatHeading = formatHeading;

        this.render();
    }

    get chartHeader(){
        return this.formatHeading === null ? this.value : this.formatHeading(this.value);
    }

    get chartColumnBody() {
        // copied from getColumnProps (index.spec.js)
        const maxValue = Math.max(...this.data);
        const scale = 50 / maxValue;

        return this.data.map(item => {            
            const percent = (item / maxValue * 100).toFixed(0) + '%';
            const value = Math.floor(item * scale);

            return `<div style="--value: ${value}" data-tooltip="${percent}"></div>`;
        }).join('');
    }

    render() {
        const elem = document.createElement("div");
        elem.innerHTML = `
            <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
                <div class="column-chart__title">
                    Total ${this.label}
                    <a class="column-chart__link" href="${this.link}">View all</a>
                </div>
                <div class="column-chart__container">
                    <div data-element="header" class="column-chart__header">
                        ${this.chartHeader}
                    </div>
                    <div data-element="body" class="column-chart__chart">
                        ${this.chartColumnBody}
                    </div>
                </div>
            </div>
        `;

        this.element = elem.firstElementChild;

        // disable charts skeleton
        if (this.data.length) {
            this.element.classList.remove("column-chart_loading");
        }

        // init and save chart elements
        this.initChartColumnElements();
    }

    initChartColumnElements(){
        const nodeList = this.element.querySelectorAll('div[data-element]');

        this.chartColumnElements = Array.from(nodeList).reduce(
            (acc, element) => (
                { ...acc, [element.dataset.element]: element }
            ), 
            {}
        );
    }

    update(newData) {
        this.data = newData;
        this.chartColumnElements.body.innerHTML = this.chartColumnBody;
    }

    // should have ability to be removed
    remove(){
        this.element.remove();
    }

    destroy() {
        this.remove();
        this.formatHeading = null; // release ref to function to avoid potential memory leak
        this.chartColumnElements = {};
    }
}
