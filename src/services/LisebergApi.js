export default class LisebergApi {

	constructor() {
		this.structure = {};
		this.meta = false;
		this.queueTimes = {};
	}

	fetchMeta() {
		if (this.meta) {
			return new Promise((resolve, reject) => {
				resolve(this.meta);
			});
		} else {
		return fetch('http://app-settings.liseberg.se/app/meta.json')
			.then((response) => {
				return response.json();
			})
			.then((myJson) => {
				this.meta = myJson;
				console.log(this.meta)
				return this.meta;
			});
		}
	}

	fetchStructure() {
		return fetch('http://app-settings.liseberg.se/app/s18/v1/structure.json')
			.then((response) => {
				return response.json();
			})
			.then((myJson) => {
				this.structure = myJson.structure;
			});
	}

	fetchQueueTimes() {
		return new Promise((resolve, reject) => {
			this.fetchMeta()
				.then((meta) => {
					fetch(this.meta.settings.AllQueueTimeUrl2015)
						.then((response) => {
							return response.json();
						})
						.then((myJson) => {
							this.queueTimes = myJson;
							resolve(this.queueTimes);
						});
				});
		});		
	}

	getMeta() {
		return this.meta;
	}

	getStructure() {
		return this.structure;
	}

	getQueueTimes() {
		return this.queueTimes;
	}

}