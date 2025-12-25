/**
 * Sidesheet Footer Web Component
 */
class SidesheetFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['save-label', 'cancel-label', 'is-loading'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    get saveLabel() {
        return this.getAttribute('save-label') || 'Save Changes';
    }

    get cancelLabel() {
        return this.getAttribute('cancel-label') || 'Cancel';
    }

    get isLoading() {
        return this.hasAttribute('is-loading');
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/foundation/elements.css">
            <link rel="stylesheet" href="css/components/sidesheet-footer.css">
            <div class="footer">
                <button type="button" class="secondary" id="cancel-btn">${this.cancelLabel}</button>
                <div class="group">
                    <slot name="extra-actions"></slot>
                    <button type="submit" class="primary" id="save-btn" ${this.isLoading ? 'disabled' : ''}>
                        ${this.isLoading ? 'Processing...' : this.saveLabel}
                    </button>
                </div>
            </div>
        `;

        this.shadowRoot.getElementById('cancel-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }));
        });

        this.shadowRoot.getElementById('save-btn').addEventListener('click', (e) => {
            // If inside a form, we let the form handle submit
            this.dispatchEvent(new CustomEvent('save', { bubbles: true, composed: true }));
        });
    }
}

customElements.define('sidesheet-footer', SidesheetFooter);