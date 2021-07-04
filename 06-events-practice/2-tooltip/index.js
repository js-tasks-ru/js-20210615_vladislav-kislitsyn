class Tooltip {
    element;
    static instance = null;
  
    constructor() {
      if (Tooltip.instance !== null) {
        return Tooltip.instance;
      }
  
      Tooltip.instance = this;
    }

    render(tooltipTemplate){
        const elem = document.createElement('div');
        elem.className = 'tooltip';
        elem.innerHTML = tooltipTemplate;

        this.element = elem;
        document.body.append(this.element);
    }

    initialize() {
        document.addEventListener('pointerover', this.onPointerOver);
        document.addEventListener('pointerout', this.onPointerOut);  
    }

    onPointerOver = event => {
        const element = event.target.closest('[data-tooltip]');
        if (element !== null){
            this.render(element.dataset.tooltip);
            document.addEventListener('pointermove', this.onPointerMove);
        }
    }
  
    onPointerMove = event => {
      this.moveTooltip(event);
    }
  
    onPointerOut = () => {
      this.remove();
      document.removeEventListener('pointermove', this.onPointerMove);
    }

    moveTooltip(event) {
        this.element.style.left = event.clientX + 'px';
        this.element.style.top = event.clientY + 'px';
    }

    remove(){
        if(this.element)
            this.element.remove();
    }

    destroy() {
        this.remove();
        document.removeEventListener('pointerover', this.onPointerOver);
        document.removeEventListener('pointerout', this.onPointerOut);
        
        Tooltip.instance = null;
    }
  }
  
export default Tooltip;
  