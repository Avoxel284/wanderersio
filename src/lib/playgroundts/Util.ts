/**
 * avoxel284 2026
 ************************************
 * Refactored from https://github.com/rezoner/playground
 * Originally written by Rezoner.
 */

export function extendClass(...args: any) {
	for (let i = 1; i < args.length; i++) {
		for (let j in args[i]) {
			args[0][j] = args[i][j];
		}
	}

	return args[0];
}

export function defaults(...args: any) {
	for (let i = 1; i < args.length; i++) {
		for (let j in args[i]) {
			if (typeof args[0][j] === "undefined") args[0][j] = args[i][j];
		}
	}

	return args[0];
}

export function merge(a: any, ...args: any) {
	for (let i = 1; i < args.length; i++) {
		let b = args[i];

		for (let key in b) {
			let value = b[key];

			if (typeof a[key] !== "undefined") {
				if (typeof a[key] === "object") merge(a[key], value);
				else a[key] = value;
			} else {
				a[key] = value;
			}
		}
	}
	return a;
}

export function invoke(object: any, methodName: string) {
	let args = Array.prototype.slice.call(arguments, 2);

	for (let i = 0; i < object.length; i++) {
		let current = object[i];

		if (current[methodName]) current[methodName].apply(current, args);
	}
}

export function throttle(fn: () => void, delay: number) {
	let timeout: any;
	let last = 0;

	return function (this: any) {
		let args: any = [];

		for (let i = 0; i < arguments.length; i++) args.push(arguments[i]);

		let context = this;

		if (Date.now() - last > delay) {
			last = Date.now();

			fn.apply(context, args);

			clearTimeout(timeout);
		} else {
			clearTimeout(timeout);

			timeout = setTimeout(function () {
				fn.apply(context, args);

				last = Date.now();
			}, Date.now() - last);
		}
	};
}

export function wrapTo(value: any, target: any, max: number, step: number) {
	if (value === target) return target;

	let result = value;

	let d = wrappedDistance(value, target, max);

	if (Math.abs(d) < step) return target;

	result += (d < 0 ? -1 : 1) * step;

	if (result > max) {
		result = result - max;
	} else if (result < 0) {
		result = max + result;
	}

	return result;
}

export const wrap = clamp;
export function clamp(value: number, min: number, max: number) {
	if (value < min) return max + (value % max);
	if (value >= max) return value % max;
	return value;
}

/**
 * Clamps a given value between 0 and 2*PI.
 * Valid values for the length of a circle in radians is
 * 2*PI.
 *
 * @param value value to process
 * @return a value in 0..2*PI interval
 */
export function circWrap(value: number) {
	return wrap(value, 0, Math.PI * 2);
}

/**
 * Clamps a given value between 0 and 2*PI to a given target.
 * Valid values for the length of a circle in radians is
 * 2*PI.
 *
 * @param value value to process
 * @return a value in 0..2*PI interval
 */
export function circWrapTo(value: number, target: number, step: number) {
	return wrapTo(value, target, Math.PI * 2, step);
}

export function wrappedDistance(a: number, b: number, max: number) {
	if (a === b) return 0;
	else if (a < b) {
		var l = -a - max + b;
		var r = b - a;
	} else {
		var l = b - a;
		var r = max - a + b;
	}

	if (Math.abs(l) > Math.abs(r)) return r;
	else return l;
}

export function circWrappedDistance(a: number, b: number) {
	return wrappedDistance(a, b, Math.PI * 2);
}

export const circDistance = (a: number, b: number) => {
	console.warn("Deprecated shorthand circDistance called");
	return circWrappedDistance(a, b);
};

/**
 * Compute first multiple of threshold that is smaller or equal to value.
 * Valid values for the length of a circle in radians is 2*PI.
 *
 * @param value the number to adjust
 * @param threshold reference value
 * @return an even multiple of `threshold` smaller or equal to `num`
 */
export function ground(value: number, threshold: number) {
	return ((value / threshold) | 0) * threshold;
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
	if (arguments.length > 2) {
		let dx = x1 - x2;
		let dy = y1 - y2;

		return Math.sqrt(dx * dx + dy * dy);
	} else {
		console.error(`Deprecated use of distance util fn. x1.x = ${(x1 as any).x}; y1.x = ${(y1 as any).x}`);
		// let dx = x1.x - y1.x;
		// let dy = x1.y - y1.y;

		// return Math.sqrt(dx * dx + dy * dy);
		return 0;
	}
}

export function sprintf(value: string, replace: string[]) {
	for (let key in replace) {
		let find = new RegExp("{" + key + "}", "g");

		value = value.replace(find, replace[key]);
	}

	return value;
}

export function classInParents(element: any, className: string) {
	let parent = element;

	while (parent) {
		if (parent.classList.contains(className)) {
			return true;
		}

		parent = parent.parentElement;
	}

	return false;
}
