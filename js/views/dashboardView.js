const DashboardView = (() => {
    return {
        render: async () => {
            const stats = await API.getDashboardStats();

            return `
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="h4 mb-0">Operations Dashboard</h2>
                    <div class="btn-group">
                        <button class="btn btn-outline-secondary active">Today</button>
                        <button class="btn btn-outline-secondary">Forecast</button>
                    </div>
                </div>

                <div class="row">
                    <!-- Stats Cards -->
                    <div class="col-md-3">
                        <div class="card">
                            <div class="stat-card">
                                <div class="stat-icon bg-primary text-white">
                                    <i class="fas fa-bed"></i>
                                </div>
                                <div>
                                    <div class="text-muted small">Occupancy</div>
                                    <h3 class="h4 mb-0">${stats.occupancy}%</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="stat-card">
                                <div class="stat-icon bg-warning text-white">
                                    <i class="fas fa-tasks"></i>
                                </div>
                                <div>
                                    <div class="text-muted small">Pending Tasks</div>
                                    <h3 class="h4 mb-0">${stats.pendingTasks}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="stat-card">
                                <div class="stat-icon bg-info text-white">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div>
                                    <div class="text-muted small">Total Staff</div>
                                    <h3 class="h4 mb-0">${stats.totalStaff}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="stat-card">
                                <div class="stat-icon bg-success text-white">
                                    <i class="fas fa-shopping-cart"></i>
                                </div>
                                <div>
                                    <div class="text-muted small">New Orders</div>
                                    <h3 class="h4 mb-0">${stats.newPurchases}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <span>Upcoming Workload Forecast</span>
                                <span class="badge bg-light text-dark">Next 2 Weeks</span>
                            </div>
                            <div class="card-body">
                                <div class="chart-container d-flex align-items-end justify-content-between px-4 pb-4">
                                    <!-- Simple Bars to represent chart -->
                                    <div class="bg-primary opacity-25" style="height: 40%; width: 40px; border-radius: 4px;"></div>
                                    <div class="bg-primary opacity-50" style="height: 60%; width: 40px; border-radius: 4px;"></div>
                                    <div class="bg-primary opacity-75" style="height: 35%; width: 40px; border-radius: 4px;"></div>
                                    <div class="bg-primary" style="height: 80%; width: 40px; border-radius: 4px;"></div>
                                    <div class="bg-primary opacity-75" style="height: 55%; width: 40px; border-radius: 4px;"></div>
                                    <div class="bg-primary opacity-50" style="height: 90%; width: 40px; border-radius: 4px;"></div>
                                    <div class="bg-primary opacity-25" style="height: 45%; width: 40px; border-radius: 4px;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    };
})();
