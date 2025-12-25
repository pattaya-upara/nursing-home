/**
 * Mock API Layer for Bourbon Mall NoSQL Database
 */

const API = (() => {
    let db = null;

    const loadDB = async () => {
        if (db) return db;
        try {
            db = await CSVParser.buildDatabase();
            return db;
        } catch (error) {
            console.error("Failed to load database:", error);
            return null;
        }
    };

    // Simulate network delay
    const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

    return {
        getPackages: async () => {
            await delay();
            const data = await loadDB();
            return data.packages;
        },
        getPackageById: async (id) => {
            await delay();
            const data = await loadDB();
            return data.packages.find(p => p.id === id);
        },
        getStaff: async () => {
            await delay();
            const data = await loadDB();
            return data.staff;
        },
        getTeams: async () => {
            await delay();
            const data = await loadDB();
            return data.teams;
        },
        getOrders: async () => {
            await delay();
            const data = await loadDB();
            return data.orders;
        },
        getTasks: async () => {
            await delay();
            const data = await loadDB();
            return data.tasks;
        },
        savePackage: async (pkgData) => {
            await delay(600);
            const data = await loadDB();
            if (pkgData.id) {
                const index = data.packages.findIndex(p => p.id === pkgData.id);
                if (index !== -1) {
                    data.packages[index] = { ...data.packages[index], ...pkgData };
                    return data.packages[index];
                }
            }
            const newPkg = { ...pkgData, id: 'pkg-' + Date.now() };
            data.packages.push(newPkg);
            return newPkg;
        },
        deletePackage: async (id) => {
            await delay(400);
            const data = await loadDB();
            data.packages = data.packages.filter(p => p.id !== id);
            return true;
        },
        saveTeam: async (teamData) => {
            await delay(500);
            const data = await loadDB();
            const index = data.teams.findIndex(t => t.id === teamData.id);
            if (index !== -1) {
                data.teams[index] = { ...data.teams[index], ...teamData };
                return data.teams[index];
            }
            return null;
        },
        // Statistics for Dashboard
        getDashboardStats: async () => {
            await delay();
            const data = await loadDB();
            return {
                occupancy: Math.floor(Math.random() * 20) + 70, // 70-90%
                pendingTasks: data.tasks.filter(t => t.status === 'Pending').length,
                totalStaff: data.staff.length,
                newPurchases: data.orders.length
            };
        }
    };
})();
