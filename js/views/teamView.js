const TeamView = (() => {
    return {
        render: async () => {
            const teams = await API.getTeams();

            let teamListHtml = teams.map(team => `
                <div class="col-md-4 mb-4">
                    <entity-card 
                        type="team" 
                        data='${JSON.stringify(team).replace(/'/g, "&#39;")}'>
                    </entity-card>
                </div>
            `).join('');

            return `
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="h4 mb-0">Team Management</h2>
                    <button class="primary icon-start">
                        <i class="fas fa-plus"></i> Create Team
                    </button>
                </div>

                <div class="row">
                    ${teamListHtml}
                </div>
            `;
        },
        renderDetail: (team) => {
            const assignments = team.assignmentTypes || [];

            return `
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="mb-0">Team Details</h4>
                    <button class="btn-close" onclick="App.hideDetail()"></button>
                </div>

                <div class="sheet-content">
                    <div class="sidesheet-left">
                        <!-- TOP: Team Information -->
                        <div class="mb-4">
                            <label class="text-muted small d-block mb-1">Team Name</label>
                            <div class="h5 mb-0">${team.name}</div>
                        </div>

                        <div class="mb-4">
                            <label class="text-muted small d-block mb-1">Department</label>
                            <span class="badge bg-light text-dark border">${team.dept}</span>
                        </div>

                        <!-- BOTTOM: Team Members -->
                        <div class="mt-5 pt-4 border-top">
                            <h6 class="mb-3">Team Members</h6>
                            <div class="list-group list-group-flush">
                                ${team.members && team.members.length > 0 ? team.members.map(memberId => `
                                    <div class="list-group-item px-0 py-2">
                                        <div class="text-muted small">${memberId}</div>
                                    </div>
                                `).join('') : '<div class="text-muted small">No members assigned</div>'}
                            </div>
                        </div>
                    </div>

                    <div class="sidesheet-right">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="mb-0">Services</h6>
                            <button type="button" class="primary outline" onclick="App.addAssignmentRow()">+ Add</button>
                        </div>

                        <form id="team-form" onsubmit="App.handleSaveTeam(event)">
                            <input type="hidden" name="id" value="${team.id}">
                            <div id="team-assignments-container">
                                ${assignments.map((at, index) => `
                                    <div class="p-3 bg-light rounded-2 mb-3 assignment-type-row border">
                                        <div class="mb-2">
                                            <input type="text" class="form-control form-control-sm border-0 fw-bold at-name bg-light p-1" value="${at.name}" placeholder="Service Name">
                                        </div>
                                        <div class="mb-2">
                                            <input type="text" class="form-control form-control-sm border-0 text-muted extra-small at-desc bg-light p-1" value="${at.description}" placeholder="Description...">
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div class="input-group input-group-sm" style="width: 100px;">
                                                <span class="input-group-text bg-transparent border-0 pe-0">฿</span>
                                                <input type="number" class="form-control border-0 fw-bold p-0 at-price text-end" value="${at.price}">
                                            </div>
                                            <button type="button" class="btn btn-link btn-sm text-danger p-0" onclick="this.closest('.assignment-type-row').remove()">
                                                <i class="fas fa-trash fa-xs"></i>
                                            </button>
                                        </div>
                                        <input type="hidden" class="at-id" value="${at.id}">
                                    </div>
                                `).join('') || '<div class="p-3 text-muted small text-center bg-light rounded-2">No services registered</div>'}
                            </div>
                        </form>
                    </div>
                </div>
                
                <div class="sidesheet-footer">
                    <button class="secondary" onclick="App.hideDetail()">Cancel</button>
                    <button type="submit" form="team-form" class="primary">Save Changes</button>
                </div>
            `;
        }
    };
})();
