/**
 * Sidesheet Helper Utility
 * Provides standardized way to implement sidesheets across all views
 */

const SidesheetHelper = (() => {
    /**
     * Escape HTML to prevent XSS
     */
    const escapeHtml = (text) => {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    /**
     * Build sidesheet HTML structure
     * @param {Object} options - Configuration options
     * @param {string} options.leftPane - HTML content for left pane
     * @param {string} options.rightPane - HTML content for right pane
     * @param {string} options.footerId - Unique ID for footer element
     * @param {string} options.entityId - Entity ID
     * @param {boolean} options.isEditMode - Whether in edit mode
     * @param {string} options.editHandler - Function name for edit handler (e.g., 'App.toggleEditMode')
     * @param {string} options.deleteHandler - Optional function name for delete handler
     * @param {string} options.extraActions - Optional extra action buttons HTML
     * @returns {string} Complete sidesheet HTML
     */
    const buildSidesheet = ({
        leftPane,
        rightPane,
        footerId,
        entityId,
        isEditMode = false,
        editHandler,
        deleteHandler = null,
        extraActions = '',
        editButtonText = null
    }) => {
        // Default button text based on edit handler name
        const defaultEditText = editButtonText || (editHandler.includes('Package') ? 'Edit Package' : 
                                                   editHandler.includes('Team') ? 'Edit Team' : 
                                                   editHandler.includes('Staff') ? 'Edit Staff' : 'Edit');
        const buttonText = isEditMode ? 'Save Changes' : defaultEditText;
        const editButtonType = isEditMode ? 'type="submit" form="sidesheet-form"' : '';
        const editButtonOnclick = isEditMode ? '' : `onclick="${editHandler}('${entityId}')"`;

        return `
            <div slot="left">
                ${leftPane}
            </div>

            <div slot="right">
                ${rightPane}
            </div>

            <sidesheet-footer slot="footer" id="${footerId}">
                ${deleteHandler ? `<button class="danger outline" slot="extra-actions" onclick="${deleteHandler}('${entityId}')">Delete</button>` : ''}
                ${extraActions}
                <button class="primary" id="edit-save-btn-${entityId}" slot="save-btn" ${editButtonType} ${editButtonOnclick}>${buttonText}</button>
            </sidesheet-footer>
        `;
    };

    /**
     * Standard edit mode toggle handler
     * @param {string} entityType - Type of entity ('package', 'team', 'staff')
     * @param {string} entityId - Entity ID
     * @param {Function} renderFunction - Function to render detail view (entity, mode)
     * @param {Function} saveFunction - Function to handle save
     */
    const createToggleHandler = (entityType, entityId, renderFunction, saveFunction) => {
        return async () => {
            const btn = document.getElementById(`edit-save-btn-${entityId}`);
            if (!btn) return;

            const currentMode = btn.textContent === 'Edit' || btn.textContent.includes('Edit') ? 'display' : 'edit';
            const newMode = currentMode === 'display' ? 'edit' : 'display';

            if (newMode === 'edit') {
                // Enter edit mode - reload entity and render in edit mode
                const entity = await getEntityById(entityType, entityId);
                if (entity) {
                    const sideSheet = document.getElementById('side-sheet');
                    sideSheet.setAttribute('title', entity.name || `${entityType} Details`);
                    App.updateSidesheetContent(renderFunction(entity, 'edit'));
                    updateButtonState(entityId, 'edit', entityType);
                }
            } else {
                // Save changes
                const form = document.querySelector('#sidesheet-form');
                if (form && saveFunction) {
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    form.dispatchEvent(submitEvent);
                    if (!submitEvent.defaultPrevented) {
                        await saveFunction({ target: form, preventDefault: () => {} });
                    }
                }
            }
        };
    };

    /**
     * Get entity by type and ID
     */
    const getEntityById = async (type, id) => {
        switch (type) {
            case 'package':
                return await API.getPackageById(id);
            case 'team':
                const teams = await API.getTeams();
                return teams.find(t => t.id === id);
            case 'staff':
                const staff = await API.getStaff();
                return staff.find(s => s.id === id);
            default:
                return null;
        }
    };

    /**
     * Update button state
     */
    const updateButtonState = (entityId, mode, entityType = '') => {
        const btn = document.getElementById(`edit-save-btn-${entityId}`);
        if (!btn) return;

        if (mode === 'edit') {
            btn.textContent = 'Save Changes';
            btn.setAttribute('type', 'submit');
            btn.setAttribute('form', 'sidesheet-form');
            btn.removeAttribute('onclick');
            btn.onclick = null;
            
            const sideSheet = document.getElementById('side-sheet');
            if (sideSheet) {
                const currentTitle = sideSheet.getAttribute('title');
                if (!currentTitle.includes('Edit')) {
                    sideSheet.setAttribute('title', `Edit ${currentTitle}`);
                }
            }
        } else {
            const editHandler = getEditHandlerName(entityType);
            btn.textContent = editHandler.replace('App.', '').replace(`('${entityId}')`, '');
            btn.removeAttribute('type');
            btn.removeAttribute('form');
            btn.setAttribute('onclick', `${editHandler}('${entityId}')`);
        }
    };

    /**
     * Get edit handler name based on entity type
     */
    const getEditHandlerName = (entityType) => {
        switch (entityType) {
            case 'package':
                return 'App.toggleEditMode';
            case 'team':
                return 'App.toggleTeamEditMode';
            case 'staff':
                return 'App.toggleStaffEditMode';
            default:
                return 'App.toggleEditMode';
        }
    };

    /**
     * Standard form wrapper
     * @param {string} formId - Form ID
     * @param {string} entityId - Entity ID
     * @param {string} content - Form content HTML
     * @returns {string} Form HTML
     */
    const buildForm = (formId, entityId, content) => {
        return `
            <form id="${formId}">
                <input type="hidden" name="id" value="${entityId}" form="${formId}">
                ${content}
            </form>
        `;
    };

    /**
     * Standard section wrapper for left pane
     * @param {string} label - Section label
     * @param {string} content - Section content
     * @returns {string} Section HTML
     */
    const buildLeftSection = (label, content) => {
        return `
            <section class="mb-4">
                <label class="text-muted small d-block mb-1">${label}</label>
                ${content}
            </section>
        `;
    };

    /**
     * Standard field wrapper for right pane
     * @param {string} label - Field label
     * @param {string} content - Field content (input or display)
     * @returns {string} Field HTML
     */
    const buildField = (label, content) => {
        return `
            <div class="mb-4">
                <label class="form-label text-muted small d-block mb-2">${label}</label>
                ${content}
            </div>
        `;
    };

    return {
        escapeHtml,
        buildSidesheet,
        createToggleHandler,
        updateButtonState,
        buildForm,
        buildLeftSection,
        buildField,
        getEntityById
    };
})();

    