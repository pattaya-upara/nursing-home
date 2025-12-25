/**
 * App Sidebar Web Component
 */
class AppSidebar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/components/app-sidebar.css">
            <aside class="sidebar-container">
                <div class="header">
                    <h1 class="brand">Bourbon <span>Mall</span></h1>
                    <div class="subtitle">Operation Manager</div>
                </div>
                <nav class="nav">
                    <slot name="menu"></slot>
                </nav>
                <div class="footer">
                    <div class="profile">
                        <div class="avatar">OM</div>
                        <div class="user-info">
                            <span class="user-name">Manager Alice</span>
                            <span class="user-role">Administrator</span>
                        </div>
                    </div>
                </div>
            </aside>
        `;
    }
}

customElements.define('app-sidebar', AppSidebar);