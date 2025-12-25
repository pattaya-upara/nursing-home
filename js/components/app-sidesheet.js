/**
 * App Sidesheet Web Component
 */
class AppSidesheet extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['open', 'title'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    get isOpen() {
        return this.hasAttribute('open');
    }

    get title() {
        return this.getAttribute('title') || '';
    }

    close() {
        this.removeAttribute('open');
        this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/foundation/elements.css">
            <link rel="stylesheet" href="css/components/app-sidesheet.css">
            <div class="overlay ${this.isOpen ? 'active' : ''}" id="overlay"></div>
            <div class="sheet">
                <div class="header">
                    <h2 class="title">${this.title}</h2>
                    <button class="close-btn" id="close-btn">&times;</button>
                </div>
                <div class="content">
                    <div class="left-pane">
                        <slot name="left"></slot>
                    </div>
                    <div class="right-pane">
                        <slot name="right"></slot>
                    </div>
                </div>
                <footer>
                    <slot name="footer"></slot>
                </footer>
            </div>
        `;

        this.shadowRoot.getElementById('overlay').addEventListener('click', () => this.close());
        this.shadowRoot.getElementById('close-btn').addEventListener('click', () => this.close());
    }
}

customElements.define('app-sidesheet', AppSidesheet);