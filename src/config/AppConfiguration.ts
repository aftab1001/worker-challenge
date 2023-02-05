import 'dotenv/config';

export class AppConfiguration {
    public static API_URL = process.env.API_URL;
    public static NODE_ENV = process.env.NODE_ENV;
    public static NumberOfWorkers = process.env.NumberOfWorkers ? parseInt(process.env.NumberOfWorkers, 10) : 15;
    public static WorkerStartingPort = process.env.WorkerStartingPort ? parseInt(process.env.WorkerStartingPort, 10) : 3000;
    public static WorkerStartingEndPointUrl = process.env.WorkerStartingEndPointUrl;
    public static SamplePerWorker = process.env.SamplePerWorker ? parseInt(process.env.SamplePerWorker, 10) : 10;
    public static MaxSampleCollection = process.env.MaxSampleCollection ? parseInt(process.env.MaxSampleCollection, 10) : 150;
}
