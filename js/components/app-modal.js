/**
 * Unified Modal Component for Alerts and Decisions
 */
class AppModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._onConfirm = null;
        this._onCancel = null;
    }

    connectedCallback() {
        this.render();
    }

    show(options = {}) {
        const { title, message, type = 'alert', confirmText = 'OK', cancelText = 'Cancel', onConfirm, onCancel } = options;
        
        this._onConfirm = onConfirm;
        this._onCancel = onCancel;
        
        this.setAttribute('open', '');
        
        const container = this.shadowRoot.querySelector('.modal-container');
        container.innerHTML = `
            <header>
                <h3>${title}</h3>
                <div class="message">${message}</div>
            </header>
            <div class="actions">
                <button class="primary" id="confirm-btn">${confirmText}</button>
                ${type === 'confirm' ? `<button class="tertiary" id="cancel-btn">${cancelText}</button>` : ''}
            </div>
        `;

        this.shadowRoot.querySelector('#confirm-btn').onclick = () => {
            if (this._onConfirm) this._onConfirm();
            this.close();
        };

        if (type === 'confirm') {
            this.shadowRoot.querySelector('#cancel-btn').onclick = () => {
                if (this._onCancel) this._onCancel();
                this.close();
            };
        }
    }

    close() {
        this.removeAttribute('open');
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/style.css">
            <link rel="stylesheet" href="css/components/app-modal.css">
            <div class="backdrop"></div>
            <div class="modal-container"></div>
        `;

        this.shadowRoot.querySelector('.backdrop').onclick = () => this.close();
    }
}

customElements.define('app-modal', AppModal);