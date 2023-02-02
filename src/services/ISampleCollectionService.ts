export interface ISampleCollectionService {
    getSamples(): Promise<void>;
    startWorkers(): Promise<void>;
    kill(): void;
}
