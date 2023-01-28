import axios from 'axios';
import { Worker, isMainThread } from 'worker_threads';

const NUM_WORKERS = 8;
const NUM_SAMPLES = 150;
const REQUEST_URL = 'http://localhost:3001/rnd?n=1';
const MAX_TIME = 10000; // 10 seconds

let totalSum = 0;
let totalTime = 0;
let flakyWorkers = 0;

async function workerThread(workerIndex: number) {
    try {
        const startTime = Date.now();
        const response = await axios.get(REQUEST_URL);
        const data = response.data.split('\n');

        data.forEach((str: any) => {
            if (str) {
                const [, value] = str.split('=');
                totalSum += Number(value);
            }
        });

        const endTime = Date.now();
        totalTime += endTime - startTime;
    } catch (err: any) {
        console.log(`Worker ${workerIndex} failed: ${err.message}`);
        flakyWorkers++;
    }
}

if (isMainThread) {
    for (let i = 0; i < NUM_WORKERS; i++) {
        const worker = new Worker(__filename);
        worker.on('message', (message) => {
            console.log(`Worker ${i} completed: ${message}`);
        });
        worker.on('error', (err) => {
            console.log(`Worker ${i} failed: ${err.message}`);
        });
        worker.on('exit', (code) => {
            if (code !== 0) {
                console.log(`Worker ${i} stopped with exit code ${code}`);
            }
        });
    }

    setTimeout(() => {
        console.log(`Total sum: ${totalSum}`);
        console.log(`Total time: ${totalTime}`);
        console.log(`Flaky workers: ${flakyWorkers}`);
    }, MAX_TIME);
} else {
    for (let i = 0; i < NUM_SAMPLES / NUM_WORKERS; i++) {
        workerThread(i);
    }
}
