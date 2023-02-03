import axios from 'axios';
import { Logger } from '../../helpers/Logger';
import { AppConfiguration } from '../../config/AppConfiguration';

export class ApiClient {
    async collectData(workerId: number): Promise<number[]> {
        const port = AppConfiguration.WorkerStartingPort + workerId;
        const url = `${AppConfiguration.WorkerStartingEndPointUrl}:${port}/rnd?n=${AppConfiguration.SamplePerWorker}`;

        try {
            const response = await axios.get(url);
            return response.data.split('\n').map((line: string) => {
                const parts = line.split('=');
                return parts.length === 2 ? parseInt(parts[1]) : 0;
            });
        } catch (err) {
            Logger.error(`Error collecting data from worker: ${err}`);
            return [];
        }
    }
}
