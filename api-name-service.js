"use strict";

class ApiNameService {
	constructor(serverless, options) {
		this.serverless = serverless;
		this.options = options;
		this._provider = this.serverless.providers.aws;
		this._originalRegion = this._provider.getRegion();
		this._config = this.serverless.service.custom.customApiNameConfig;

		if (!this._config || !this._config.certificateDomainName || !this._config.domainName) {
			throw new this.serverless.classes.Error("Please provide 'customApiNameConfig' with 'certificateDomainName' and 'domainName' in your serverless.yml");
		}
	}

	log(message) {
		this.serverless.cli.log(message);
	}

	getDomainNameInfo(domainName) {
		return this._provider.request("APIGateway", "getDomainNames")
			.then(domains => {
				if (!domains || !domains.items) {
					return null;
				}

				return domains.items.find(d => d.domainName === domainName);
			});
	}
}

module.exports = ApiNameService;
