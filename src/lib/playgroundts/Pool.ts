/**
 * avoxel284 2026
 ************************************
 * Refactored from https://github.com/rezoner/playground
 * Originally written by Rezoner.
 */

function pool(this: any, constructor: any, ...args: any[]) {
	this.getPool = (constructor: any) => {
		let pool = this.pools.get(constructor);

		if (!pool) {
			this.pools.set(constructor, []);

			return this.getPool(constructor);
		}

		return pool;
	};

	this.pull = (constructor: any, ...args: any[]) => {
		let pool = this.getPool(constructor);

		if (!pool.length) {
			for (let i = 0; i < 10; i++) {
				pool.push(new constructor());
			}
		}

		let result = pool.pop();

		result[this.resetMethod](args);

		return result;
	};

	this.push = (object: object) => {
		let pool = this.getPool(object.constructor);
		pool.push(object);
	};

	if (typeof constructor === "function") {
		return this.pull(constructor, args[1]);
	} else {
		return this.push(constructor);
	}
}

export default pool;
