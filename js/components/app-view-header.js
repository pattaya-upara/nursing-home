/**
 * Unified View Header Web Component
 * Used for page/screen titles and actions.
 */
class AppViewHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/components/app-view-header.css">
            <header>
                <div class="left-group">
                    <slot name="title"></slot>
                    <slot name="sub-title"></slot>
                </div>
                <div class="right-group">
                    <slot name="actions"></slot>
                </div>
            </header>
        `;
    }
}

customElements.define('app-view-header', AppViewHeader);