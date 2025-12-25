# Quick Start Guide - Bourbon3 CSV Data Layer

## 🚀 Running the App

1. **Start local server**:
   ```bash
   cd /Users/Lh/Sites/bourbon3
   python3 -m http.server 8888
   ```

2. **Open browser**:
   ```
   http://localhost:8888
   ```

3. **Test data links**:
   ```
   http://localhost:8888/test-data-links.html
   ```

## 📝 Editing Data for Demos

### Method 1: Text Editor (Fastest)
1. Open `data/staff.csv` in VS Code
2. Add/edit any row
3. Save (Ctrl+S)
4. Refresh browser (F5)
5. See changes instantly! ✨

### Method 2: Excel/Google Sheets
1. Open `data/staff.csv` in Excel
2. Edit like normal spreadsheet
3. File → Save As → Format: CSV
4. Upload back to `data/` folder
5. Refresh browser

## 📊 CSV Files You Can Edit

| File | Contains | Edit For |
|------|----------|----------|
| `data/packages.csv` | Service packages | Change prices, names, services |
| `data/staff.csv` | Employees | Add/remove staff members |
| `data/teams.csv` | Team structure | Change team names, members |
| `data/assignments.csv` | Services per team | Change assignment details |
| `data/orders.csv` | Customer orders | Add test orders |
| `data/tasks.csv` | Task assignments | Add test tasks |

## ✅ Features Working

- ✅ View all packages, staff, teams
- ✅ Create new packages
- ✅ Edit packages and teams
- ✅ Delete packages
- ✅ All data from CSV files
- ✅ Dashboard with stats
- ✅ Entity cards for display

## 📚 Documentation

- `DATA_EDITING_GUIDE.md` - Complete editing guide
- `TEST_LINKS.md` - Data integration details
- `IMPLEMENTATION_SUMMARY.md` - Technical overview
- `test-data-links.html` - Visual test report

## 🔧 File Structure

```
data/ → CSV files (edit these!)
  ├── packages.csv
  ├── staff.csv
  ├── teams.csv
  ├── assignments.csv
  ├── orders.csv
  └── tasks.csv

js/utils/ → Parser
  └── csv-parser.js (reads CSV → database)

js/api.js → API Layer (uses parser)

js/views/ → Display (uses API)
  ├── dashboardView.js
  ├── packageView.js
  ├── teamView.js
  └── staffView.js

index.html → Main page (includes PapaParse CDN)
```

## 🎯 Common Tasks

### Add New Staff Member
```
Edit: data/staff.csv
Add row: st-6,New Name,Role,Department,Active
Save & Refresh
```

### Add New Package
```
Edit: data/packages.csv
Add: pkg-3,Package Name,Price,Days,Description,"Service1:Dept:Interval:Desc:0|Service2:Dept:..."
Save & Refresh
```

### Add Team Assignment
```
Edit: data/assignments.csv
Add: at-5,tm-1,Assignment Name,Price,Description
Save & Refresh
```

## 🐛 Troubleshooting

**Changes not showing?**
- Make sure file is saved
- Hard refresh browser (Ctrl+Shift+R)
- Check console (F12) for errors

**CSV won't open in Excel?**
- Make sure extension is `.csv` not `.txt`
- Try "Open With" → Excel

**Data looks weird?**
- Check for commas in values (need quotes)
- Verify pipe separators have no spaces
- Ensure column headers match exactly

## 📱 Testing Links

All these views work and pull from CSV:

- `/` - Dashboard (shows stats from CSV)
- Click "Packages" - Shows all packages from CSV
- Click package card - Shows details + services
- Click "Teams" - Shows all teams from CSV
- Click team card - Shows members + assignments
- Click "Staff" - Shows all employees from CSV

---

**You're all set!** Edit CSV files and watch the app update instantly. No code changes needed. Perfect for presentations! 🎉