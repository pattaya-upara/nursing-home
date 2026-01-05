const DashboardView = (() => {
    return {
        render: async () => {
            const stats = await API.getDashboardStats();

            return `
                <app-view-header>
                    <h2 slot="title">Operations Dashboard</h2>
                    <div slot="actions" class="d-flex gap-2">
                        <button class="tertiary active">Today</button>
                        <button class="tertiary">Forecast</button>
                    </div>
                </app-view-header>

            `;
        }
    };
})();
