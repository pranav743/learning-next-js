const boxen = require('boxen');

// Define the message and title
const message = "I am using my first external module!";
const title = "Hurray!!!";

// Classic (default style)
console.log(boxen(message, {
    title: title,
    titleAlignment: 'center',
    borderStyle: 'classic'
}));

console.log(); // Empty line for spacing

// SingleDouble (mixed single and double borders)
console.log(boxen(message, {
    title: title,
    titleAlignment: 'center',
    borderStyle: 'singleDouble'
}));

console.log(); // Empty line for spacing

// Round (rounded corners)
console.log(boxen(message, {
    title: title,
    titleAlignment: 'center',
    borderStyle: 'round'
}));

console.log(); // Empty line for spacing

// Bonus: Customized boxes with background colors and additional styling
console.log("=== BONUS: Customized Boxes with Colors ===");
console.log();

// Blue background with white text
console.log(boxen(message, {
    title: title,
    titleAlignment: 'center',
    borderStyle: 'double',
    backgroundColor: 'blue',
    borderColor: 'cyan',
    padding: 1
}));

console.log(); // Empty line for spacing

// Green background with black text
console.log(boxen(message, {
    title: title,
    titleAlignment: 'center',
    borderStyle: 'round',
    backgroundColor: 'green',
    borderColor: 'yellow',
    padding: 1
}));

console.log(); // Empty line for spacing

// Magenta background with white text
console.log(boxen(message, {
    title: title,
    titleAlignment: 'center',
    borderStyle: 'single',
    backgroundColor: 'magenta',
    borderColor: 'white',
    padding: 1,
    margin: 1
}));