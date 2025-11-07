# cli-crud-auth

A Node.js command-line tool for file-based CRUD operations and user authentication using only Node core modules.

## Setup

1. **Clone or copy the folder**
2. Ensure you have Node.js installed (v14+ recommended)
3. Install Yarn if not present: `npm install -g yarn`
4. No dependencies to install (uses only built-in modules)

## Usage

Navigate to the `cli-crud-auth` directory and run commands as below:

### Read all records
```
node index.js read data.txt
```

### List all records with count
```
node index.js list data.txt
```

### Create a new record
```
node index.js create data.txt "Buy groceries"
```

### Update a record
```
node index.js update data.txt 2 "New content"
```

### Delete a record
```
node index.js delete data.txt 1
```

### Register a new user
```
node index.js register user@example.com password123
```

### Login as a user
```
node index.js login user@example.com password123
```

### Show help
```
node index.js --help
```

## File Structure

- `index.js` — Main CLI logic
- `data.txt` — Stores records (one per line)
- `users.txt` — Stores user credentials (JSON per line)
- `.gitignore` — Ignore node_modules and temp files
- `package.json` — Project metadata

## Notes
- All operations are synchronous for simplicity
- Passwords are hashed using SHA-256
- No external dependencies required
- Handles missing files gracefully
