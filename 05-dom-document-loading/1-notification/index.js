export default class NotificationMessage {
    element;
    timerId;
    static instance = null;

    constructor(message, {duration=2000, type='success'} = {}){
        this.message = message;
        this.duration = duration;
        this.type = type;

        this.render();
    }

    render(){
        const elem = document.createElement("div");
        elem.innerHTML = this.notificationBody;

        this.element = elem.firstElementChild;
    }

    get notificationBody(){
        return `
            <div class="notification ${this.type}" style="--value:${this.duration/1000}s">
                <div class="timer"></div>
                <div class="inner-wrapper">
                    <div class="notification-header"></div>
                    <div class="notification-body">
                        ${this.message}
                    </div>
                </div>
            </div>`;
    }

    show(targetElement=document.body){

        if(NotificationMessage.instance !== null){
            NotificationMessage.instance.destroy();
        }

        NotificationMessage.instance = this;
        targetElement.append(this.element);
        this.timerId = setTimeout(() => this.remove(), this.duration);
    }

    remove(){
        this.element.remove();
    }

    destroy(){
        this.remove();
        clearTimeout(this.timerId);
        NotificationMessage.instance = null;
    }
}
