import { IShellCommandExecutor } from '../lib/shell/IShellCommandExecutor';
import { Config } from '../config/config';
import { Logger } from '../helpers/Logger';
import { getShellCommandExecutor } from '../lib/shell';
import axios from 'axios';
import { ISampleCollectionService } from './ISampleCollectionService';

export class SampleCollectionService implements ISampleCollectionService {

    constructor(private readonly shellCommandExecutor: IShellCommandExecutor) { }
    async getSamples(): Promise<void> {
        await this.startService();
        await this.collectSamples();
    }

    async collectSamples(): Promise<void> {
        const startTime = Date.now();
        let collectedSamples = 0;
        const results: any = [];

        while (collectedSamples < Config.MaxSampleCollection) {
            const promises = [];
            for (let i = 0; i < Config.NumberOfWorkers; i++) {
                const workerId = i + 1;
                const port = Config.WorkerStartingPort + workerId;
                promises.push(
                    axios
                        .get(`${Config.WorkerStartingEndPointUrl}:${port}/rnd?n=${Config.SamplePerWorker}`)
                        .then((response: { data: any }) => response.data)
                        .catch((error: any) => error),
                );
            }

            try {
                const workerResults = await Promise.all(promises);
                workerResults.forEach((workerData) => {
                    workerData.split('\n').forEach((line: string) => {
                        const parts = line.split('=');
                        if (parts.length === 2) {
                            results.push(parseInt(parts[1]));
                            collectedSamples++;
                        }
                    });
                });
            } catch (err) {
                console.error(`Error collecting samples from worker: ${err}`);
            }
        }

        console.log('All workers have finished generating random numbers.');

        let totalSum = 0;
        results.forEach((num: number) => {
            totalSum += num;
        });
        console.log(`The total number of sample count are: ${results.length}`);
        console.log(`The total sum of all samples is ${totalSum}`);
        console.log(`The total time spent is ${Date.now() - startTime}ms`);
    }

    async startWorkers(): Promise<void> {
        Logger.log('--------------- Executing binaries ---------------');
        await this.startService();
    }

    kill(): void {
        this.shellCommandExecutor.kill();
    }

    private async startService(): Promise<void> {
        return this.shellCommandExecutor.execute();
    }
}
export const getSampleCollectionService = () => new SampleCollectionService(getShellCommandExecutor());
