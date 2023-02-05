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

    execute(): Promise<void> {
        return new Promise((_resolve, reject) => {
            if (!this.commandOption.command) {
                reject('Error: No command found please specify command');
            }

            const startWorkers = () => {
                for (let i = 0; i < AppConfiguration.NumberOfWorkers; i++) {
                    const workerId = i + 1;
                    const port = AppConfiguration.WorkerStartingPort + workerId;
                    const cmd = `${this.commandOption.command} -workerId ${workerId} -port ${port}`;
                    const worker = spawn(cmd, { shell: true, stdio: 'inherit' });
                    if (worker.pid) {
                        this.workers.push(worker.pid);
                    } else {
                        Logger.error('Failed to spawn child process');
                    }
                }
                _resolve();
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
