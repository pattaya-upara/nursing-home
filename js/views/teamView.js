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
        renderDetail: (team, mode = 'display') => {
            const assignments = team.assignmentTypes || [];
            const isEditMode = mode === 'edit';

            // Left Pane: Team Information
            const leftPane = `
                ${SidesheetHelper.buildLeftSection('Team Name', `<div class="h5 mb-0">${SidesheetHelper.escapeHtml(team.name)}</div>`)}
                ${SidesheetHelper.buildLeftSection('Department', `<span class="badge tertiary">${SidesheetHelper.escapeHtml(team.dept)}</span>`)}
                
                <footer class="mt-5 pt-4 border-top">
                    <h6 class="mb-3">Team Members</h6>
                    <div class="list-group list-group-flush">
                        ${team.members && team.members.length > 0 ? team.members.map(memberId => `
                            <div class="list-group-item px-0 py-2">
                                <div class="text-muted small">${SidesheetHelper.escapeHtml(memberId)}</div>
                            </div>
                        `).join('') : '<div class="text-muted small">No members assigned</div>'}
                    </div>
                </footer>
            `;

            // Right Pane: Services Form
            const rightPaneContent = `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="mb-0">Services</h6>
                    ${isEditMode ? '<button type="button" class="primary outline" onclick="App.addAssignmentRow()">+ Add</button>' : ''}
                </div>
                <div id="team-assignments-container" style="flex: 1; overflow-y: auto;">
                    ${assignments.length > 0 ? assignments.map((at, index) => `
                        <div class="py-4 assignment-type-row border-bottom d-flex justify-content-between align-items-start gap-4">
                            ${isEditMode ? `
                                <div class="flex-1 d-flex flex-column gap-1">
                                    <input type="text" class="config-input title at-name" value="${SidesheetHelper.escapeHtml(at.name)}" placeholder="Service Name" form="sidesheet-form">
                                    <input type="text" class="config-input description at-desc" value="${SidesheetHelper.escapeHtml(at.description)}" placeholder="Brief description..." form="sidesheet-form">
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
                            ` : `
                                <div class="flex-1 d-flex flex-column gap-1">
                                    <div class="fw-bold">${SidesheetHelper.escapeHtml(at.name)}</div>
                                    <div class="text-muted small">${SidesheetHelper.escapeHtml(at.description || '')}</div>
                                </div>
                            `}
                            <input type="hidden" class="at-id" value="${SidesheetHelper.escapeHtml(at.id)}" form="sidesheet-form">
                        </div>
                    `).join('') : '<div class="py-4 text-muted small text-center">No services registered</div>'}
                </div>
            `;

            const rightPane = SidesheetHelper.buildForm('sidesheet-form', team.id, rightPaneContent);

            return SidesheetHelper.buildSidesheet({
                leftPane,
                rightPane,
                footerId: `team-footer-${team.id}`,
                entityId: team.id,
                isEditMode,
                editHandler: 'App.toggleTeamEditMode'
            });
        }
    };
})();
