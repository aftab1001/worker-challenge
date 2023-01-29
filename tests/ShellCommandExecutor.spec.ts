import { ICommandOption, IShellCommandExecutor } from '.././src/lib/shell';
import { ShellCommandExecutor }  from '.././src/lib/shell';

describe('ShellCommandExecutor', () => {
  let commandExecutor: ShellCommandExecutor;
  let commandOption: ICommandOption;

  beforeEach(() => {
    commandOption = { command: 'echo', args: ['Hello World'] };
    commandExecutor = new ShellCommandExecutor(commandOption);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('execute', () => {
    it('should execute the command and resolve with the output', async () => {
      const expectedOutput = 'Hello World\n';

      const output = await commandExecutor.execute();

      expect(output).toEqual(expectedOutput);
    });

    it('should reject if no command is specified', async () => {
        commandOption.command = '';
        commandExecutor = new ShellCommandExecutor(commandOption);
      
        await expect(commandExecutor.execute()).rejects.toThrow('Error: No command found please specify command');
      });

  describe('kill', () => {
    it('should call the kill method of the spawned process', () => {
      const mockKill = jest.fn();
      commandExecutor['spwanProcessInfo'] = { kill: mockKill };

      commandExecutor.kill();

      expect(mockKill).toHaveBeenCalledWith('SIGINT');
    });
  });
});
