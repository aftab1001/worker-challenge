export interface ICommandOption {
    command: string;
    args?: string[] | undefined;
    cwd?: true;
}
export interface IShellCommandExecutor {
    execute(): Promise<void>;
    kill(): void;
}
