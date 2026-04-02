export interface PlaygroundMouseEvent {
	x: number;
	y: number;
	deltaX?:number;
	deltaY?:number;
	button?: string;
	original: MouseEvent;
	id: number;
	touch?: boolean;
	wheelDelta?: number;
}
