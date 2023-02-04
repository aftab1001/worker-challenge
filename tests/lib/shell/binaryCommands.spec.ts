import { getBinaryCommand } from '../../../src/binaryCommands';
import path from 'path';
import { APP_PATH } from '../../../src/AppPath';

describe('getBinaryCommand', () => {
    const binaryCommandsBasePath = path.resolve(APP_PATH, 'bin/');
    beforeEach(() => {
        jest.resetModules();
    });

    it('should return the correct binary command for Windows', () => {
        Object.defineProperty(process, 'platform', { value: 'win32' });
        expect(getBinaryCommand()).toEqual(`${binaryCommandsBasePath}\\worker.windows`);
    });

    it('should return the correct binary command for Linux', () => {
        Object.defineProperty(process, 'platform', { value: 'linux' });
        expect(getBinaryCommand()).toEqual(`${binaryCommandsBasePath}\\worker.linux`);
    });

    it('should return the correct binary command for macOS', () => {
        Object.defineProperty(process, 'platform', { value: 'darwin' });
        expect(getBinaryCommand()).toEqual(`${binaryCommandsBasePath}\\worker.mac`);
    });

    it('should return the default binary command for unknown platform', () => {
        Object.defineProperty(process, 'platform', { value: 'unknown' });
        expect(getBinaryCommand()).toEqual(`${binaryCommandsBasePath}\\worker.windows`);
    });
});
