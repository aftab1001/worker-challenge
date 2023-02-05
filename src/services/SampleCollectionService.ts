import { IBinaryCommandExecutor } from '../lib/shell/IBinaryCommandExecutor';
import { AppConfiguration } from '../config/AppConfiguration';
import { Logger } from '../helpers/Logger';
import { getBinaryCommandExecutor } from '../lib/shell';
import { ISampleCollectionService } from './ISampleCollectionService';
import { ApiClient } from '../lib/http/ApiClient';

export class SampleCollectionService implements ISampleCollectionService {
    constructor(private readonly shellCommandExecutor: IBinaryCommandExecutor, private readonly apiClient: ApiClient) {}
    async getSamples(): Promise<void> {
        await this.startService();
        await this.collectSamples();
        await this.cleanUpWorkers();
    }

    async collectSamples(): Promise<void> {
        const startTime = Date.now();
        let collectedSamples = 0;
        const results: number[] = [];

        while (collectedSamples < AppConfiguration.MaxSampleCollection) {
            try {
                const workerResults = await Promise.all(
                    Array.from({ length: AppConfiguration.NumberOfWorkers }, (_, i) => {
                        const workerId = i + 1;
                        return this.apiClient.collectData(workerId);
                    })
                );

                workerResults.forEach((workerData) => {
                    results.push(...workerData);
                    collectedSamples += workerData.length;
                });
            } catch (err) {
                Logger.error(`Error collecting samples from worker: ${err}`);
            }
        }

        Logger.log('All workers have finished generating random numbers.');
        const totalSum = results.reduce((acc, num) => acc + num, 0);

        Logger.log(`The total number of sample count are: ${results.length}`);
        Logger.log(`The total sum of all samples is ${totalSum}`);
        Logger.log(`The total time spent is ${Date.now() - startTime}ms` + '\n\n');
    }

    async startWorkers(): Promise<void> {
        Logger.log('--------------- Executing binaries ---------------');
        await this.startService();
    }

    async cleanUpWorkers() {
        await this.shellCommandExecutor.cleanupWorkers();
    }

    private async startService(): Promise<void> {
        return this.shellCommandExecutor.execute();
    }
}
export const getSampleCollectionService = () => new SampleCollectionService(getBinaryCommandExecutor(), new ApiClient());
