import { spawn } from 'child_process';
import { AppConfiguration } from '../../config/AppConfiguration';
import { getBinaryCommand } from '../../binaryCommands';
import { ICommandOption, IBinaryCommandExecutor } from './IBinaryCommandExecutor';
import { Logger } from '../../helpers/Logger';
import treeKill from 'tree-kill';

export class BinaryCommandExecutor implements IBinaryCommandExecutor {
    private commandOption: ICommandOption;
    private workers: Array<number> = [];
    constructor(commandOption: ICommandOption) {
        this.commandOption = commandOption;
        this.workers = [];
    }

    execute({ flaky = false }: { flaky?: boolean } = {}): Promise<void> {
        return new Promise((resolve, reject) => {
            const { command } = this.commandOption;
            if (!command) {
                reject('Error: No command found please specify command');
            }
            const startWorkers = () => {
                for (let i = 0; i < AppConfiguration.NumberOfWorkers; i++) {
                    const workerId = i + 1;
                    const port = AppConfiguration.WorkerStartingPort + workerId;
                    const cmd = `${command} -workerId ${workerId} -port ${port}${flaky ? ' -flaky' : ''}`;
                    const worker = spawn(cmd, { shell: true, stdio: 'inherit' });
                    if (!worker.pid) {
                        Logger.error('Failed to spawn child process');
                    } else {
                        this.workers.push(worker.pid);
                    }
                }
                if (this.workers.length == AppConfiguration.NumberOfWorkers) {
                    setTimeout(() => {
                        resolve();
                    }, 500);
                }
            };

            startWorkers();
        });
    }

    cleanupWorkers(): void {
        this.workers.forEach((workerPid) => {
            treeKill(workerPid, 'SIGKILL', (err: any) => {
                if (err) {
                    Logger.error(err);
                } else {
                    Logger.log(`Process ${workerPid} killed.`);
                }
            });
        });
    }
}

export const getBinaryCommandExecutor = () =>
    new BinaryCommandExecutor(<ICommandOption>{
        command: getBinaryCommand(),
        args: []
    });
