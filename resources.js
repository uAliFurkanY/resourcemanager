const { join } = require("path");
const { opendir, readFile } = require("fs").promises;

/**
 * A basic resource manager without external dependecies.
 * @class
 */
class ResourceManager {
	dirname = "resources";
	recursive = true;
	caching = true;
	list = [];
	cache = {};
	/**
	 * Find all the files in a directory and get their contents.
	 * @param {string} dirname Directory to scan
	 * @param {boolean} recursive Use recursion to fetch files in sub-directories. Default: `true`
	 * @param {boolean} caching Use caching to sacrifice RAM usage for faster execution time. Default: `true`
	 * @constructor
	 */
	constructor(dirname = "resources", recursive = true, caching = true) {
		if (typeof dirname === "string") this.dirname = dirname;
		if (typeof recursive === "boolean") this.recursive = recursive;
		if (typeof caching === "boolean") this.caching = caching;
	}
	/**
	 * Scan the directory. While this method is not necessary, it will save μs of execution time.
	 * @param {boolean} recursive Override default recursion options
	 */
	async scandir(recursive = this.recursive, lastdir = "") {
		if (!lastdir) this.reset();
		let currentDir = lastdir ? join(this.dirname, lastdir) : this.dirname;
		const dir = await opendir(currentDir);
		let res;
		while ((res = await dir.read())) {
			if (recursive) {
				if (res.isDirectory()) {
					scandir(recursive, join(lastdir, res.name));
				} else if (res.isFile()) {
					this.list.push(res.name);
				}
			} else {
				if (!res.isFile()) return;
				this.list.push(res.name);
			}
		}
		await dir.close();
	}
	/**
	 * Get a resource.
	 * @param {string} name Filename of the requested resource (`html/404.html`, `icon.png`)
	 * @param {boolean} caching Override default caching options
	 * @returns
	 */
	async get(name, caching = this.caching) {
		if (caching && cache[name]) return cache[name];
		else if (!this.list.includes(name)) {
			await this.scandir();
			if (!this.list.includes(name)) throw Error("File not found");
			else return await this.get(...arguments);
		} else {
			let file = (
				await readFile("./" + this.dirname + "/" + name)
			).toString();
			this.cache[name] = file;
			return file;
		}
	}
	/**
	 * Reset the file list and the cache.
	 */
	reset() {
		this.list = [];
		this.cache = {};
	}
}
module.exports = ResourceManager;
