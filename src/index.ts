import axios from 'axios';

async function collectSample(workerId: number) {
    const response = await axios.get(`http://localhost:3001/rnd?n=${workerId}`);
    const sample = response.data.rnd;
    return sample;
}

async function scaleWorkerApp(numSamples: number, timeConstraint: number) {
    const startTime = Date.now();
    const i = 0;
    const workerIds = [1, 2, 3]; // workerIds can be modified as per requirement
    const samplePromises = workerIds.map(async (workerId) => {
        const samples: number[] = [];
        while (samples.length < numSamples / workerIds.length) {
            const sample = await collectSample(workerId);
            samples.push(sample);
        }
        return samples;
    });
    const allSamples = await Promise.all(samplePromises);
    const flattenSamples = allSamples.flat();
    const totalSum = flattenSamples.reduce((a, b) => a + b, 0);
    const totalTime = (Date.now() - startTime) / 1000;

    console.log(`Total Sum: ${totalSum}`);
    console.log(`Total Time: ${totalTime} sec`);
    console.log(`Sample Size: ${flattenSamples.length}`);
}

scaleWorkerApp(150, 10);
