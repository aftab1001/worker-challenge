export interface ISampleCollectionService {
    getSamples(): Promise<void>;
    startWorkers(): Promise<void>;
    cleanUpWorkers(): Promise<void>;
}
