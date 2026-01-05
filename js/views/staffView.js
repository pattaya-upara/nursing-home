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

        renderDetail: (staff) => {
            return `
                <div slot="left">
                    <!-- TOP: Staff Information -->
                    <section class="mb-4">
                        <label class="text-muted small d-block mb-1">Full Name</label>
                        <div class="h5 mb-0">${staff.name}</div>
                    </section>

                    <section class="mb-4">
                        <label class="text-muted small d-block mb-1">Staff ID</label>
                        <div class="fw-bold">${staff.id}</div>
                    </section>

                    <section class="mb-4">
                        <label class="text-muted small d-block mb-1">Department</label>
                        <span class="badge tertiary">${staff.dept}</span>
                    </section>

                    <!-- BOTTOM: Additional Info -->
                    <footer class="mt-5 pt-4 border-top">
                        <h6 class="mb-3">Current Assignment</h6>
                        <p class="text-muted small">Active in the ${staff.dept} department</p>
                    </footer>
                </div>

                <div slot="right">
                    <input type="hidden" name="id" value="${staff.id}" form="sidesheet-form">
                    
                    <div class="mb-4">
                        <label class="form-label text-muted small d-block mb-2">Role</label>
                        <input type="text" class="form-control bg-light border p-2" name="role" form="sidesheet-form" value="${staff.role || ''}">
                    </div>

                    <div class="mb-4">
                        <label class="form-label text-muted small d-block mb-2">Status</label>
                        <select class="form-select bg-light border p-2" name="status" form="sidesheet-form">
                            <option value="Active" ${staff.status === 'Active' ? 'selected' : ''}>Active</option>
                            <option value="Inactive" ${staff.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                            <option value="Leave" ${staff.status === 'Leave' ? 'selected' : ''}>On Leave</option>
                        </select>
                    </div>

                    <div class="mb-4">
                        <label class="form-label text-muted small d-block mb-2">Department</label>
                        <input type="text" class="form-control bg-light border p-2" name="dept" form="sidesheet-form" value="${staff.dept || ''}" disabled>
                    </div>
                </div>

                <sidesheet-footer slot="footer">
                    <button class="primary" slot="save-btn" type="submit" form="sidesheet-form">Save Changes</button>
                </sidesheet-footer>
            `;
        }
    };
})();
