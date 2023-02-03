import { Logger } from './helpers/Logger';
import { ISampleCollectionService } from './services/ISampleCollectionService';

export class App {
    constructor(private readonly sampleCollectionService: ISampleCollectionService) { }

    public async init(): Promise<void> {
        try {
            this.handleUnhandledRejection();
            this.handleUncaughtException();
            await this.sampleCollectionService.getSamples();
        } catch (ex: any) {
            Logger.error(ex.message);
        }
    }

    private handleGracefullyShutDownProcess(): void {
        process.on('SIGINT', () => {
            this.sampleCollectionService.kill();
        });
    }

    private handleUnhandledRejection() {
        process.on('unhandledRejection', (err: Error) => {
            Logger.error(`Unhandled Promise Rejection: reason: ${err.message}`);
            Logger.error(err.stack);
        });
    }

    private handleUncaughtException() {
        process.on('uncaughtException', function (err: Error) {
            Logger.error(`UncaughtException: ${err.message}`);
            Logger.error(err.stack);
            process.exit(0);
        });
    }
}
