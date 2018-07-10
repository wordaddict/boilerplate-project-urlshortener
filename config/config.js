const config = {
  mongo: {
    connection: {
      host: process.env.MONGODB_HOST,
      username: process.env.MONGODB_USER,
      password: process.env.MONGODB_PASSWORD,
      port: process.env.MONGODB_PORT,
      dbProd: process.env.MONGODB_DATABASE_NAME
        },
  collections: {
    report_collection: 'report'
        }
    }
};

module.exports = config;
