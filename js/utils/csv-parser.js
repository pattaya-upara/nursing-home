/**
 * CSV Parser Utility
 * Parses CSV files and transforms them into database objects
 */

const CSVParser = (() => {
    /**
     * Parse a CSV file and return structured data
     */
    const parse = async (url) => {
        try {
            const response = await fetch(url);
            const csv = await response.text();
            
            return new Promise((resolve, reject) => {
                Papa.parse(csv, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        resolve(results.data || []);
                    },
                    error: (error) => {
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error(`Failed to load CSV: ${url}`, error);
            throw error;
        }
    };

    /**
     * Parse pipe-separated member IDs
     */
    const parseMembers = (memberString) => {
        if (!memberString) return [];
        return memberString.split('|').map(m => m.trim());
    };

    /**
     * Parse assignment types: "id:name:price|id:name:price"
     */
    const parseAssignmentTypes = (assignmentString) => {
        if (!assignmentString) return [];
        return assignmentString.split('|').map(at => {
            const [id, name, price] = at.trim().split(':');
            return {
                id: id || 'at-' + Date.now(),
                name: name || '',
                price: parseFloat(price) || 0,
                description: ''
            };
        });
    };

    /**
     * Parse services: "title:dept:interval:description:price|..."
     */
    const parseServices = (serviceString, pkg) => {
        if (!serviceString) return [];
        
        return serviceString.split('|').map(s => {
            const parts = s.trim().split(':');
            return {
                title: parts[0] || '',
                dept: parts[1] || '',
                interval: parts[2] || 'Daily',
                description: parts[3] || '',
                price: parseFloat(parts[4]) || 0
            };
        });
    };

    /**
     * Transform raw CSV data into app database structure
     */
    const buildDatabase = async () => {
        try {
            const [packagesData, staffData, teamsData, assignmentsData, ordersData, tasksData] = await Promise.all([
                parse('./data/packages.csv'),
                parse('./data/staff.csv'),
                parse('./data/teams.csv'),
                parse('./data/assignments.csv'),
                parse('./data/orders.csv'),
                parse('./data/tasks.csv')
            ]);

            // Process packages
            const packages = packagesData.map(row => ({
                id: row.id,
                name: row.name,
                price: parseFloat(row.price) || 0,
                duration: parseInt(row.duration) || 0,
                description: row.description,
                services: parseServices(row.services, row)
            }));

            // Process staff
            const staff = staffData.map(row => ({
                id: row.id,
                name: row.name,
                role: row.role,
                dept: row.dept,
                status: row.status
            }));

            // Build assignment map for teams
            const assignmentMap = {};
            assignmentsData.forEach(row => {
                const teamId = row.team_id;
                if (!assignmentMap[teamId]) assignmentMap[teamId] = [];
                assignmentMap[teamId].push({
                    id: row.id,
                    name: row.name,
                    price: parseFloat(row.price) || 0,
                    description: row.description || ''
                });
            });

            // Process teams
            const teams = teamsData.map(row => ({
                id: row.id,
                name: row.name,
                dept: row.dept,
                members: parseMembers(row.members),
                tasks: [],
                assignmentTypes: assignmentMap[row.id] || parseAssignmentTypes(row.assignmentTypes)
            }));

            // Process orders
            const orders = ordersData.map(row => ({
                id: row.id,
                customer: row.customer,
                package_id: row.package_id,
                room: row.room,
                check_in: row.check_in,
                check_out: row.check_out,
                status: row.status
            }));

            // Process tasks
            const tasks = tasksData.map(row => ({
                id: row.id,
                order_id: row.order_id,
                dept: row.dept,
                title: row.title,
                date: row.date,
                status: row.status
            }));

            return {
                packages,
                staff,
                teams,
                orders,
                tasks
            };
        } catch (error) {
            console.error('Failed to build database from CSV:', error);
            throw error;
        }
    };

    return {
        parse,
        parseMembers,
        parseAssignmentTypes,
        parseServices,
        buildDatabase
    };
})();