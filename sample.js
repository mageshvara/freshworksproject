//here we require the model that has been exported in index.js
var { create,read,delete1} = require('./index');

//here we call the create function by passing parametters that is key,value,timestamp.
var create1 = create("magesh",10,20000);


//similarly we call another create
var create2=create("sai",20,300000);


//here we reading the value of the particulat key that is "magesh"
var read1=read("magesh");

//here we delete the key index "sai"
var deletekey1=delete1("sai");







//using worker threads we calling the functions in index.js

const { Worker } = require('worker_threads') 
  
function runService(workerData) { 
    return new Promise((resolve, reject) => { 
        const worker = new Worker( 
                './index.js', { workerData }); 
        worker.on('message', resolve); 
        worker.on('error', reject); 
        worker.on('exit', (code) => { 
            if (code !== 0) 
                reject(new Error( 
`Stopped the Worker Thread with the exit code: ${code}`)); 
        }) 
    }) 
} 
  
async function run() { 
    const result = await runService(create("mage",10,20000)) 
    console.log(result); 
} 
  
run().catch(err => console.error(err)) 
