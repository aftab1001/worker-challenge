import { spawn } from 'child_process';
import { getBinaryCommand } from '../../binaryCommands';
import { Logger } from '../../helpers/Logger';
import { ICommandOption, IShellCommandExecutor } from './IShellCommandExecutor';

export class ShellCommandExecutor implements IShellCommandExecutor {
    private commandOption: ICommandOption;
    private spwanProcessInfo: any;

    constructor(commandOption: ICommandOption) {
        this.commandOption = commandOption;
    }

    execute(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!this.commandOption.command) {
                reject('Error: No command found please specify command');
            }
            const numWorkers = 16;
            const startPort = 3000;

            for (let i = 0; i < numWorkers; i++) {
                const workerId = i + 1;
                const port = startPort + i;
                this.spwanProcessInfo = spawn(this.commandOption.command, [
                    `-workerId`,
                    workerId.toString(),
                    `-port`,
                    port.toString(),
                ]);
            }
            // this.spwanProcessInfo = spawn(this.commandOption.command, this.commandOption.args, {
            //     cwd: __dirname,
            // });

            this.spwanProcessInfo.stdout.on('data', (data: any) => {
                Logger.log(data.toString());
                resolve(data.toString());
            });

            this.spwanProcessInfo.stderr.on('data', (data: any) => {
                resolve(data.toString());
            });

            this.spwanProcessInfo.on('error', (err: any) => {
                reject(err);
            });
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
