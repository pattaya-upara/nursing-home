const TeamView = (() => {
    return {
        render: async () => {
            const teams = await API.getTeams();

            let teamListHtml = teams.map(team => `
                <entity-card 
                    type="team" 
                    data='${JSON.stringify(team).replace(/'/g, "&#39;")}'>
                </entity-card>
            `).join('');

            return `
                <app-view-header>
                    <h2 slot="title">Team Management</h2>
                    <button slot="actions" class="primary icon-start">
                        <i class="fas fa-plus"></i> Create Team
                    </button>
                </app-view-header>

                <div class="grid-layout cols-3">
                    ${teamListHtml}
                </div>
            `;
        },
        renderDetail: (team) => {
            const assignments = team.assignmentTypes || [];

            return `
                <div slot="left">
                    <!-- TOP: Team Information -->
                    <section class="mb-4">
                        <label class="text-muted small d-block mb-1">Team Name</label>
                        <div class="h5 mb-0">${team.name}</div>
                    </section>

                    <section class="mb-4">
                        <label class="text-muted small d-block mb-1">Department</label>
                        <span class="badge tertiary">${team.dept}</span>
                    </section>

                    <!-- BOTTOM: Team Members -->
                    <footer class="mt-5 pt-4 border-top">
                        <h6 class="mb-3">Team Members</h6>
                        <div class="list-group list-group-flush">
                            ${team.members && team.members.length > 0 ? team.members.map(memberId => `
                                <div class="list-group-item px-0 py-2">
                                    <div class="text-muted small">${memberId}</div>
                                </div>
                            `).join('') : '<div class="text-muted small">No members assigned</div>'}
                        </div>
                    </footer>
                </div>

                <div slot="right">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6 class="mb-0">Services</h6>
                        <button type="button" class="primary outline" onclick="App.addAssignmentRow()">+ Add</button>
                    </div>

                    <input type="hidden" name="id" value="${team.id}" form="sidesheet-form">
                    <div id="team-assignments-container" style="flex: 1; overflow-y: auto;">
                        ${assignments.map((at, index) => `
                            <div class="py-3 assignment-type-row border-bottom d-flex justify-content-between align-items-start gap-4">
                                <div class="flex-1 d-flex flex-column gap-1">
                                    <input type="text" class="form-control border-0 fw-bold at-name p-0 bg-transparent" value="${at.name}" placeholder="Service Name" form="sidesheet-form">
                                    <input type="text" class="form-control border-0 text-muted extra-small at-desc p-0 bg-transparent" value="${at.description}" placeholder="Brief description..." form="sidesheet-form">
                                </div>
                                <div class="d-flex align-items-center gap-3">
                                    <div class="d-flex align-items-center d-none">
                                        <span class="primary fw-bold me-1">฿</span>
                                        <input type="number" class="form-control border-0 fw-bold p-0 at-price text-end bg-transparent" style="width: 60px;" value="${at.price}" form="sidesheet-form">
                                    </div>
                                    <button type="button" class="tertiary" style="padding: 4px; min-width: auto; height: auto;" onclick="this.closest('.assignment-type-row').remove()">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                                <input type="hidden" class="at-id" value="${at.id}" form="sidesheet-form">
                            </div>
                        `).join('') || '<div class="py-4 text-muted small text-center">No services registered</div>'}
                    </div>
                </div>
                
                <sidesheet-footer slot="footer">
                    <button class="primary" slot="save-btn" type="submit" form="sidesheet-form">Save Changes</button>
                </sidesheet-footer>
            `;
        }
    };
})();
