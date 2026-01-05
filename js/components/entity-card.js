/**
 * Unified Entity Card Web Component
 * Used for both Packages and Teams display
 */
class EntityCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['type', 'entity-id'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    get type() {
        return this.getAttribute('type') || 'package';
    }

    get entityData() {
        const dataAttr = this.getAttribute('data');
        return dataAttr ? JSON.parse(dataAttr) : null;
    }

    render() {
        const data = this.entityData;
        if (!data) return;

        const isPackage = this.type === 'package';
        const isTeam = this.type === 'team';

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/style.css">
            <link rel="stylesheet" href="css/components/entity-card.css">
            <header>
                <h3>${this._escapeHtml(data.name)}</h3>
                ${isPackage
                ? `<span class="badge primary">${data.duration} Days</span>`
                : `<span class="badge secondary">${this._escapeHtml(data.dept)}</span>`
            }
            </header>
            
            ${isPackage && data.description
                ? `<p>${this._escapeHtml(data.description)}</p>`
                : ''
            }
            
            ${isTeam ? this._renderMemberAvatars(data.members || []) : ''}

            <div class="summary-row">
                ${isPackage
                ? `<span class="price">฿${(data.price || 0).toLocaleString()}</span>
                        <span class="meta">${(data.services || []).length} Services</span>`
                : `<span class="meta">${(data.members || []).length} Members</span>
                        <span class="meta">${(data.assignmentTypes || []).length} Services</span>`
            }
            </div>
            
            ${isTeam ? `<footer>${this._renderAssignmentList(data.assignmentTypes || [])}</footer>` : ''}
        `;

        // Add click handler
        this.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('card-click', {
                bubbles: true,
                composed: true,
                detail: { type: this.type, id: data.id, data: data }
            }));
        });
    }

    _renderMemberAvatars(members) {
        if (!members.length) return '';

        const displayMembers = members.slice(0, 5);
        const remaining = members.length - 5;

        return `
            <div class="avatar-group">
                ${displayMembers.map((m, i) => `
                    <div class="avatar sm" style="z-index: ${10 - i}">
                        ${m.substring(3)}
                    </div>
                `).join('')}
                ${remaining > 0 ? `<div class="avatar sm" style="z-index: 0">+${remaining}</div>` : ''}
            </div>
        `;
    }

    _renderAssignmentList(assignments) {
        if (!assignments.length) {
            return `<section class="assignment-list"><div class="empty-state">No services registered</div></section>`;
        }

        return `
            <section class="assignment-list">
                ${assignments.map(at => `
                    <div class="assignment-row">
                        <div class="assignment-info">
                            <div class="name">${this._escapeHtml(at.name)}</div>
                            <div class="desc">${this._escapeHtml(at.description)}</div>
                        </div>
                        ${this.type === 'package' ? `<span class="price">฿${(at.price || 0).toLocaleString()}</span>` : ''}
                    </div>
                `).join('')}
            </section>
        `;
    }

    _escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

customElements.define('entity-card', EntityCard);
