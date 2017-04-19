"use strict";

const AWS = require("aws-sdk");

const ApiNameService = require("./api-name-service");

class CreateApiNameService extends ApiNameService {
	constructor(serverless, options) {
		super(serverless, options);
	}

	createApiName() {
		return this._getCertificateArn(this._config.certificateDomainName)
			.then(certificateArn => {
				return this._createDomainName(this._config.domainName, certificateArn);
			});
	}

	_getCertificateArn(domainName) {
		/*
		 We need to set the region of the provider to eu-east-1
		 because the certificates required for custom domains in API Gateway
		 can be imported only in eu-east-1 for now.
		 http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-custom-domains.html
		*/
		return new Promise((resolve, reject) => {
			const region = "us-east-1";
			this.log(`Getting certificate ARN from region ${region} for domain name ${domainName}.`);
			this.options.region = region;
			this._provider.request("ACM", "listCertificates")
				.then(certificates => {
					this.options.region = this._originalRegion;
					if (!certificates || !certificates.CertificateSummaryList || !certificates.CertificateSummaryList.length) {
						reject("No certificates found.");
						return;
					}

					const certificate = certificates.CertificateSummaryList.find(c => c.DomainName === domainName);

					if (!certificate) {
						reject(`Certificate for domain ${domainName} not found.`);
						return;
					}

					resolve(certificate.CertificateArn);
				})
				.catch(reject);

		});
	}

	_createDomainName(domainName, certificateArn) {
		return this.getDomainNameInfo(domainName)
			.then(domainInfo => {
				if (!domainInfo) {
					this.log(`Creating custom domain name - ${domainName}.`);
					// TODO: Uncomment when serverless updates it's aws-sdk.
					// return this._provider.request("APIGateway", "createDomainName", { domainName, certificateArn });

					const credentials = this._provider.getCredentials();
					const service = new AWS.APIGateway(credentials);

					return service.createDomainName({ domainName, certificateArn }).promise();
				}

				this.log(`Custom domain name ${domainName} already exists. It will NOT be recreated.`);
				return true;
			});
	}
}

module.exports = CreateApiNameService;
