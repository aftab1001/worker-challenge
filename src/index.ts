import { Worker, isMainThread, workerData, parentPort } from 'worker_threads';
import { performance } from 'perf_hooks';
import axios from 'axios';

// Define the number of workers and the number of samples to collect
const numWorkers = 7;
const numSamples = 150;

// Define the worker timeout (in ms)
const workerTimeout = 10000;

// Define the worker ports
const workerPorts = [3001, 3002, 3003, 3004, 3005, 3006, 3007];

// Define the worker ids
const workerIds = [1, 2, 3, 4, 5, 6, 7];

// Define the total sum and total time variables
let totalSum = 0;
let totalTime = 0;

// Define a pool of worker threads
const workerPool: Worker[] = [];

// Check if the script is running in the main thread
if (isMainThread) {
    // Start the performance timer
    const startTime = performance.now();

    // Initialize the worker pool
    for (let i = 0; i < numWorkers; i++) {
        workerPool[i] = new Worker(__filename, {
            workerData: {
                workerId: workerIds[i],
                port: workerPorts[i],
            },
        });

        // Listen for messages from the worker
        workerPool[i].on('message', (data: any) => {
            // Add the worker's sum to the total sum
            totalSum += data.sum;
            // Check if all workers have finished
            if (totalSum >= numSamples) {
                // Stop the performance timer
                const endTime = performance.now();

                // Calculate the total time spent
                totalTime = endTime - startTime;

                // Log the results
                console.log(`Total Sum: ${totalSum}`);
                console.log(`Total Time: ${totalTime} ms`);

                // Terminate all worker threads
                workerPool.forEach((worker) => worker.terminate());
            }
        });
    }
} else {
    // Define the worker URL
    const workerUrl = `http://localhost:${workerData.port}/rnd?n=10`;

    // Define the worker sum variable
    const workerSum = 0;

    // Fetch data from the worker
    axios
        .get(workerUrl)
        .then((response) => {
            // Extract the random numbers from the response data
            const randomNumbers = response.data
                .split('\n')
                .filter((line: string) => line.startsWith('rnd='))
                .map((line: string) => parseInt(line.slice(4)));
            console.log(randomNumbers.length);
            // Add the random numbers to the worker sum
            randomNumbers.reduce((sum: number, num: number) => sum + num, 0);

            // Send the worker sum to the main thread
            (parentPort as any).postMessage({ sum: randomNumbers.length });
        })
        .catch((error) => {
            console.log(error);
        });
}
