module.exports = {
    type: 'postgres',
    synchronize: false,
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
    },

    host: "localhost" ,
    port: 5432,
    username: "postgres",
    password: "",
    database: "werewolf",
}