/**
 * App Topbar Web Component
 */
class AppTopbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/components/app-topbar.css">
            <header class="topbar">
                <a href="/" class="logo">Bourbon <span>Mall</span></a>
                <nav class="nav">
                    <slot name="navigation">
                        <a href="#" class="nav-link">Dashboard</a>
                        <a href="#" class="nav-link">Packages</a>
                        <a href="#" class="nav-link">Teams</a>
                        <a href="#" class="nav-link">Staff</a>
                    </slot>
                </nav>
            </header>
        `;
    }
}

customElements.define('app-topbar', AppTopbar);