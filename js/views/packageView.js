const PackageView = (() => {
    return {
        render: async () => {
            const packages = await API.getPackages();

            let packageListHtml = packages.map(pkg => `
                <div class="col-md-4 mb-4">
                    <entity-card 
                        type="package" 
                        data='${JSON.stringify(pkg).replace(/'/g, "&#39;")}'>
                    </entity-card>
                </div>
            `).join('');

            return `
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="h4 mb-0">Package Management</h2>
                    <button class="primary icon-start" onclick="App.showCreatePackage()">
                        <i class="fas fa-plus"></i> Create Package
                    </button>
                </div>

                <div class="row">
                    ${packageListHtml}
                </div>
            `;
        },

        renderDetail: (pkg) => {
            return `
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="mb-0">Package Details</h4>
                    <button class="btn-close" onclick="App.hideDetail()"></button>
                </div>

                <div class="sheet-content">
                    <div class="sidesheet-left">
                        <!-- TOP: Package Details -->
                        <div class="mb-4">
                            <label class="text-muted small d-block mb-1">Package Name</label>
                            <div class="h5 mb-0">${pkg.name}</div>
                        </div>

                        <div class="mb-4">
                            <label class="text-muted small d-block mb-1">Price</label>
                            <div class="fw-bold h5">฿${(pkg.price || 0).toLocaleString()}</div>
                        </div>

                        <div class="mb-4">
                            <label class="text-muted small d-block mb-1">Duration</label>
                            <div class="fw-bold">${pkg.duration || 0} Days</div>
                        </div>

                        <!-- BOTTOM: Additional Info -->
                        <div class="mt-5 pt-4 border-top">
                            <h6 class="mb-3">Description</h6>
                            <p class="mb-0 text-secondary small">${pkg.description || 'No description provided.'}</p>
                        </div>
                    </div>

                    <div class="sidesheet-right">
                        <h6 class="mb-3">Service Assignments</h6>
                        <div class="list-group list-group-flush">
                            ${pkg.services && pkg.services.length > 0 ? pkg.services.map(s => `
                                <div class="list-group-item px-0 py-3 border-bottom">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <div class="fw-bold extra-small mb-1">${s.title}</div>
                                            <div class="text-muted extra-small">${s.interval}</div>
                                        </div>
                                        <span class="badge bg-light text-dark border extra-small">${s.dept}</span>
                                    </div>
                                    <div class="text-muted extra-small mt-2" style="font-size: 0.7rem;">${s.description || ''}</div>
                                </div>
                            `).join('') : '<div class="py-4 text-muted small text-center bg-light rounded-3">No services assigned.</div>'}
                        </div>
                    </div>
                </div>
                
                <div class="sidesheet-footer">
                    <button class="danger outline" onclick="App.handleDeletePackage('${pkg.id}')">Delete Package</button>
                    <button class="primary" onclick="App.showEditPackage('${pkg.id}')">Edit Package</button>
                </div>
            `;
        },

        renderCreateForm: (pkg = null) => {
            const isEdit = !!pkg;
            const services = pkg ? (pkg.services || []) : [];
            const totalPriceHint = services.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);

            return `
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="mb-0">Package Configuration</h4>
                    <button class="btn-close" onclick="App.hideDetail()"></button>
                </div>
                    
                <form id="package-form" onsubmit="App.handleSavePackage(event)">
                    <input type="hidden" name="id" value="${pkg ? pkg.id : ''}">
                    
                    <div class="sheet-content">
                        <div class="sidesheet-left">
                                <div class="mb-4">
                                    <label class="form-label text-muted small d-block mb-1">Package Name</label>
                                    <input type="text" class="form-control bg-light border p-3 fw-bold" name="name" required 
                                           placeholder="Ex. 20-day Elder Recreation" value="${pkg ? pkg.name : ''}">
                                </div>

                                <div class="row mb-4">
                                    <div class="col-6">
                                        <label class="form-label text-muted small d-block mb-1">Price (THB)</label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0">฿</span>
                                            <input type="number" class="form-control bg-light border-start-0 p-3 fw-bold" name="price" 
                                                   placeholder="85000" value="${pkg ? pkg.price : ''}">
                                        </div>
                                        <div class="extra-small text-primary mt-2" id="service-price-summary">
                                            <i class="fas fa-info-circle me-1"></i> Totals from services: ฿${totalPriceHint.toLocaleString()}
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label text-muted small d-block mb-1">Duration (Days)</label>
                                        <div class="input-group">
                                            <input type="number" class="form-control bg-light border-end-0 p-3 fw-bold" name="duration" required 
                                                   placeholder="20" value="${pkg ? pkg.duration : ''}" oninput="App.updateServicePriceSummary()">
                                            <span class="input-group-text bg-light border-start-0">Days</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label text-muted small d-block mb-1">Description</label>
                                    <textarea class="form-control bg-light border p-3 text-secondary" name="description" rows="5" 
                                              placeholder="Enter package details...">${pkg ? pkg.description : ''}</textarea>
                                </div>
                            </div>

                        <div class="sidesheet-right">
                            <div class="h6 mb-3 d-flex justify-content-between align-items-center">
                                <span>Services</span>
                                <button type="button" class="btn btn-sm btn-outline-primary" onclick="App.addServiceRow()">+ Add</button>
                            </div>
                                
                                <div id="services-container" style="max-height: 60vh; overflow-y: auto; padding-right: 5px;">
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
                                                        <span class="badge bg-light text-dark border extra-small dept-tag">${s.dept || 'Dept'}</span>
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
                    </div>
                </form>

                <div class="sidesheet-footer">
                    <button type="button" class="btn btn-outline-secondary sidesheet-btn" onclick="App.hideDetail()">Cancel</button>
                    <button type="submit" form="package-form" class="btn btn-primary sidesheet-btn">Save Template</button>
                </div>
            `;
        }
    };
})();
