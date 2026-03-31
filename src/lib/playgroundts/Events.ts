/**
 * avoxel284 2026
 ************************************
 * Refactored from https://github.com/rezoner/playground
 * Originally written by Rezoner.
 */

/**
 * Base class for objects emitting events.
 *
 * An associative array for listners is maintained internally.
 * The keys are the names of the event while the values are
 * lists of listners objects with three properties:
 * - once: is this a one time event or a recurring one
 * - callback: function to call
 * - context: the value for *this* inside *callback*.
 *
 * A special event is called `event`. The listners for
 * this event will receive all broadcasted events
 * with three arguments: `context`, `event name`, `data`.
 * Callbacks for other events are simply called with
 * `context` and `data`.
 */
class Events {
	listeners: any = {};

	constructor() {
		this.listeners = {};
	}

	/**
	 * Add a listener for an event.
	 *
	 * @param event The name of the event or an associative array
	 * where keys are event names and values are
	 * callbacks to use.
	 *
	 * @param callback The function to call for this listener;
	 * if *event* is an object this parameter is ignored.
	 * @param context *This* when calling the callback(s)
	 *
	 * @returns the listner object
	 */
	on(event: any, callback: () => void, context: any = undefined) {
		if (typeof event === "object") {
			let result: any = {};
			for (let key in event) {
				result[key] = this.on(key, event[key], context);
			}
			return result;
		}

		if (!this.listeners[event]) this.listeners[event] = [];

		let listener = {
			once: false,
			callback: callback,
			context: context,
		};
		this.listeners[event].push(listener);

		return listener;
	}

	/**
	 * Add a listener for an event that is triggered once, then destroyed.
	 *
	 * @param event The name of the event or an associative array
	 * where keys are event names and values are
	 * callbacks to use.
	 *
	 * @param callback The function to call for this listener;
	 * if *event* is an object this parameter is ignored.
	 * @param context *This* when calling the callback(s)
	 *
	 * @returns the listner object
	 */
	once(event: any, callback: () => void, context: any) {
		if (typeof event === "object") {
			let result: any = {};
			for (let key in event) {
				result[key] = this.once(key, event[key], context);
			}
			return result;
		}

		if (!this.listeners[event]) this.listeners[event] = [];

		let listener = {
			once: true,
			callback: callback,
			context: context,
		};
		this.listeners[event].push(listener);

		return listener;
	}

	/**
	 * Remove an event listener from an event.
	 *
	 * The function will remove all occurences that use that particular
	 * callback (will be a single instance in well behaved applications).
	 *
	 * @param event The name of the event
	 * @param callback Identify the listener
	 */

	off(event: any, callback: any) {
		for (let i = 0, len = this.listeners[event].length; i < len; i++) {
			if (this.listeners[event][i] === callback) {
				this.listeners[event].splice(i--, 1);
				len--;
			}
		}
	}

	/**
	 * Shorthand for emit.
	 */
	trigger = this.emit;

	/**
	 * Emit an event
	 *
	 * If the listener is only to be triggered once, this function
	 * removes it from the list of listeners.
	 *
	 * @param event The name of the event being triggered
	 * @param data Array of arguments for the callbacks
	 *
	 */
	emit(event: any, data: any) {
		/* if you prefer events pipe */
		if (this.listeners["event"]) {
			for (let i = 0, len = this.listeners["event"].length; i < len; i++) {
				let listener = this.listeners["event"][i];

				listener.callback.call(listener.context || this, event, data);
			}
		}

		/* or subscribed to a single event */
		if (this.listeners[event]) {
			for (let i = 0, len = this.listeners[event].length; i < len; i++) {
				let listener = this.listeners[event][i];

				listener.callback.call(listener.context || this, data);

				if (listener.once) {
					this.listeners[event].splice(i--, 1);
					len--;
				}
			}
		}
	}
}

export default Events;