import { api } from '$lib/constants';

/** @type {import('./$types').PageLoad} */
export async function load() {
	class Index {
		/** @type {Promise<any>|boolean} */
		#data = false;
		/**
		 * @param {string} path
		 */
		constructor(path) {
			this.path = path;
		}
		async fetch() {
			return fetch(this.path).then((r) => r.json());
		}

		get value() {
			if (!this.#data) {
				this.#data = this.fetch();
			}
			return this.#data;
		}
	}
	return {
		searchIndexWitness: new Index(`${api}/json/search-index-transkript.json`),
		searchIndexFassung: new Index(`${api}/json/search-index-fassung.json`)
	};
}
