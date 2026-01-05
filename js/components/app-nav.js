/**
 * Unified App Navigation Web Component
 * Supports both vertical (sidebar) and horizontal (topbar) layouts.
 * 
 * Attributes:
 * - orientation: "vertical" | "horizontal" (default: "vertical")
 * - show-profile: "true" | "false" (default: "true")
 */
class AppNav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['orientation', 'show-profile'];
    }

    connectedCallback() {
        if (!this.hasAttribute('orientation')) {
            this.setAttribute('orientation', 'vertical');
        }
        if (!this.hasAttribute('show-profile')) {
            this.setAttribute('show-profile', 'true');
        }
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const orientation = this.getAttribute('orientation') || 'vertical';
        const showProfile = this.getAttribute('show-profile') !== 'false';

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/style.css">
            <link rel="stylesheet" href="css/components/app-nav.css">
            <header>
                <a href="/" class="brand">Bourbon <span>Mall</span></a>
                <div class="subtitle">Operation Manager</div>
            </header>
            
            <section class="nav-content">
                <slot name="menu"></slot>
            </section>
            
            <footer>
                <div class="profile">
                    <div class="avatar md primary">OM</div>
                    <div class="user-info">
                        <span class="user-name">Manager Alice</span>
                        <span class="user-role">Administrator</span>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('app-nav', AppNav);