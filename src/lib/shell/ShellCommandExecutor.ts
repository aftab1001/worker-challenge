import { spawn } from 'child_process';
import { getBinaryCommand } from '../../binaryCommands';
import { ICommandOption, IShellCommandExecutor } from './IShellCommandExecutor';

export class ShellCommandExecutor implements IShellCommandExecutor {
    private commandOption: ICommandOption;
    private spwanProcessInfo: any;

    constructor(commandOption: ICommandOption) {
        this.commandOption = commandOption;
    }

    execute(): Promise<void> {
        return new Promise((_resolve, reject) => {
            if (!this.commandOption.command) {
                reject('Error: No command found please specify command');
            }

            const workers = 20;

            const startWorkers = () => {
                for (let i = 0; i < workers; i++) {
                    const workerId = i + 1;
                    const port = 3000 + workerId;
                    const cmd = `${this.commandOption.command} -workerId ${workerId} -port ${port}`;
                    spawn(cmd, { shell: true, stdio: 'inherit' });
                }
                _resolve();
            };

            startWorkers();
        });
    }

    kill(): void {
        this.spwanProcessInfo.kill('SIGINT');
    }
}

export const getShellCommandExecutor = () =>
    new ShellCommandExecutor(<ICommandOption>{
        command: getBinaryCommand(),
        args: [],
    });
