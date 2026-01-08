const PackageView = (() => {
    return {
        render: async () => {
            const packages = await API.getPackages();

            let packageListHtml = packages.map(pkg => `
                <entity-card 
                    type="package" 
                    data='${JSON.stringify(pkg).replace(/'/g, "&#39;")}'>
                </entity-card>
            `).join('');

            return `
                <app-view-header>
                    <h2 slot="title">Package Management</h2>
                    <button slot="actions" class="primary icon-start" onclick="App.showCreatePackage()">
                        <i class="fas fa-plus"></i> Create Package
                    </button>
                </app-view-header>

                <div class="grid-layout cols-3">
                    ${packageListHtml}
                </div>
            `;
        },

        renderDetail: (pkg, mode = 'display') => {
            // #region agent log
            fetch('http://127.0.0.1:7244/ingest/519f29c6-6d7a-4252-9040-eba6090f87cd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'packageView.js:27',message:'renderDetail called',data:{pkgId:pkg.id,pkgName:pkg.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
            // #endregion
            
            // Inject styles if not already there
            if (!document.getElementById('package-details-styles')) {
                const style = document.createElement('style');
                style.id = 'package-details-styles';
                style.textContent = `
                    @import url("css/foundation/elements.css");
                    @import url("css/components/package-details.css");
                `;
                document.head.appendChild(style);
            }
            
            const services = pkg.services || [];
            const isEditMode = mode === 'edit';
            
            // Use helper for escaping HTML
            const escapeHtml = SidesheetHelper.escapeHtml;
            
            // Helper function to render service item
            const renderServiceItem = (service, index) => {
                const rowTotal = (parseFloat(service.price) || 0) * (pkg.duration || 0);
                if (isEditMode) {
                    return `
                        <div class="service-item service-item-edit" data-index="${index}">
                            <div class="service-header">
                                <div class="service-title-row">
                                    <div class="service-title-input-wrapper">
                                        <input type="text" 
                                               class="service-title-input autocomplete-input" 
                                               value="${escapeHtml(service.title)}" 
                                               placeholder="Service Name" 
                                               form="sidesheet-form">
                                        <div class="autocomplete-dropdown d-none"></div>
                                    </div>
                                    <div class="service-badge-wrapper">
                                        <span class="service-badge dept-tag">${escapeHtml(service.dept || 'Dept')}</span>
                                        <input type="hidden" class="dept-input" value="${escapeHtml(service.dept || '')}" form="sidesheet-form">
                                        <button type="button" class="service-delete-btn">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <textarea class="service-description-input" 
                                      placeholder="Description..." 
                                      form="sidesheet-form">${escapeHtml(service.description || '')}</textarea>
                            <div class="service-meta">
                                <div class="service-interval">
                                    <i class="fas fa-clock"></i>
                                    <input type="text" 
                                           class="service-interval-input" 
                                           value="${escapeHtml(service.interval || '')}" 
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
                                    <h3 class="service-title">${escapeHtml(service.title)}</h3>
                                    <span class="service-badge">${escapeHtml(service.dept)}</span>
                                </div>
                            </div>
                            ${service.description ? `
                                <p class="service-description">${escapeHtml(service.description)}</p>
                            ` : ''}
                            <div class="service-meta">
                                <div class="service-interval">
                                    <i class="fas fa-clock"></i>
                                    <span>${escapeHtml(service.interval || 'N/A')}</span>
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
            };
            
            // Left Pane: Description
            const leftPane = `
                <div class="package-details-left">
                    <section class="details-section">
                        <h2 class="section-title">Description</h2>
                        ${isEditMode ? `
                            <textarea class="description-input" name="description" form="sidesheet-form" placeholder="Enter package description...">${escapeHtml(pkg.description || '')}</textarea>
                        ` : pkg.description ? `
                            <p class="description-text">${escapeHtml(pkg.description)}</p>
                        ` : `
                            <p class="description-text text-muted">No description provided.</p>
                        `}
                    </section>
                </div>
            `;

            // Right Pane: Price, Duration, and Services
            const rightPaneContent = `
                <!-- Header Section -->
                <section class="details-header">
                    <div class="header-main">
                        ${isEditMode ? `
                            <input type="text" 
                                   class="package-name-input" 
                                   name="name" 
                                   value="${escapeHtml(pkg.name)}" 
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
                            ${services.map((service, index) => renderServiceItem(service, index)).join('')}
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
            `;

            const rightPane = `<div class="package-details-right">${SidesheetHelper.buildForm('sidesheet-form', pkg.id || '', rightPaneContent)}</div>`;

            return SidesheetHelper.buildSidesheet({
                leftPane,
                rightPane,
                footerId: `package-footer-${pkg.id}`,
                entityId: pkg.id,
                isEditMode,
                editHandler: 'App.toggleEditMode',
                deleteHandler: 'App.handleDeletePackage',
                extraActions: '',
                editButtonText: 'Edit Package'
            });
        },

        renderCreateForm: (pkg = null) => {
            const isEdit = !!pkg;
            const services = pkg ? (pkg.services || []) : [];
            const totalPriceHint = services.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);

            return `
                <div slot="left">
                    <input type="hidden" name="id" value="${pkg ? pkg.id : ''}" form="sidesheet-form">
                    
                    <div class="mb-4">
                        <label class="form-label text-muted small d-block mb-1">Package Name</label>
                        <input type="text" class="form-control fw-bold" name="name" required form="sidesheet-form"
                                placeholder="Ex. 20-day Elder Recreation" value="${pkg ? pkg.name : ''}">
                    </div>

                    <div class="row mb-4">
                        <div class="col-6">
                            <label class="form-label text-muted small d-block mb-1">Price (THB)</label>
                            <div class="input-group">
                                <span class="input-group-text">฿</span>
                                <input type="number" class="form-control fw-bold" name="price" form="sidesheet-form"
                                        placeholder="85000" value="${pkg ? pkg.price : ''}">
                            </div>
                            <div class="extra-small text-primary mt-2" id="service-price-summary">
                                <i class="fas fa-info-circle me-1"></i> Totals from services: ฿${totalPriceHint.toLocaleString()}
                            </div>
                        </div>
                        <div class="col-6">
                            <label class="form-label text-muted small d-block mb-1">Duration (Days)</label>
                            <div class="input-group">
                                <input type="number" class="form-control fw-bold" name="duration" required form="sidesheet-form"
                                        placeholder="20" value="${pkg ? pkg.duration : ''}" oninput="App.updateServicePriceSummary()">
                                <span class="input-group-text">Days</span>
                            </div>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="form-label text-muted small d-block mb-1">Description</label>
                        <textarea class="form-control text-secondary" name="description" rows="5" form="sidesheet-form"
                                    placeholder="Enter package details...">${pkg ? pkg.description : ''}</textarea>
                    </div>
                </div>

                <div slot="right">
                    <div class="h6 mb-3 d-flex justify-content-between align-items-center">
                        <span>Services</span>
                        <button type="button" class="btn btn-sm btn-outline-primary" onclick="App.addServiceRow()">+ Add</button>
                    </div>
                        
                    <div id="services-container" style="flex: 1; overflow-y: auto; padding-right: 5px;">
                        ${services.length > 0 ? services.map((s, index) => {
                            const rowTotal = (parseFloat(s.price) || 0) * (pkg ? pkg.duration : 0);
                            return `
                                <div class="p-3 bg-white rounded-3 mb-3 border service-row shadow-sm">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <div class="flex-grow-1 position-relative">
                                            <input type="text" class="form-control border-0 fw-bold p-0 bg-transparent extra-small service-title-input autocomplete-input" 
                                                    value="${s.title}" placeholder="Service Name" onfocus="App.showAutocomplete(this)" oninput="App.handleAutocomplete(this)">
                                            <div class="autocomplete-dropdown shadow-lg rounded-3 d-none"></div>
                                        </div>
                                        <div class="ms-2 d-flex align-items-center">
                                            <span class="badge tertiary extra-small dept-tag">${s.dept || 'Dept'}</span>
                                            <input type="hidden" class="dept-input" value="${s.dept || ''}">
                                            <button type="button" class="btn btn-link text-danger p-0 ms-2" onclick="App.removeServiceRow(this)">
                                                <i class="fas fa-trash fa-xs"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div class="mb-2">
                                        <textarea class="form-control border-0 p-0 text-muted extra-small bg-transparent description-input" 
                                                    rows="1" placeholder="Description..." style="font-size: 0.7rem;">${s.description || ''}</textarea>
                                    </div>

                                    <div class="row align-items-center g-1">
                                        <div class="col-4">
                                            <input type="text" class="form-control form-control-sm border-0 p-0 bg-transparent extra-small interval-input" 
                                                    value="${s.interval || ''}" placeholder="Daily" oninput="App.updateServicePriceSummary()">
                                        </div>
                                        <div class="col-4 border-start border-end text-center">
                                            <div class="d-flex align-items-center justify-content-center">
                                                <span class="extra-small me-1">฿</span>
                                                <input type="number" class="form-control form-control-sm border-0 p-0 bg-transparent fw-bold base-price-input text-center extra-small" 
                                                        style="width: 40px;" value="${s.price || 0}" oninput="App.updateServicePriceSummary()">
                                            </div>
                                        </div>
                                        <div class="col-4 text-end">
                                            <div class="fw-bold text-primary extra-small">฿<span class="row-total-price">${rowTotal.toLocaleString()}</span></div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('') : `
                            <div class="p-4 bg-light rounded-3 border border-dashed text-center">
                                <i class="fas fa-box-open fa-2x text-muted mb-2 d-block"></i>
                                <p class="text-muted extra-small mb-0">No services yet.<br>Click "+ Add" to start.</p>
                            </div>
                        `}
                    </div>
                </div>
                
                <sidesheet-footer slot="footer" id="package-form-footer">
                    <button class="primary" slot="save-btn" type="submit" form="sidesheet-form">Save Template</button>
                </sidesheet-footer>
            `;
        }
    };
})();
