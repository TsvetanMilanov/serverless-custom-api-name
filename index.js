"use strict";

const CreateApiNameService = require("./create-api-name-service");
const RemoveApiNameService = require("./remove-api-name-service");

class CustomApiNamePlugin {
	constructor(serverless, options) {
		this.serverless = serverless;
		this.options = options;

		const createApiNameService = new CreateApiNameService(serverless, options);
		const removeApiNameService = new RemoveApiNameService(serverless, options);

		this.hooks = {
			"before:deploy:deploy": createApiNameService.createApiName.bind(createApiNameService),
			"before:remove:remove": removeApiNameService.removeApiName.bind(removeApiNameService)
		};
	}
}

module.exports = CustomApiNamePlugin;
