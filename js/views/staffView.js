const StaffView = (() => {
    return {
        render: async () => {
            const staff = await API.getStaff();

            let staffListHtml = staff.map(s => `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="bg-light rounded-circle me-3 d-flex align-items-center justify-content-center" style="width: 35px; height: 35px;">
                                <i class="fas fa-user text-secondary"></i>
                            </div>
                            <div>
                                <div class="fw-bold">${s.name}</div>
                                <div class="text-muted extra-small">ID: ${s.id}</div>
                            </div>
                        </div>
                    </td>
                    <td>${s.dept}</td>
                    <td>${s.role}</td>
                    <td><span class="badge bg-success-subtle text-success">${s.status}</span></td>
                    <td class="text-end">
                        <button class="tertiary" onclick="App.showDetail('staff', '${s.id}')">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

            return `
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="h4 mb-0">Staff Management</h2>
                    <button class="primary icon-start">
                        <i class="fas fa-user-plus"></i> Add Staff
                    </button>
                </div>

                <div class="card border-0 shadow-sm">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0">
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
                </div>
            `;
        },

        renderDetail: (staff) => {
            return `
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="mb-0">Staff Details</h4>
                    <button class="btn-close" onclick="App.hideDetail()"></button>
                </div>

                <div class="sheet-content">
                    <div class="sidesheet-left">
                        <!-- TOP: Staff Information -->
                        <div class="mb-4">
                            <label class="text-muted small d-block mb-1">Full Name</label>
                            <div class="h5 mb-0">${staff.name}</div>
                        </div>

                        <div class="mb-4">
                            <label class="text-muted small d-block mb-1">Staff ID</label>
                            <div class="fw-bold">${staff.id}</div>
                        </div>

                        <div class="mb-4">
                            <label class="text-muted small d-block mb-1">Department</label>
                            <span class="badge bg-light text-dark border">${staff.dept}</span>
                        </div>

                        <!-- BOTTOM: Additional Info -->
                        <div class="mt-5 pt-4 border-top">
                            <h6 class="mb-3">Current Assignment</h6>
                            <p class="text-muted small">Active in the ${staff.dept} department</p>
                        </div>
                    </div>

                    <div class="sidesheet-right">
                        <form id="staff-form" onsubmit="App.handleSaveStaff(event)">
                            <input type="hidden" name="id" value="${staff.id}">
                            
                            <div class="mb-4">
                                <label class="form-label text-muted small d-block mb-2">Role</label>
                                <input type="text" class="form-control bg-light border p-2" name="role" value="${staff.role || ''}">
                            </div>

                            <div class="mb-4">
                                <label class="form-label text-muted small d-block mb-2">Status</label>
                                <select class="form-select bg-light border p-2" name="status">
                                    <option value="Active" ${staff.status === 'Active' ? 'selected' : ''}>Active</option>
                                    <option value="Inactive" ${staff.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                                    <option value="Leave" ${staff.status === 'Leave' ? 'selected' : ''}>On Leave</option>
                                </select>
                            </div>

                            <div class="mb-4">
                                <label class="form-label text-muted small d-block mb-2">Department</label>
                                <input type="text" class="form-control bg-light border p-2" name="dept" value="${staff.dept || ''}" disabled>
                            </div>
                        </form>
                    </div>
                </div>
            `;
        }
    };
})();
