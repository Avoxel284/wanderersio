/**
 * avoxel284 2026
 ************************************
 * Refactored from https://github.com/rezoner/playground
 * Originally written by Rezoner.
 */

import Events from "./Events";
import States from "./States";

class Application extends Events {
	killed = false;
	dataSource = {};
	events = new Events();
	states: States;
	currentState: any;

		background ="#272822"
		smoothing= 1
		paths : {base: string, images:string, fonts: string, rewrite: any, rewriteURL:any}= {
			base: "",
			images: "images/",
			fonts: "fonts/",
			rewrite: {},
			rewriteURL: {},
		}
		offsetX=0;
		offsetY= 0;
		skipEvents= false;
		disabledUntilLoaded=true;
		mouseThrottling=15;
	

	constructor(args: any) {
		// let app = this;
		super();

		this.states = new States(this);
		this.states.on("event", ()=>this.emitLocalEvent(),this);
		
		// this.mouse = new Mouse();
		// this.mouse
	}

	setState(state: string) {
		this.states.set(state);
	}

	emitLocalEvent(){
		return void 0;
	}

	rewriteURL(url:string) {
		return this.paths.rewriteURL[url] || url;
	}

	

}

export default Application;
