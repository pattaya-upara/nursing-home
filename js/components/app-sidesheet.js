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
        this.updateState();
    }

    attributeChangedCallback(name) {
        if (this.shadowRoot.innerHTML === '') return;
        
        if (name === 'open') {
            this.updateState();
        } else if (name === 'title') {
            const titleEl = this.shadowRoot.querySelector('.title');
            if (titleEl) titleEl.textContent = this.getAttribute('title');
        }
    }

    updateState() {
        const isOpen = this.hasAttribute('open');
        const overlay = this.shadowRoot.getElementById('overlay');
        const sheet = this.shadowRoot.querySelector('.sheet');
        
        if (isOpen) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }

    close() {
        this.removeAttribute('open');
        this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    }

    render() {
        const title = this.getAttribute('title') || '';
        this.shadowRoot.innerHTML = `
            <style>
                @import "css/foundation/elements.css";
                @import "css/components/app-sidesheet.css";
            </style>
            <div class="overlay" id="overlay"></div>
            <div class="sheet">
                <header>
                    <h2 class="title">${title}</h2>
                    <button class="close-btn" id="close-btn">&times;</button>
                </header>
                <main>
                    <div class="left-pane">
                        <slot name="left"></slot>
                    </div>
                    <div class="right-pane">
                        <slot name="right"></slot>
                        <!-- Default slot falls back to right pane if no named slots -->
                        <slot></slot>
                    </div>
                </main>
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