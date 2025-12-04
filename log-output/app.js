const crypto = require("crypto");

const randomId = crypto.randomUUID();

console.log("App started. Random ID:", randomId);

setInterval(() => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}: ${randomId}`);
}, 5000);
