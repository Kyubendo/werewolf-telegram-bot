import "reflect-metadata";
import {createConnection} from "typeorm";
import {getConnectionOptions, ConnectionOptions} from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const getOptions = async () => {
    let connectionOptions: ConnectionOptions;
    connectionOptions = {
        type: 'postgres',
        synchronize: true,
        logging: false,
        extra: {
            ssl: true,
        },
        entities: ["src/entity/**/*.ts"],
    };
    if (process.env.DATABASE_URL) {
        Object.assign(connectionOptions, {url: process.env.DATABASE_URL});
    } else {
        connectionOptions = await getConnectionOptions();
    }
    return connectionOptions;
};
export const connect = async () => createConnection(await getOptions())
