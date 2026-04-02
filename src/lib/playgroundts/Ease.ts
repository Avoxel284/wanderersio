/**
 * avoxel284 2026
 ************************************
 * Refactored from https://github.com/rezoner/playground
 * Originally written by Rezoner.
 */

import type { Matrix2D } from "./Types";

/*     

  Ease 1.1
  
  http://canvasquery.com
  
  (c) 2015 by Rezoner - http://rezoner.net

  `ease` may be freely distributed under the MIT license.
     
  Cubic-spline interpolation by Ivan Kuckir

  http://blog.ivank.net/interpolation-with-cubic-splines.html

  With slight modifications by Morgan Herlocker

  https://github.com/morganherlocker/cubic-spline

*/

class Ease {
	defaultEasing = "016";
	splineK: any = {};
	splineX: any = {};
	splineY: any = {};

	cache: any = {
		linear(t: number) {
			return t;
		},

		inQuad(t: number) {
			return t * t;
		},

		outQuad(t: number) {
			return t * (2 - t);
		},
		inOutQuad(t: number) {
			return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
		},
		inCubic(t: number) {
			return t * t * t;
		},
		outCubic(t: number) {
			return --t * t * t + 1;
		},
		inOutCubic(t: number) {
			return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
		},
		inQuart(t: number) {
			return t * t * t * t;
		},
		outQuart(t: number) {
			return 1 - --t * t * t * t;
		},
		inOutQuart(t: number) {
			return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
		},
		inQuint(t: number) {
			return t * t * t * t * t;
		},
		outQuint(t: number) {
			return 1 + --t * t * t * t * t;
		},
		inOutQuint(t: number) {
			return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
		},
		inSine(t: number) {
			return -1 * Math.cos((t / 1) * (Math.PI * 0.5)) + 1;
		},
		outSine(t: number) {
			return Math.sin((t / 1) * (Math.PI * 0.5));
		},
		inOutSine(t: number) {
			return (-1 / 2) * (Math.cos(Math.PI * t) - 1);
		},
		inExpo(t: number) {
			return t == 0 ? 0 : Math.pow(2, 10 * (t - 1));
		},
		outExpo(t: number) {
			return t == 1 ? 1 : -Math.pow(2, -10 * t) + 1;
		},
		inOutExpo(t: number) {
			if (t == 0) return 0;
			if (t == 1) return 1;
			if ((t /= 1 / 2) < 1) return (1 / 2) * Math.pow(2, 10 * (t - 1));
			return (1 / 2) * (-Math.pow(2, -10 * --t) + 2);
		},
		inCirc(t: number) {
			return -1 * (Math.sqrt(1 - t * t) - 1);
		},
		outCirc(t: number) {
			return Math.sqrt(1 - (t = t - 1) * t);
		},
		inOutCirc(t: number) {
			if ((t /= 1 / 2) < 1) return (-1 / 2) * (Math.sqrt(1 - t * t) - 1);
			return (1 / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1);
		},
		inElastic(t: number) {
			var s = 1.70158;
			var p = 0;
			var a = 1;
			if (t == 0) return 0;
			if (t == 1) return 1;
			if (!p) p = 0.3;
			if (a < 1) {
				a = 1;
				var s = p / 4;
			} else var s = (p / (2 * Math.PI)) * Math.asin(1 / a);
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t - s) * (2 * Math.PI)) / p));
		},
		outElastic(t: number) {
			var s = 1.70158;
			var p = 0;
			var a = 1;
			if (t == 0) return 0;
			if (t == 1) return 1;
			if (!p) p = 0.3;
			if (a < 1) {
				a = 1;
				var s = p / 4;
			} else var s = (p / (2 * Math.PI)) * Math.asin(1 / a);
			return a * Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p) + 1;
		},
		inOutElastic(t: number) {
			var s = 1.70158;
			var p = 0;
			var a = 1;
			if (t == 0) return 0;
			if ((t /= 1 / 2) == 2) return 1;
			if (!p) p = 0.3 * 1.5;
			if (a < 1) {
				a = 1;
				var s = p / 4;
			} else var s = (p / (2 * Math.PI)) * Math.asin(1 / a);
			if (t < 1)
				return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t - s) * (2 * Math.PI)) / p));
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin(((t - s) * (2 * Math.PI)) / p) * 0.5 + 1;
		},
		inBack(t: number, s: number) {
			if (s == undefined) s = 1.70158;
			return 1 * t * t * ((s + 1) * t - s);
		},
		outBack(t: number, s: number) {
			if (s == undefined) s = 1.70158;
			return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1);
		},
		inOutBack(t: number, s: number) {
			if (s == undefined) s = 1.70158;
			if ((t /= 1 / 2) < 1) return (1 / 2) * (t * t * (((s *= 1.525) + 1) * t - s));
			return (1 / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
		},
		inBounce(t: number) {
			return 1 - this.outBounce(1 - t);
		},
		outBounce(t: number) {
			if ((t /= 1) < 1 / 2.75) {
				return 7.5625 * t * t;
			} else if (t < 2 / 2.75) {
				return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
			} else if (t < 2.5 / 2.75) {
				return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
			} else {
				return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
			}
		},
		inOutBounce(t: number) {
			if (t < 1 / 2) return this.inBounce(t * 2) * 0.5;
			return this.outBounce(t * 2 - 1) * 0.5 + 0.5;
		},
	};

	constructor(progress: number, easing: string) {
		if (typeof this.cache[easing] === "function") {
			return this.cache[easing](progress);
		} else {
			return this.spline(progress, easing || this.defaultEasing);
		}
	}

	insertIntermediateValues(a: number[]) {
		let result = [];
		for (var i = 0; i < a.length; i++) {
			result.push(a[i]);

			if (i < a.length - 1) result.push(a[i + 1] + (a[i] - a[i + 1]) * 0.6);
		}

		return result;
	}

	spline(x: number, easingType: string) {
		if (!this.splineK[easingType]) {
			let xs = [];
			let ys = this.translateEasing(easingType);

			// ys = this.insertIntermediateValues(ys);

			if (!ys.length) return 0;

			for (let i = 0; i < ys.length; i++) xs.push(i * (1 / (ys.length - 1)));

			let ks = xs.map(function () {
				return 0;
			});

			ks = this.getNaturalKs(xs, ys, ks);

			this.splineX[easingType] = xs;
			this.splineY[easingType] = ys;
			this.splineK[easingType] = ks;
		}

		if (x > 1) return this.splineY[easingType][this.splineY[easingType].length - 1];

		let ks: number[] = this.splineK[easingType];
		let xs: any[] = this.splineX[easingType];
		let ys = this.splineY[easingType];

		let i = 1;

		while (xs[i] < x) i++;

		let t = (x - xs[i - 1]) / (xs[i] - xs[i - 1]);
		let a = ks[i - 1] * (xs[i] - xs[i - 1]) - (ys[i] - ys[i - 1]);
		let b = -ks[i] * (xs[i] - xs[i - 1]) + (ys[i] - ys[i - 1]);
		let q = (1 - t) * ys[i - 1] + t * ys[i] + t * (1 - t) * (a * (1 - t) + b * t);

		return q;
	}

	getNaturalKs(xs: number[], ys: number[], ks: number[]) {
		let n = xs.length - 1;
		let A = this.zerosMat(n + 1, n + 2);

		for (
			let i = 1;
			i < n;
			i++ // rows
		) {
			A[i][i - 1] = 1 / (xs[i] - xs[i - 1]);
			A[i][i] = 2 * (1 / (xs[i] - xs[i - 1]) + 1 / (xs[i + 1] - xs[i]));
			A[i][i + 1] = 1 / (xs[i + 1] - xs[i]);
			A[i][n + 1] =
				3 *
				((ys[i] - ys[i - 1]) / ((xs[i] - xs[i - 1]) * (xs[i] - xs[i - 1])) +
					(ys[i + 1] - ys[i]) / ((xs[i + 1] - xs[i]) * (xs[i + 1] - xs[i])));
		}

		A[0][0] = 2 / (xs[1] - xs[0]);
		A[0][1] = 1 / (xs[1] - xs[0]);
		A[0][n + 1] = (3 * (ys[1] - ys[0])) / ((xs[1] - xs[0]) * (xs[1] - xs[0]));

		A[n][n - 1] = 1 / (xs[n] - xs[n - 1]);
		A[n][n] = 2 / (xs[n] - xs[n - 1]);
		A[n][n + 1] = (3 * (ys[n] - ys[n - 1])) / ((xs[n] - xs[n - 1]) * (xs[n] - xs[n - 1]));

		return this.solve(A, ks);
	}

	translateEasing(key: string) {
		if (!this.cache[key]) {
			let array: any[] = key.split("");

			let sign = 1;
			let signed = false;
			let trimming = false;

			for (var i = 0; i < array.length; i++) {
				var char = array[i];

				if (char === "-") {
					sign = -1;
					signed = true;
					array.splice(i--, 1);
				} else if (char === "+") {
					sign = 1;
					array.splice(i--, 1);
				} else if (char === "t") {
					trimming = !trimming;
					array.splice(i--, 1);
				} else array[i] = parseInt(array[i], 16) * sign;
			}

			let min = Math.min.apply(null, array);
			let max = Math.max.apply(null, array);
			let diff = max - min;
			let cache = [];
			let normalized = [];

			for (var i = 0; i < array.length; i++) {
				if (signed) {
					let diff = Math.max(Math.abs(min), Math.abs(max));
					var value = array[i] / diff;
				} else {
					let diff = max - min;
					var value = (array[i] - min) / diff;
				}

				if (trimming) {
					if (value < 0) value = 0;
					if (value > 1.0) value = 1.0;
				}

				normalized.push(value);
			}

			this.cache[key] = normalized;
		}

		return this.cache[key];
	}

	solve(A: Matrix2D, ks: number[]) {
		let m = A.length;
		for (
			let k = 0;
			k < m;
			k++ // column
		) {
			// pivot for column
			let i_max = 0;
			let vali = Number.NEGATIVE_INFINITY;
			for (var i = k; i < m; i++)
				if (A[i][k] > vali) {
					i_max = i;
					vali = A[i][k];
				}
			this.splineSwapRows(A, k, i_max);

			// for all rows below pivot
			for (let i = k + 1; i < m; i++) {
				for (let j = k + 1; j < m + 1; j++) A[i][j] = A[i][j] - A[k][j] * (A[i][k] / A[k][k]);
				A[i][k] = 0;
			}
		}
		for (
			var i = m - 1;
			i >= 0;
			i-- // rows = columns
		) {
			var v = A[i][m] / A[i][i];
			ks[i] = v;
			for (
				var j = i - 1;
				j >= 0;
				j-- // rows
			) {
				A[j][m] -= A[j][i] * v;
				A[j][i] = 0;
			}
		}
		return ks;
	}

	zerosMat(r: number, c: number) {
		let A: number[][] = [];
		for (var i = 0; i < r; i++) {
			A.push([]);
			for (var j = 0; j < c; j++) A[i].push(0);
		}
		return A;
	}

	splineSwapRows(m: Matrix2D, k: number, l: number) {
		let p = m[k];
		m[k] = m[l];
		m[l] = p;
	}
}

export default Ease;