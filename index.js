const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const args = process.argv.slice(2);
const [cmd, ...rest] = args;

const help = () => {
  console.log(`Usage: node index.js <command> [...args]

Commands:
  read <file>                 Print all records with line numbers
  list <file>                 Print all records and total count
  create <file> <text>        Append a new record
  update <file> <n> <text>    Update record #n
  delete <file> <n>           Delete record #n
  register <email> <pass>     Register a new user
  login <email> <pass>        Login as a user
  --help                      Show this help message
`);
};

const hash = (str) => crypto.createHash('sha256').update(str).digest('hex');

const filePath = (f) => path.resolve(__dirname, f);

const readLines = (f) => {
  if (!fs.existsSync(f)) return null;
  return fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(Boolean);
};

switch (cmd) {
  case '--help':
    help();
    break;
  case 'read': {
    const [file] = rest;
    const f = filePath(file);
    if (!fs.existsSync(f)) {
      console.log(`No file found: ${file}`);
      break;
    }
    const lines = readLines(f);
    lines.forEach((line, i) => console.log(`${i + 1}: ${line}`));
    break;
  }
  case 'list': {
    const [file] = rest;
    const f = filePath(file);
    if (!fs.existsSync(f)) {
      console.log(`No file found: ${file}`);
      break;
    }
    const lines = readLines(f);
    lines.forEach((line, i) => console.log(`${i + 1}: ${line}`));
    console.log(`Total records: ${lines.length}`);
    break;
  }
  case 'create': {
    const [file, ...textArr] = rest;
    const f = filePath(file);
    const text = textArr.join(' ');
    let lines = [];
    if (fs.existsSync(f)) lines = readLines(f);
    fs.appendFileSync(f, text + os.EOL);
    console.log(`Created record #${lines.length + 1}`);
    break;
  }
  case 'update': {
    const [file, n, ...textArr] = rest;
    const f = filePath(file);
    if (!fs.existsSync(f)) {
      console.log(`No file found: ${file}`);
      break;
    }
    const idx = parseInt(n, 10) - 1;
    let lines = readLines(f);
    if (idx < 0 || idx >= lines.length) {
      console.log(`Record #${n} not found`);
      break;
    }
    lines[idx] = textArr.join(' ');
    fs.writeFileSync(f, lines.join(os.EOL) + os.EOL);
    console.log(`Updated record #${n}`);
    break;
  }
  case 'delete': {
    const [file, n] = rest;
    const f = filePath(file);
    if (!fs.existsSync(f)) {
      console.log(`No file found: ${file}`);
      break;
    }
    const idx = parseInt(n, 10) - 1;
    let lines = readLines(f);
    if (idx < 0 || idx >= lines.length) {
      console.log(`Record #${n} not found`);
      break;
    }
    lines.splice(idx, 1);
    fs.writeFileSync(f, lines.join(os.EOL) + (lines.length ? os.EOL : ''));
    console.log(`Deleted record #${n}`);
    break;
  }
  case 'register': {
    const [email, pass] = rest;
    const f = filePath('users.txt');
    let users = [];
    if (fs.existsSync(f)) users = readLines(f).map(l => JSON.parse(l));
    if (users.find(u => u.email === email)) {
      console.log('User already exists');
      break;
    }
    const user = { email, password: hash(pass) };
    fs.appendFileSync(f, JSON.stringify(user) + os.EOL);
    console.log('User registered');
    break;
  }
  case 'login': {
    const [email, pass] = rest;
    const f = filePath('users.txt');
    if (!fs.existsSync(f)) {
      console.log('Invalid credentials');
      break;
    }
    const users = readLines(f).map(l => JSON.parse(l));
    const user = users.find(u => u.email === email && u.password === hash(pass));
    if (user) console.log('Login successful');
    else console.log('Invalid credentials');
    break;
  }
  default:
    help();
}