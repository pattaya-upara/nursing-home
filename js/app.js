/**
 * Main Application Controller for bourbon3
 */

const App = (() => {
    let currentView = 'dashboard';
    const mainContent = document.getElementById('main-content');
    const sideSheet = document.getElementById('side-sheet');
    const modal = document.getElementById('app-modal');
    const snackbar = document.getElementById('app-snackbar');

    const init = async () => {
        setupListeners();
        render();
    };

    const setupListeners = () => {
        // Handle Navigation
        document.addEventListener('click', (e) => {
            const link = e.target.closest('.nav-link');
            if (link && link.closest('#sidebar')) {
                e.preventDefault();
                const view = link.getAttribute('data-view');
                if (view) {
                    navigateTo(view);
                }
            }
        });

        // Handle sidesheet closing
        sideSheet.addEventListener('close', () => hideDetail());

        // Listen for entity-card clicks (web component events)
        document.addEventListener('card-click', (e) => {
            const { type, id } = e.detail;
            showDetail(type, id);
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.position-relative')) {
                document.querySelectorAll('.autocomplete-dropdown').forEach(d => d.classList.add('d-none'));
            }
        });
    };

    const navigateTo = (view) => {
        currentView = view;

        // Update Navigation UI
        document.querySelectorAll('#sidebar .nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-view') === view);
        });

        render();
        hideDetail(); // Close detail sheet when navigating
    };

    const render = async () => {
        mainContent.innerHTML = '<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"></div></div>';

        let html = '';
        switch (currentView) {
            case 'dashboard':
                html = await DashboardView.render();
                break;
            case 'packages':
                html = await PackageView.render();
                break;
            case 'teams':
                html = await TeamView.render();
                break;
            case 'staff':
                html = await StaffView.render();
                break;
            default:
                html = '<h2>Page not found</h2>';
        }

        mainContent.innerHTML = html;
    };

    const showDetail = async (type, id) => {
        sideSheet.innerHTML = '<div class="text-center" style="padding: 3em;"><div class="spinner-border text-primary" role="status"></div></div>';
        sideSheet.setAttribute('open', '');

        if (type === 'package') {
            const pkg = await API.getPackageById(id);
            // #region agent log
            fetch('http://127.0.0.1:7244/ingest/519f29c6-6d7a-4252-9040-eba6090f87cd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.js:87',message:'showDetail: package found',data:{pkgId:pkg.id,pkgName:pkg.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            sideSheet.setAttribute('title', pkg.name || 'Package Details');
            updateSidesheetContent(PackageView.renderDetail(pkg, 'display'));
            // Set up initial button state
            setTimeout(() => {
                updateEditButton(pkg.id, 'display');
            }, 0);
        } else if (type === 'team') {
            const teams = await API.getTeams();
            const team = teams.find(t => t.id === id);
            if (team) {
                sideSheet.setAttribute('title', team.name || 'Team Details');
                updateSidesheetContent(TeamView.renderDetail(team, 'display'));
            }
        } else if (type === 'staff') {
            const staffList = await API.getStaff();
            const staff = staffList.find(s => s.id === id);
            if (staff) {
                sideSheet.setAttribute('title', staff.name || 'Staff Details');
                updateSidesheetContent(StaffView.renderDetail(staff, 'display'));
            }
        }
    };

    const updateSidesheetContent = (html) => {
        // New system: View returns pre-slotted HTML blocks
        sideSheet.innerHTML = html;
    };

    const hideDetail = () => {
        sideSheet.removeAttribute('open');
    };

    const showCreatePackage = () => {
        sideSheet.innerHTML = PackageView.renderCreateForm();
        sideSheet.classList.add('open');
        overlay.classList.add('active');
        updateServicePriceSummary();
    };

    const toggleTeamEditMode = async (id) => {
        const teams = await API.getTeams();
        const team = teams.find(t => t.id === id);
        if (!team) return;
        
        const btn = document.getElementById(`edit-save-btn-${id}`);
        if (!btn) return;
        
        const isEditMode = btn.textContent === 'Edit Team';
        const newMode = isEditMode ? 'edit' : 'display';
        updateSidesheetContent(TeamView.renderDetail(team, newMode));
        
        // Set up form submission if switching to edit mode
        if (newMode === 'edit') {
            setTimeout(() => {
                const form = document.getElementById('sidesheet-form');
                if (form) {
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        handleSaveTeam(e);
                    });
                }
            }, 0);
        }
    };

    const toggleStaffEditMode = async (id) => {
        const staffList = await API.getStaff();
        const staff = staffList.find(s => s.id === id);
        if (!staff) return;
        
        const btn = document.getElementById(`edit-save-btn-${id}`);
        if (!btn) return;
        
        const isEditMode = btn.textContent === 'Edit Staff';
        const newMode = isEditMode ? 'edit' : 'display';
        updateSidesheetContent(StaffView.renderDetail(staff, newMode));
        
        // Set up form submission if switching to edit mode
        if (newMode === 'edit') {
            setTimeout(() => {
                const form = document.getElementById('sidesheet-form');
                if (form) {
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        handleSaveStaff(e);
                    });
                }
            }, 0);
        }
    };

    const toggleEditMode = async (id) => {
        const btn = document.getElementById(`edit-save-btn-${id}`);
        if (!btn) return;
        
        const currentMode = btn.textContent === 'Edit Package' ? 'display' : 'edit';
        const newMode = currentMode === 'display' ? 'edit' : 'display';
        
        if (newMode === 'edit') {
            // Enter edit mode - reload package and render in edit mode
            const pkg = await API.getPackageById(id);
            sideSheet.setAttribute('title', pkg.name || 'Package Details');
            updateSidesheetContent(PackageView.renderDetail(pkg, 'edit'));
            updateEditButton(id, 'edit');
        } else {
            // Save changes
            const form = document.querySelector('#sidesheet-form');
            if (form) {
                const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                form.dispatchEvent(submitEvent);
                if (!submitEvent.defaultPrevented) {
                    await handleSavePackage({ target: form, preventDefault: () => {} });
                }
            }
        }
    };

    const showEditPackage = async (id) => {
        const pkg = await API.getPackageById(id);
        sideSheet.setAttribute('open', '');
        sideSheet.setAttribute('title', 'Package Details');
        sideSheet.innerHTML = `
            <package-details id="package-details-${pkg.id}" package-data='${JSON.stringify(pkg).replace(/'/g, "&#39;")}' mode="display"></package-details>
            <sidesheet-footer slot="footer" id="package-footer-${pkg.id}">
                <button class="danger outline" slot="extra-actions" onclick="App.handleDeletePackage('${pkg.id}')">Delete Package</button>
                <button class="primary" id="edit-save-btn-${pkg.id}" onclick="App.toggleEditMode('${pkg.id}')">Edit Package</button>
            </sidesheet-footer>
        `;
        
        // Listen for mode changes to update button
        const packageDetails = document.getElementById(`package-details-${pkg.id}`);
        if (packageDetails) {
            packageDetails.addEventListener('mode-changed', (e) => {
                updateEditButton(id, e.detail.mode);
            });
        }
    };

    const updateEditButton = (id, mode) => {
        const btn = document.getElementById(`edit-save-btn-${id}`);
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/519f29c6-6d7a-4252-9040-eba6090f87cd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.js:168',message:'updateEditButton called',data:{id,mode,btnFound:!!btn,btnTextBefore:btn?.textContent,btnTypeBefore:btn?.getAttribute('type'),btnFormBefore:btn?.getAttribute('form')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        if (!btn) {
            // #region agent log
            fetch('http://127.0.0.1:7244/ingest/519f29c6-6d7a-4252-9040-eba6090f87cd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.js:170',message:'Button not found',data:{id,mode},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
            // #endregion
            return;
        }
        
        if (mode === 'edit') {
            btn.textContent = 'Save Changes';
            btn.setAttribute('type', 'submit');
            btn.setAttribute('form', 'sidesheet-form');
            // Remove onclick - submit button will naturally submit the form
            btn.removeAttribute('onclick');
            btn.onclick = null;
            // Update sidesheet title
            const sideSheet = document.getElementById('side-sheet');
            if (sideSheet) {
                sideSheet.setAttribute('title', 'Edit Package');
            }
            // #region agent log
            fetch('http://127.0.0.1:7244/ingest/519f29c6-6d7a-4252-9040-eba6090f87cd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.js:173',message:'Button updated to Save Changes',data:{id,mode,btnTextAfter:btn.textContent,btnTypeAfter:btn.getAttribute('type'),btnFormAfter:btn.getAttribute('form')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
        } else {
            btn.textContent = 'Edit Package';
            btn.removeAttribute('type');
            btn.removeAttribute('form');
            // Restore onclick handler for edit mode
            btn.setAttribute('onclick', `App.toggleEditMode('${id}')`);
            btn.onclick = function() { App.toggleEditMode(id); };
            // Title stays as item name, no need to change
            // #region agent log
            fetch('http://127.0.0.1:7244/ingest/519f29c6-6d7a-4252-9040-eba6090f87cd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.js:185',message:'Button updated to Edit Package',data:{id,mode,btnTextAfter:btn.textContent,btnTypeAfter:btn.getAttribute('type'),btnFormAfter:btn.getAttribute('form'),btnOnclickAfter:btn.getAttribute('onclick'),btnVisible:btn.offsetParent!==null,btnDisplay:window.getComputedStyle(btn).display},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            // Check button state after a short delay to see if it gets overwritten
            setTimeout(() => {
                const btnAfter = document.getElementById(`edit-save-btn-${id}`);
                // #region agent log
                fetch('http://127.0.0.1:7244/ingest/519f29c6-6d7a-4252-9040-eba6090f87cd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.js:197',message:'Button state check after delay',data:{id,mode,btnFound:!!btnAfter,btnTextAfterDelay:btnAfter?.textContent,btnTypeAfterDelay:btnAfter?.getAttribute('type')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
                // #endregion
            }, 100);
        }
    };

    const handleSavePackage = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Collect services from package-details component (light DOM)
        const services = [];
        const packageDetails = document.querySelector('package-details');
        
        if (packageDetails) {
            const serviceItems = packageDetails.querySelectorAll('.service-item-edit');
            serviceItems.forEach(item => {
                const titleInput = item.querySelector('.service-title-input');
                const deptInput = item.querySelector('.dept-input');
                const intervalInput = item.querySelector('.service-interval-input');
                const priceInput = item.querySelector('.service-price-input');
                const descInput = item.querySelector('.service-description-input');
                
                if (titleInput && titleInput.value.trim()) {
                    services.push({
                        title: titleInput.value.trim(),
                        dept: deptInput ? deptInput.value : '',
                        interval: intervalInput ? intervalInput.value : '',
                        price: parseFloat(priceInput ? priceInput.value : 0) || 0,
                        description: descInput ? descInput.value : ''
                    });
                }
            });
        } else {
            // Fallback to old form structure if package-details not found
            const serviceRows = document.querySelectorAll('.service-row');
            serviceRows.forEach(row => {
                const titleInput = row.querySelector('.service-title-input');
                const deptInput = row.querySelector('.dept-input');
                const intervalInput = row.querySelector('.interval-input');
                const priceInput = row.querySelector('.base-price-input');
                const descInput = row.querySelector('.description-input');
                
                if (titleInput && titleInput.value.trim()) {
                    services.push({
                        title: titleInput.value.trim(),
                        dept: deptInput ? deptInput.value : '',
                        interval: intervalInput ? intervalInput.value : '',
                        price: parseFloat(priceInput ? priceInput.value : 0) || 0,
                        description: descInput ? descInput.value : ''
                    });
                }
            });
        }

        const pkgData = {
            id: formData.get('id') || null,
            name: formData.get('name'),
            price: parseFloat(formData.get('price')) || 0,
            duration: parseInt(formData.get('duration')),
            description: formData.get('description'),
            services: services
        };

        const submitBtn = e.target.querySelector('button[type="submit"]') || document.querySelector('button[type="submit"][form="sidesheet-form"]');

        if (submitBtn) {
            submitBtn.disabled = true;
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Saving...';

            try {
                await API.savePackage(pkgData);
                // Switch back to display mode instead of closing
                const pkgId = pkgData.id;
                // Reload package data to show updated values
                const updatedPkg = await API.getPackageById(pkgId);
                sideSheet.setAttribute('title', updatedPkg.name || 'Package Details');
                updateSidesheetContent(PackageView.renderDetail(updatedPkg, 'display'));
                // Update button back to Edit
                updateEditButton(pkgId, 'display');
                render(); // Refresh list
                showSnackbar("Package saved successfully", "success");
            } catch (error) {
                showAlert("Save Failed", "Error saving package", "danger");
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        }
    };

    const addServiceRow = () => {
        const container = document.getElementById('services-container');
        const emptyState = container.querySelector('.border-dashed');
        if (emptyState) container.innerHTML = '';

        const row = document.createElement('div');
        row.className = 'p-4 bg-white rounded-3 mb-3 border service-row shadow-sm';
        row.innerHTML = `
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="flex-grow-1 position-relative">
                    <input type="text" class="form-control border-0 fw-bold p-0 bg-transparent service-title-input autocomplete-input" 
                           placeholder="Service Name" onfocus="App.showAutocomplete(this)" oninput="App.handleAutocomplete(this)">
                    <div class="autocomplete-dropdown shadow-lg rounded-3 d-none"></div>
                </div>
                <div class="ms-2 d-flex align-items-center">
                    <span class="badge bg-light text-dark border dept-tag">Department</span>
                    <input type="hidden" class="dept-input" value="">
                    <button type="button" class="btn btn-link text-danger p-0 ms-3" onclick="App.removeServiceRow(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>

            <div class="mb-3">
                <textarea class="form-control border-0 p-0 text-muted extra-small bg-transparent description-input" 
                          rows="1" placeholder="Service description..."></textarea>
            </div>

            <div class="row align-items-center">
                <div class="col-6">
                    <div class="d-flex align-items-center">
                        <i class="far fa-clock text-muted me-2 extra-small"></i>
                        <input type="text" class="form-control form-control-sm border-0 p-0 bg-transparent interval-input" 
                               placeholder="e.g. Daily" oninput="App.updateServicePriceSummary()">
                    </div>
                </div>
                <div class="col-6 text-end">
                    <div class="extra-small text-muted mb-1">Estimated Cost</div>
                    <div class="fw-bold">฿ <span class="row-total-price">0</span></div>
                    <input type="hidden" class="base-price-input" value="0">
                </div>
            </div>
        `;
        container.appendChild(row);
        updateServicePriceSummary();
    };

    const showAutocomplete = async (input) => {
        const dropdown = input.nextElementSibling;
        const teams = await API.getTeams();
        const assignments = teams.flatMap(t => (t.assignmentTypes || []).map(a => ({ ...a, dept: t.dept })));

        renderAutocompleteItems(input, dropdown, assignments);
        dropdown.classList.remove('d-none');
    };

    const handleAutocomplete = async (input) => {
        const query = input.value.toLowerCase();
        const dropdown = input.nextElementSibling;
        const teams = await API.getTeams();
        const assignments = teams.flatMap(t => (t.assignmentTypes || []).map(a => ({ ...a, dept: t.dept })))
            .filter(a => a.name.toLowerCase().includes(query));

        renderAutocompleteItems(input, dropdown, assignments);
    };

    const renderAutocompleteItems = (input, dropdown, items) => {
        dropdown.innerHTML = items.map(item => `
            <div class="autocomplete-item" onclick="App.selectAssignmentType(this, '${item.id}', '${item.name}', '${item.dept}', '${item.price}', '${item.description.replace(/'/g, "\\'")}')">
                <div class="fw-bold small">${item.name}</div>
                <div class="extra-small text-muted">${item.dept} - ฿${item.price}</div>
            </div>
        `).join('') || '<div class="p-3 text-muted extra-small">No matches found</div>';
    };

    const selectAssignmentType = (itemEl, id, name, dept, price, description) => {
        const row = itemEl.closest('.service-row');
        row.querySelector('.service-title-input').value = name;
        row.querySelector('.dept-tag').innerText = dept;
        row.querySelector('.dept-input').value = dept;
        row.querySelector('.description-input').value = description;
        row.querySelector('.base-price-input').value = price;
        row.querySelector('.interval-input').value = 'Daily'; // Default

        itemEl.parentElement.classList.add('d-none');
        updateServicePriceSummary();
    };

    const removeServiceRow = (btn) => {
        btn.closest('.service-row').remove();
        updateServicePriceSummary();

        const container = document.getElementById('services-container');
        if (container.children.length === 0) {
            container.innerHTML = `
                <div class="p-5 bg-light rounded-3 mb-4 border border-dashed text-center">
                    <i class="fas fa-box-open fa-2x text-muted mb-3 d-block"></i>
                    <p class="text-muted small mb-0">No services assigned yet.<br>Click "+ Add Service" to start building this package.</p>
                </div>
            `;
        }
    };

    const updateServicePriceSummary = () => {
        const durationInput = document.querySelector('input[name="duration"]');
        const duration = parseInt(durationInput?.value) || 0;

        const rows = document.querySelectorAll('.service-row');
        let total = 0;

        rows.forEach(row => {
            const basePriceInput = row.querySelector('.base-price-input');
            const basePrice = parseFloat(basePriceInput.value) || 0;
            // Simplified logic: price * duration
            const rowTotal = basePrice * duration;
            row.querySelector('.row-total-price').innerText = rowTotal.toLocaleString();
            total += rowTotal;
        });

        const summary = document.getElementById('service-price-summary');
        if (summary) {
            summary.innerHTML = `<i class="fas fa-info-circle me-1"></i> Totals from services: ฿${total.toLocaleString()}`;
        }
    };

    const handleSaveTeam = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const teamId = formData.get('id');

        const assignmentRows = document.querySelectorAll('.assignment-type-row');
        const assignments = Array.from(assignmentRows).map(row => ({
            id: row.querySelector('.at-id').value || 'at-' + Date.now() + Math.random(),
            name: row.querySelector('.at-name').value,
            price: parseFloat(row.querySelector('.at-price').value) || 0,
            description: row.querySelector('.at-desc').value
        }));

        const teamData = {
            id: teamId,
            assignmentTypes: assignments
        };

        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Saving...';

        try {
            await API.saveTeam(teamData);
            // Switch back to display mode instead of closing
            const teams = await API.getTeams();
            const updatedTeam = teams.find(t => t.id === teamId);
            if (updatedTeam) {
                updateSidesheetContent(TeamView.renderDetail(updatedTeam, 'display'));
            }
            render(); // Refresh list
            showSnackbar("Team settings updated", "success");
        } catch (error) {
            showAlert("Update Failed", "Error saving team settings", "danger");
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Save Changes';
        }
    };

    const addAssignmentRow = () => {
        const container = document.getElementById('team-assignments-container');
        if (!container) return;

        const row = document.createElement('div');
        row.className = 'py-3 assignment-type-row border-bottom d-flex justify-content-between align-items-start gap-4';
        row.innerHTML = `
            <div class="flex-1 d-flex flex-column gap-1">
                <input type="text" class="form-control border-0 fw-bold at-name p-0 bg-transparent" placeholder="New Service Name" form="sidesheet-form">
                <input type="text" class="form-control border-0 text-muted extra-small at-desc p-0 bg-transparent" placeholder="Brief description..." form="sidesheet-form">
            </div>
            <div class="d-flex align-items-center gap-3">
                <div class="d-flex align-items-center d-none">
                    <span class="primary fw-bold me-1">฿</span>
                    <input type="number" class="form-control border-0 fw-bold p-0 at-price text-end bg-transparent" style="width: 60px;" value="0" form="sidesheet-form">
                </div>
                <button type="button" class="tertiary" style="padding: 4px; min-width: auto; height: auto;" onclick="this.closest('.assignment-type-row').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <input type="hidden" class="at-id" value="" form="sidesheet-form">
        `;
        container.appendChild(row);
    };

    const handleDeletePackage = async (id) => {
        showConfirm(
            "Delete Package",
            "Are you sure you want to delete this package template? This cannot be undone.",
            async () => {
                try {
                    await API.deletePackage(id);
                    hideDetail();
                    render();
                    showSnackbar("Package deleted", "success");
                } catch (error) {
                    showAlert("Delete Failed", "Error deleting package", "danger");
                }
            },
            () => showSnackbar("Deletion cancelled", "info")
        );
    };

    const handleSaveStaff = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const staffData = {
            id: formData.get('id'),
            role: formData.get('role'),
            status: formData.get('status')
        };

        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Saving...';
        }

        try {
            await API.saveStaff(staffData);
            // Switch back to display mode instead of closing
            const staffList = await API.getStaff();
            const updatedStaff = staffList.find(s => s.id === staffData.id);
            if (updatedStaff) {
                updateSidesheetContent(StaffView.renderDetail(updatedStaff, 'display'));
            }
            render(); // Refresh list
            showSnackbar("Staff updated successfully", "success");
        } catch (error) {
            showAlert("Save Failed", "Error saving staff details", "danger");
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Save Changes';
            }
        }
    };

    const showAlert = (title, message, type = 'info') => {
        modal.show({ title, message, type: 'alert' });
    };

    const showConfirm = (title, message, onConfirm, onCancel) => {
        modal.show({ title, message, type: 'confirm', onConfirm, onCancel });
    };

    const showSnackbar = (message, type = 'info') => {
        snackbar.show(message, type);
    };

    return {
        init,
        showDetail,
        hideDetail,
        showCreatePackage,
        showEditPackage,
        toggleEditMode,
        updateEditButton,
        handleSavePackage,
        handleDeletePackage,
        handleSaveStaff,
        addServiceRow,
        removeServiceRow,
        updateServicePriceSummary,
        showAutocomplete,
        handleAutocomplete,
        selectAssignmentType,
        handleSaveTeam,
        addAssignmentRow,
        showAlert,
        showConfirm,
        showSnackbar
    };
})();

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
