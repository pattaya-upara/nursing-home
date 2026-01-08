/**
 * Package Details Web Component
 * Displays package information in a readable format
 */
class PackageDetails extends HTMLElement {
    constructor() {
        super();
        // No shadow DOM - render in light DOM so slots work
    }

    static get observedAttributes() {
        return ['package-data', 'mode'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name) {
        if ((name === 'package-data' || name === 'mode') && this.shadowRoot.innerHTML !== '') {
            this.render();
        }
    }

    get packageData() {
        const dataAttr = this.getAttribute('package-data');
        if (!dataAttr) return null;
        try {
            return JSON.parse(dataAttr);
        } catch (e) {
            return null;
        }
    }

    get mode() {
        return this.getAttribute('mode') || 'display';
    }

    setMode(newMode) {
        const oldMode = this.getAttribute('mode');
        this.setAttribute('mode', newMode);
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/519f29c6-6d7a-4252-9040-eba6090f87cd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'package-details.js:39',message:'setMode called',data:{oldMode,newMode,isInitialRender:!oldMode},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        this.render();
        // Dispatch event to update footer button
        this.dispatchEvent(new CustomEvent('mode-changed', { 
            bubbles: true, 
            composed: true,
            detail: { mode: newMode }
        }));
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/519f29c6-6d7a-4252-9040-eba6090f87cd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'package-details.js:47',message:'mode-changed event dispatched',data:{mode:newMode},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
    }

    enterEditMode() {
        this.setMode('edit');
    }

    exitEditMode() {
        this.setMode('display');
    }

    render() {
        const pkg = this.packageData;
        const currentMode = this.mode;
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/519f29c6-6d7a-4252-9040-eba6090f87cd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'package-details.js:65',message:'render called',data:{hasPkg:!!pkg,pkgId:pkg?.id,currentMode},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        if (!pkg) {
            this.innerHTML = '<div class="empty-state">No package data available</div>';
            return;
        }

        const services = pkg.services || [];
        const isEditMode = this.mode === 'edit';

        // Inject styles into document head if not already there
        if (!document.getElementById('package-details-styles')) {
            const style = document.createElement('style');
            style.id = 'package-details-styles';
            style.textContent = `
                @import url("css/foundation/elements.css");
                @import url("css/components/package-details.css");
            `;
            document.head.appendChild(style);
        }

        // Render content in light DOM so slots work - structure like TeamView
        this.innerHTML = `
            <!-- Left Pane Content -->
            <div slot="left" class="package-details-left">
                <!-- Description Section -->
                <section class="details-section">
                    <h2 class="section-title">Description</h2>
                    ${isEditMode ? `
                        <textarea class="description-input" name="description" form="sidesheet-form" placeholder="Enter package description...">${this._escapeHtml(pkg.description || '')}</textarea>
                    ` : pkg.description ? `
                        <p class="description-text">${this._escapeHtml(pkg.description)}</p>
                    ` : `
                        <p class="description-text text-muted">No description provided.</p>
                    `}
                </section>
            </div>

            <!-- Right Pane Content -->
            <div slot="right" class="package-details-right">
                <form id="sidesheet-form">
                    <input type="hidden" name="id" value="${pkg.id || ''}" form="sidesheet-form">
                    
                    <!-- Header Section -->
                    <section class="details-header">
                        <div class="header-main">
                            ${isEditMode ? `
                                <input type="text" 
                                       class="package-name-input" 
                                       name="name" 
                                       value="${this._escapeHtml(pkg.name)}" 
                                       placeholder="Package Name" 
                                       required 
                                       form="sidesheet-form">
                            ` : ''}
                            <div class="header-main-right">
                                <div class="price-display">
                                    <span class="price-label">Total Price</span>
                                    ${isEditMode ? `
                                        <div class="price-input-wrapper">
                                            <span class="price-currency">฿</span>
                                            <input type="number" 
                                                   class="price-value-input" 
                                                   name="price" 
                                                   value="${pkg.price || 0}" 
                                                   form="sidesheet-form">
                                        </div>
                                    ` : `
                                        <span class="price-value">฿${(pkg.price || 0).toLocaleString()}</span>
                                    `}
                                </div>
                                ${isEditMode ? `
                                    <div class="package-badge-input-wrapper">
                                        <input type="number" 
                                               class="package-duration-input" 
                                               name="duration" 
                                               value="${pkg.duration || 0}" 
                                               required 
                                           form="sidesheet-form">
                                        <span class="package-badge-label">Days</span>
                                    </div>
                                ` : `
                                    <div class="package-badge">${pkg.duration || 0} Days</div>
                                `}
                            </div>
                        </div>
                    </section>

                    <!-- Services Section -->
                    <section class="details-section">
                        <div class="section-header">
                            <div class="section-header-actions">
                                <span class="service-count">${services.length} ${services.length === 1 ? 'Service' : 'Services'}</span>
                                ${isEditMode ? `
                                    <button type="button" class="add-service-btn">
                                        <i class="fas fa-plus"></i> Add Service
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                        
                        ${services.length > 0 ? `
                            <div class="services-list" id="services-list">
                                ${services.map((service, index) => this._renderServiceItem(service, index, isEditMode, pkg.duration || 0)).join('')}
                            </div>
                        ` : `
                            <div class="empty-services">
                                ${isEditMode ? `
                                    <i class="fas fa-box-open"></i>
                                    <p>No services assigned to this package.</p>
                                    <button type="button" class="add-service-btn primary">
                                        <i class="fas fa-plus"></i> Add First Service
                                    </button>
                                ` : `
                                    <i class="fas fa-box-open"></i>
                                    <p>No services assigned to this package.</p>
                                `}
                            </div>
                        `}
                    </section>
                </form>
            </div>
        `;
        
        // Update duration badge when duration changes
        const durationInput = this.querySelector('.package-duration-input');
        if (durationInput) {
            this.updateDurationBadge(durationInput);
        }
        
        // Set up form submission handler
        const form = this.querySelector('#sidesheet-form');
        if (form) {
            // Use a flag to prevent duplicate handlers
            if (!form.dataset.handlerAttached) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof App !== 'undefined' && App.handleSavePackage) {
                        App.handleSavePackage(e);
                    }
                    return false;
                }, { once: false });
                form.dataset.handlerAttached = 'true';
            }
        }
        
        // Re-attach event handlers for dynamically added services
        this._attachEventHandlers();
    }
    
    _attachEventHandlers() {
        // Attach handlers for service management
        const addButtons = this.querySelectorAll('.add-service-btn');
        addButtons.forEach(btn => {
            btn.addEventListener('click', () => this.addService());
        });
        
        const deleteButtons = this.querySelectorAll('.service-delete-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.removeService(e.target));
        });
        
        const autocompleteInputs = this.querySelectorAll('.autocomplete-input');
        autocompleteInputs.forEach(input => {
            input.addEventListener('focus', () => this.showAutocomplete(input));
            input.addEventListener('input', () => this.handleAutocomplete(input));
        });
        
        const priceInputs = this.querySelectorAll('.service-price-input, .package-duration-input');
        priceInputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.classList.contains('service-price-input')) {
                    this.updateServicePrice(input);
                } else if (input.classList.contains('package-duration-input')) {
                    this.updateDurationBadge(input);
                }
            });
        });
    }

    updateDurationBadge(input) {
        // The badge is now an input, so no need to update a badge
        // But we can update service prices if needed
        const serviceItems = this.shadowRoot.querySelectorAll('.service-item-edit');
        serviceItems.forEach(item => {
            const priceInput = item.querySelector('.service-price-input');
            if (priceInput) {
                this.updateServicePrice(priceInput);
            }
        });
    }

    _renderServiceItem(service, index, isEditMode, duration) {
        const rowTotal = (parseFloat(service.price) || 0) * duration;
        
        if (isEditMode) {
            return `
                <div class="service-item service-item-edit" data-index="${index}">
                    <div class="service-header">
                        <div class="service-title-row">
                            <div class="service-title-input-wrapper">
                                <input type="text" 
                                       class="service-title-input autocomplete-input" 
                                       value="${this._escapeHtml(service.title)}" 
                                       placeholder="Service Name" 
                                       form="sidesheet-form">
                                <div class="autocomplete-dropdown d-none"></div>
                            </div>
                            <div class="service-badge-wrapper">
                                <span class="service-badge dept-tag">${this._escapeHtml(service.dept || 'Dept')}</span>
                                <input type="hidden" class="dept-input" value="${this._escapeHtml(service.dept || '')}" form="sidesheet-form">
                                <button type="button" class="service-delete-btn">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <textarea class="service-description-input" 
                              placeholder="Description..." 
                              form="sidesheet-form">${this._escapeHtml(service.description || '')}</textarea>
                    <div class="service-meta">
                        <div class="service-interval">
                            <i class="fas fa-clock"></i>
                            <input type="text" 
                                   class="service-interval-input" 
                                   value="${this._escapeHtml(service.interval || '')}" 
                                   placeholder="Daily" 
                                   form="sidesheet-form">
                        </div>
                        <div class="service-price">
                            <div class="service-price-input-wrapper">
                                <span class="price-currency">฿</span>
                                <input type="number" 
                                       class="service-price-input base-price-input" 
                                       value="${service.price || 0}" 
                                       form="sidesheet-form">
                            </div>
                            <div class="service-price-total">
                                <span class="price-label">Total</span>
                                <span class="price-value">฿<span class="row-total-price">${rowTotal.toLocaleString()}</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="service-item">
                    <div class="service-header">
                        <div class="service-title-row">
                            <h3 class="service-title">${this._escapeHtml(service.title)}</h3>
                            <span class="service-badge">${this._escapeHtml(service.dept)}</span>
                        </div>
                    </div>
                    ${service.description ? `
                        <p class="service-description">${this._escapeHtml(service.description)}</p>
                    ` : ''}
                    <div class="service-meta">
                        <div class="service-interval">
                            <i class="fas fa-clock"></i>
                            <span>${this._escapeHtml(service.interval || 'N/A')}</span>
                        </div>
                        ${service.price ? `
                            <div class="service-price">
                                <span class="price-label">Price</span>
                                <span class="price-value">฿${parseFloat(service.price || 0).toLocaleString()}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    }

    addService() {
        const servicesList = this.querySelector('#services-list');
        if (!servicesList) return;
        
        const emptyState = this.querySelector('.empty-services');
        if (emptyState) {
            emptyState.remove();
        }
        
        const newService = {
            title: '',
            dept: '',
            interval: '',
            price: 0,
            description: ''
        };
        
        const pkg = this.packageData;
        const services = pkg.services || [];
        services.push(newService);
        pkg.services = services;
        
        this.setAttribute('package-data', JSON.stringify(pkg));
    }

    removeService(button) {
        const serviceItem = button.closest('.service-item-edit');
        if (!serviceItem) return;
        
        const index = parseInt(serviceItem.getAttribute('data-index'));
        const pkg = this.packageData;
        const services = pkg.services || [];
        services.splice(index, 1);
        pkg.services = services;
        
        this.setAttribute('package-data', JSON.stringify(pkg));
    }

    updateServicePrice(input) {
        const serviceItem = input.closest('.service-item-edit');
        if (!serviceItem) return;
        
        const priceInput = serviceItem.querySelector('.service-price-input');
        const durationInput = this.querySelector('.package-duration-input');
        const duration = durationInput ? parseInt(durationInput.value) || 0 : (this.packageData.duration || 0);
        const price = parseFloat(priceInput.value) || 0;
        const total = price * duration;
        
        const totalEl = serviceItem.querySelector('.row-total-price');
        if (totalEl) {
            totalEl.textContent = total.toLocaleString();
        }
    }

    async showAutocomplete(input) {
        const dropdown = input.nextElementSibling;
        if (!dropdown || !dropdown.classList.contains('autocomplete-dropdown')) return;
        
        try {
            const teams = await API.getTeams();
            const assignments = teams.flatMap(t => (t.assignmentTypes || []).map(a => ({ ...a, dept: t.dept })));
            this.renderAutocompleteItems(input, dropdown, assignments);
            dropdown.classList.remove('d-none');
        } catch (error) {
            console.error('Error loading autocomplete:', error);
        }
    }

    async handleAutocomplete(input) {
        const dropdown = input.nextElementSibling;
        if (!dropdown || !dropdown.classList.contains('autocomplete-dropdown')) return;
        
        const query = input.value.toLowerCase();
        try {
            const teams = await API.getTeams();
            const assignments = teams.flatMap(t => (t.assignmentTypes || []).map(a => ({ ...a, dept: t.dept })))
                .filter(a => a.name.toLowerCase().includes(query));
            this.renderAutocompleteItems(input, dropdown, assignments);
        } catch (error) {
            console.error('Error filtering autocomplete:', error);
        }
    }

    renderAutocompleteItems(input, dropdown, items) {
        dropdown.innerHTML = items.map(item => `
            <div class="autocomplete-item" data-item-id="${item.id}" data-item-name="${this._escapeHtml(item.name).replace(/'/g, "&#39;")}" data-item-dept="${this._escapeHtml(item.dept).replace(/'/g, "&#39;")}" data-item-price="${item.price}" data-item-desc="${this._escapeHtml(item.description || '').replace(/'/g, "&#39;")}">
                <div class="fw-bold">${this._escapeHtml(item.name)}</div>
                <div class="extra-small">${this._escapeHtml(item.dept)} - ฿${item.price}</div>
            </div>
        `).join('') || '<div class="autocomplete-item"><div class="extra-small">No matches found</div></div>';
        
        // Attach click handlers to autocomplete items
        dropdown.querySelectorAll('.autocomplete-item').forEach(itemEl => {
            itemEl.addEventListener('click', () => {
                const id = itemEl.getAttribute('data-item-id');
                const name = itemEl.getAttribute('data-item-name');
                const dept = itemEl.getAttribute('data-item-dept');
                const price = itemEl.getAttribute('data-item-price');
                const desc = itemEl.getAttribute('data-item-desc');
                this.selectAssignmentType(itemEl, id, name, dept, price, desc);
            });
        });
    }

    selectAssignmentType(itemEl, id, name, dept, price, description) {
        const serviceItem = itemEl.closest('.service-item-edit');
        if (!serviceItem) return;
        
        const titleInput = serviceItem.querySelector('.service-title-input');
        const deptTag = serviceItem.querySelector('.dept-tag');
        const deptInput = serviceItem.querySelector('.dept-input');
        const descInput = serviceItem.querySelector('.service-description-input');
        const priceInput = serviceItem.querySelector('.service-price-input');
        const intervalInput = serviceItem.querySelector('.service-interval-input');
        
        if (titleInput) titleInput.value = name;
        if (deptTag) deptTag.textContent = dept;
        if (deptInput) deptInput.value = dept;
        if (descInput) descInput.value = description;
        if (priceInput) priceInput.value = price;
        if (intervalInput && !intervalInput.value) intervalInput.value = 'Daily';
        
        const dropdown = itemEl.closest('.autocomplete-dropdown');
        if (dropdown) dropdown.classList.add('d-none');
        
        if (priceInput) {
            this.updateServicePrice(priceInput);
        }
    }

    _escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

customElements.define('package-details', PackageDetails);

