import * as http from 'http';

const workerUrl = 'http://localhost:3001/rnd?n=10';
const sampleCount = 150;
const timeout = 10000; // 10 seconds
const requestsCount = 15;

let totalSum = 0;
const startTime = Date.now();
let sampleCountReceived = 0;
let requestsMade = 0;

function makeRequest() {
    requestsMade++;
    const request = http.get(workerUrl, (res) => {
        res.on('data', (chunk) => {
            // const randomNumber = parseInt(chunk.toString().split('=')[1]);
            console.log(chunk.toString());
            totalSum++;
            sampleCountReceived++;
            if (sampleCountReceived === sampleCount) {
                const endTime = Date.now();
                const totalTime = endTime - startTime;
                console.log(`Total sum of collected samples: ${totalSum}`);
                console.log(`Total time spent: ${totalTime} ms`);
                request.abort();
            }
        });
        res.on('end', () => {
            if (requestsMade < requestsCount) {
                makeRequest();
            } else {
                console.log('Worker processes cleaned up and terminated.');
            }
        });
    });
    request.setTimeout(timeout, () => {
        request.abort();
        console.log('Timeout reached. Aborting request.');
    });
    request.on('error', (err) => {
        console.log(`Error occurred: ${err.message}`);
    });
}

makeRequest();
