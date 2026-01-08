const StaffView = (() => {
    return {
        render: async () => {
            const staff = await API.getStaff();

            let staffListHtml = staff.map(s => `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar md me-3">
                                <i class="fas fa-user"></i>
                            </div>
                            <div>
                                <div class="fw-bold">${s.name}</div>
                                <div class="text-muted extra-small">ID: ${s.id}</div>
                            </div>
                        </div>
                    </td>
                    <td>${s.dept}</td>
                    <td>${s.role}</td>
                    <td><span class="badge success">${s.status}</span></td>
                    <td class="text-end">
                        <button class="tertiary" onclick="App.showDetail('staff', '${s.id}')">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

            return `
                <app-view-header>
                    <h2 slot="title">Staff Management</h2>
                    <button slot="actions" class="primary icon-start">
                        <i class="fas fa-user-plus"></i> Add Staff
                    </button>
                </app-view-header>

                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${staffListHtml}
                        </tbody>
                    </table>
                </div>
            `;
        },

        renderDetail: (staff, mode = 'display') => {
            const isEditMode = mode === 'edit';

            // Left Pane: Staff Information
            const leftPane = `
                ${SidesheetHelper.buildLeftSection('Full Name', `<div class="h5 mb-0">${SidesheetHelper.escapeHtml(staff.name)}</div>`)}
                ${SidesheetHelper.buildLeftSection('Staff ID', `<div class="fw-bold">${SidesheetHelper.escapeHtml(staff.id)}</div>`)}
                ${SidesheetHelper.buildLeftSection('Department', `<span class="badge tertiary">${SidesheetHelper.escapeHtml(staff.dept)}</span>`)}
                
                <footer class="mt-5 pt-4 border-top">
                    <h6 class="mb-3">Current Assignment</h6>
                    <p class="text-muted small">Active in the ${SidesheetHelper.escapeHtml(staff.dept)} department</p>
                </footer>
            `;

            // Right Pane: Form Fields
            const rightPaneContent = `
                ${SidesheetHelper.buildField('Role', isEditMode ? 
                    `<input type="text" class="form-control" name="role" form="sidesheet-form" value="${SidesheetHelper.escapeHtml(staff.role || '')}">` :
                    `<div class="fw-bold">${SidesheetHelper.escapeHtml(staff.role || 'N/A')}</div>`
                )}
                ${SidesheetHelper.buildField('Status', isEditMode ? 
                    `<select class="form-select" name="status" form="sidesheet-form">
                        <option value="Active" ${staff.status === 'Active' ? 'selected' : ''}>Active</option>
                        <option value="Inactive" ${staff.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                        <option value="Leave" ${staff.status === 'Leave' ? 'selected' : ''}>On Leave</option>
                    </select>` :
                    `<span class="badge success">${SidesheetHelper.escapeHtml(staff.status || 'N/A')}</span>`
                )}
                ${SidesheetHelper.buildField('Department', `<div class="fw-bold">${SidesheetHelper.escapeHtml(staff.dept || 'N/A')}</div>`)}
            `;

            const rightPane = SidesheetHelper.buildForm('sidesheet-form', staff.id, rightPaneContent);

            return SidesheetHelper.buildSidesheet({
                leftPane,
                rightPane,
                footerId: `staff-footer-${staff.id}`,
                entityId: staff.id,
                isEditMode,
                editHandler: 'App.toggleStaffEditMode'
            });
        }
    };
})();
