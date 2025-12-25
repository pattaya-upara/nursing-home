# CSV Data Editing Guide

This guide helps you edit the application data for presentations and prototypes.

## Data Files Overview

All data is stored in CSV format in the `data/` folder:

- **packages.csv** - Service packages offered
- **staff.csv** - Employee/staff members
- **teams.csv** - Teams and their assignments
- **orders.csv** - Customer orders
- **tasks.csv** - Tasks assigned to orders

## How to Edit Data

### Option 1: Edit in Text Editor (Fastest)

1. Open any CSV file in a text editor (VS Code, Notepad, etc.)
2. Find the line you want to edit
3. Make changes
4. Save the file
5. Refresh your browser to see changes

### Option 2: Edit in Excel/Google Sheets (Recommended)

**Excel:**
1. Open `data/staff.csv` with Excel
2. Make changes in the spreadsheet UI
3. File → Save As → Keep as CSV format
4. Refresh browser

**Google Sheets:**
1. Upload CSV file to Google Drive
2. Open with Google Sheets
3. Make edits
4. Download as CSV
5. Replace the original file in `data/` folder
6. Refresh browser

## Common Tasks

### Add a New Staff Member

**File:** `data/staff.csv`

Current:
```
id,name,role,dept,status
st-1,Somchai Jaidee,Senior Operator,Frontend,Active
```

Add new row:
```
st-6,New Person Name,Role Title,Department,Active
```

Save and refresh browser.

### Add a New Package

**File:** `data/packages.csv`

**Required columns:**
- `id` - Unique ID (e.g., pkg-3)
- `name` - Package name
- `price` - Price in Thai Baht
- `duration` - Duration in days
- `description` - Package description
- `services` - Pipe-separated service names (e.g., "Service 1|Service 2|Service 3")

Example:
```
pkg-3,Weekend Getaway,45000,3,Quick weekend package,"Meals|Room Service|Entertainment"
```

### Add a New Team

**File:** `data/teams.csv`

**Required columns:**
- `id` - Unique ID (e.g., tm-4)
- `name` - Team name
- `dept` - Department
- `members` - Pipe-separated staff IDs (e.g., "st-1|st-2|st-3")
- `assignmentTypes` - Format: "id:name:price|id:name:price"

Example:
```
tm-4,Medical Team,Medical,"st-5","at-med:Health Checkup:1000|at-med2:Medication:500"
```

### Modify an Existing Record

1. Open the CSV file
2. Find the row with matching ID
3. Edit any column value
4. Save
5. Refresh browser

## CSV Format Rules

- **First row** must be column headers (id, name, role, etc.)
- **Pipe separator** `|` is used for multiple values in one cell
  - Example: `"st-1|st-2|st-3"` = three staff members
  - Example: `"Service 1|Service 2"` = multiple services
- **Colon separator** `:` is used within assignment types
  - Format: `"id:name:price|id:name:price"`
  - Example: `"at-1:Check-in Guidance:500|at-2:Checkout:300"`
- **Quotes** are optional but recommended for multi-word values
- **Commas** in values must be escaped (use quotes around the value)

## Viewing Changes

After editing a CSV file:

1. Save the file
2. Go back to the browser with the app open
3. Click the refresh button (or Ctrl+R / Cmd+R)
4. Changes appear immediately

**No code changes needed!**

## Examples

### staff.csv Format
```csv
id,name,role,dept,status
st-1,Somchai Jaidee,Senior Operator,Frontend,Active
st-2,Somsri Raksa,Junior Operator,Frontend,Active
st-3,Anong Phon,Cook,Kitchen,Active
```

### packages.csv Format
```csv
id,name,price,duration,description,services
pkg-1,20-day Elder Recreation,85000,20,Comprehensive recreation package,"Room Cleaning|Amenities Update|Daily Meals"
pkg-2,Golden Years Premium,120000,30,Premium package with nursing,"Full Service|Health Monitor"
```

### teams.csv Format
```csv
id,name,dept,members,assignmentTypes
tm-1,Frontend Team,Frontend,"st-1|st-2","at-1:Check-in Guidance:500"
tm-2,Kitchen Team,Kitchen,"st-3","at-400:Daily 3 Meal:400"
```

## Troubleshooting

**Changes not appearing?**
- Make sure you saved the CSV file
- Refresh the browser page (Ctrl+R or Cmd+R)
- Check browser console for errors (F12)

**CSV won't open in Excel?**
- Make sure file extension is `.csv` not `.txt`
- Try opening with "Open With" → Excel

**Data looks broken in app?**
- Check for missing quotes around values with commas
- Verify pipe separators are used correctly (no spaces around them)
- Ensure column names match exactly

## Limitations

- Changes are saved **in-memory only** - refresh the page or restart the browser to reset
- For persistent storage, you'll need a database backend (future enhancement)
- Editing is not locked - conflicts if multiple people edit simultaneously

## Tips for Presentations

✅ **Do this:**
- Edit CSV files in a text editor for quick changes
- Use Excel/Google Sheets for complex data
- Prepare your changes before the presentation
- Test changes by refreshing the browser

❌ **Avoid:**
- Editing CSV files while the app is showing them in a browser (data might not sync)
- Complex nested data (keep structure simple)
- Sharing live editing - can cause confusion

---

**Need help?** Check the application's README.md for more information.
