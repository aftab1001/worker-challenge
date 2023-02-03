import { getBinaryCommand } from '../src/binaryCommands';
import path from 'path';
import { APP_PATH } from '../src/AppPath';

describe('getBinaryCommand', () => {
    const binaryCommandsBasePath = path.resolve(APP_PATH, 'bin/');
    beforeEach(() => {
        jest.resetModules();
    });

    it('should return the correct binary command for Windows', () => {
        jest.doMock('process', () => ({ platform: 'win32' }));
        expect(getBinaryCommand()).toEqual(`${binaryCommandsBasePath}\\worker.windows`);
    });

    it('should return the correct binary command for Linux', () => {
        jest.doMock('process', () => ({ platform: 'linux' }));
        expect(getBinaryCommand()).toEqual(`${binaryCommandsBasePath}\\worker.linux`);
    });

    it('should return the correct binary command for macOS', () => {
        jest.doMock('process', () => ({ platform: 'darwin' }));
        expect(getBinaryCommand()).toEqual(`${binaryCommandsBasePath}\\/worker.mac`);
    });

    it('should return the default binary command for unknown platform', () => {
        jest.doMock('process', () => ({ platform: 'unknown' }));
        expect(getBinaryCommand()).toEqual(`${binaryCommandsBasePath}\\worker.windows`);
    });
});
