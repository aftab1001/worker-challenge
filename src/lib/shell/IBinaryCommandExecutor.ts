export interface ICommandOption {
    command: string;
    args?: string[] | undefined;
    cwd?: true;
}
export interface IBinaryCommandExecutor {
    execute(): Promise<void>;
    cleanupWorkers(): void;
}
