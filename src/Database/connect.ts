import "reflect-metadata";
import {createConnection, ConnectionOptions} from "typeorm";
import dotenv from 'dotenv';

dotenv.config();

const getOptions = () => {
    let connectionOptions: ConnectionOptions;
    connectionOptions = {
        type: 'postgres',
        synchronize: true,
        logging: false,
        entities: [
            "src/entity/**/*.ts"
        ],
        migrations: [
            "src/migration/**/*.ts"
        ],
        subscribers: [
            "src/subscriber/**/*.ts"
        ],
        cli: {
            "entitiesDir": "src/entity",
            "migrationsDir": "src/migration",
            "subscribersDir": "src/subscriber"
        }
    };
    if (process.env.DATABASE_URL) {
        Object.assign(connectionOptions, {
            url: process.env.DATABASE_URL,
            extra: {
                ssl: {
                    rejectUnauthorized: false
                },
            },
        });
    } else {
        Object.assign(connectionOptions, {
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "",
            database: "werewolf",
        })
    }
    return connectionOptions;
};

export const connect = () => createConnection(getOptions())
