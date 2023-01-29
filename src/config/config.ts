import 'dotenv/config';

export class Config {
    public static API_URL = process.env.API_URL;
    public static NODE_ENV = process.env.NODE_ENV;
}
