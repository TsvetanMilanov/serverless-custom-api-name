"use strict";

const ApiNameService = require("./api-name-service");

class RemoveApiNameService extends ApiNameService {
	constructor(serverless, options) {
		super(serverless, options);
	}

	removeApiName() {
		const domainName = this._config.domainName;
		return this.getDomainNameInfo(domainName)
			.then(domainInfo => {
				if (domainInfo) {
					this.log(`Removing custom domain name ${domainName}.`);
					return this._provider.request("APIGateway", "deleteDomainName", { domainName });
				}

				this.log(`Skipping remove custom domain name. ${domainName} does not exist.`);
				return true;
			});
	}
}

module.exports = RemoveApiNameService;
