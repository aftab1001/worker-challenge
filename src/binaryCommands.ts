import path from 'path';
import { APP_PATH } from './AppPath';

const binaryCommandsBasePath = path.resolve(APP_PATH, 'bin/');
const binaryCommands: { [key: string]: string } = {
    win32: 'worker.windows',
    linux: 'worker.linux',
    darwin: 'worker.mac'
};

export function getBinaryCommand(): string {
    const os = process.platform;
    const binaryCommand = binaryCommands[os] || binaryCommands['win32'];
    return path.resolve(binaryCommandsBasePath, binaryCommand);
}
