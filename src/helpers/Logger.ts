export class Logger {
    public static log(message: string | undefined): void {
        console.log(`${new Date().toLocaleString()} - ${message}`);
    }

    public static error(errorMessage: string | undefined): void {
        console.log(`${new Date().toLocaleString()} - ${errorMessage}`);
    }
}
