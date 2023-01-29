export interface ISampleCollectionService {
    getSamples(): Promise<void>;
    kill(): void;
}
