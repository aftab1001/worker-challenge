import { ISampleCollectionService } from '../src/services/ISampleCollectionService';
import { App } from '../src/App';

jest.mock('../src/helpers/Logger', () => ({
    error: jest.fn()
}));

describe('App', () => {
    let sampleCollectionServiceMock: ISampleCollectionService;
    let app: App;

    beforeEach(() => {
        sampleCollectionServiceMock = {
            getSamples: jest.fn().mockResolvedValue(undefined),
            startWorkers: jest.fn(),
            cleanUpWorkers: jest.fn()
        };

        app = new App(sampleCollectionServiceMock);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should call getSamples method of SampleCollectionService', async () => {
        await app.init();

        expect(sampleCollectionServiceMock.getSamples).toHaveBeenCalled();
    });
});
