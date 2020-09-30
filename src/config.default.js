const config = {
	certPaths: {
		key: '',
		cert: ''
	},
	mongoConnection: 'mongodb://localhost/ezserver',
	mongoConnectionOptions: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
		useUnifiedTopology: true,
		auth: {
			authSource: "admin"
		},
		user: "admin",
		pass: ""
	},
	telegramToken: '',
	port: 3003,
	https: false
}

export default config;