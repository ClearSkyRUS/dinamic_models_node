const config = {
	mongoConnectionOptions: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
		useUnifiedTopology: true,
		connectTimeoutMS: 10000,
	},
	mongoDatabse: process.env.MONGO_DB || 'ezserver',
	mongoHost: process.env.MONGO_HOSTNAME || '127.0.0.1',
	mongoPort: process.env.MONGO_PORT || '27017',
	telegramToken: '',
	port: process.env.API_PORT || 8080,
}

config.mongoConnection = `mongodb://${config.mongoHost}:${config.mongoPort}/${config.mongoDatabse}`

if (process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD) {
	config.mongoConnectionOptions = {
		...config.mongoConnectionOptions,
		auth: {
			authSource: "admin"
		},
		user: process.env.MONGO_USERNAME,
		pass: process.env.MONGO_PASSWORD
	}
}

export default config