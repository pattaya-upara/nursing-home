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
        // #region agent log
        const lightDomButtons = Array.from(this.querySelectorAll('button')).map(btn => ({
            id: btn.id,
            text: btn.textContent,
            onclick: btn.getAttribute('onclick')
        }));
        fetch('http://127.0.0.1:7244/ingest/519f29c6-6d7a-4252-9040-eba6090f87cd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'sidesheet-footer.js:34',message:'sidesheet-footer render called',data:{lightDomButtons,hasSaveLabel:!!this.saveLabel,saveLabel:this.saveLabel},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/foundation/elements.css">
            <link rel="stylesheet" href="css/components/sidesheet-footer.css">
            <button type="button" class="tertiary" id="cancel-btn">${this.cancelLabel}</button>
            <div class="group">
                <slot name="extra-actions"></slot>
                <slot name="save-btn">
                    <button type="submit" class="primary" id="save-btn" ${this.isLoading ? 'disabled' : ''}>
                        ${this.isLoading ? 'Processing...' : this.saveLabel}
                    </button>
                </slot>
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