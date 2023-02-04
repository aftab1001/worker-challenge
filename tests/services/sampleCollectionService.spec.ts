import { SampleCollectionService, getSampleCollectionService } from '../../src/services/SampleCollectionService';
import { IBinaryCommandExecutor } from '../../src/lib/shell/IBinaryCommandExecutor';
import { AppConfiguration } from '../../src/config/AppConfiguration';
import { ApiClient } from '../../src/lib/http/ApiClient';

describe('SampleCollectionService', () => {
    let service: SampleCollectionService;
    let apiClientMock: jest.Mocked<ApiClient>;
    let shellCommandExecutorMock: jest.Mocked<IBinaryCommandExecutor>;

    beforeEach(() => {
        apiClientMock = {
            collectData: jest.fn().mockResolvedValue([1, 2, 3])
        } as any;

        shellCommandExecutorMock = {
            execute: jest.fn().mockResolvedValue(0),
            cleanupWorkers: jest.fn().mockResolvedValue(0)
        } as any;

        service = new SampleCollectionService(shellCommandExecutorMock, apiClientMock);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should start workers and collect samples', async () => {
        await service.getSamples();

        expect(shellCommandExecutorMock.execute).toHaveBeenCalled();
        expect(apiClientMock.collectData).toHaveBeenCalledTimes(AppConfiguration.NumberOfWorkers * 3);
        expect(shellCommandExecutorMock.cleanupWorkers).toHaveBeenCalled();
    });

    it('should start workers', async () => {
        await service.startWorkers();

        expect(shellCommandExecutorMock.execute).toHaveBeenCalled();
    });

    it('should clean up workers', async () => {
        await service.cleanUpWorkers();

        expect(shellCommandExecutorMock.cleanupWorkers).toHaveBeenCalled();
    });

});

describe('getSampleCollectionService', () => {
    it('should return an instance of SampleCollectionService', () => {
        const service = getSampleCollectionService();

        expect(service).toBeInstanceOf(SampleCollectionService);
    });
});
