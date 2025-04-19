const fs= require('fs');
const crypto = require('crypto');
console.log("1. script Start");

setTimeout(()=>{
    console.log("2.setTimeout 0s callback (Macrotask)");
},0);

setTimeout(()=>{
    console.log("3. setTimeout 0s callback (Macrotask)");
},0);

setImmediate(()=>{
    console.log("4. setImmediate callback (check)");
})

Promise.resolve().then(()=>{
    console.log("5. Promises (MicroTasks)");
})

Promise.resolve().then(()=>{
    console.log("6. Promises (MicroTasks)");
})

process.nextTick(()=>{
    console.log("7. Process callback (microtask)");
})

fs.readFile(__filename,()=>{
    console.log("8. File Read Operation (I/O callback)");
})
crypto.pbkdf2("topSecret","fishy",20000,64,'sha512',(err,key)=>{
    if(err) throw err;
    console.log("9. crypto.pbkdf2 callback(CPU intensive) ");
});

console.log("10. Script ends!!");