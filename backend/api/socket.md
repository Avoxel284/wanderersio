# Socket Opcodes

### `"HELLO"`

### `"CONNECT"`

### `"INTERACT"`

Interact with an object.

```ts
{
	id: UUID,
	action: "lightCampfire"
}
```

### `"OPERATE"`

### `"INVENT"`

### `"INSPECT"`

### `"CHAT"`

Send a chat message.

```ts
{
	content: string;
}
```

### `"BUILD"`

Build anywhere.

```ts
{
	x: number,
	y: number,
	key: string
}
```

### `"BUILD_WALL"`

Payload:

```ts
{
	sx: number,
	sy: number,
	ex: number,
	ey: number
}
```

### `"BUILD_ON_WALL"`

Payload:

```ts
{
	key: string,
	wallId: UUID
}
```

### `"BUILD_ON_NODE"`

Payload:

```ts
{
	key: string,
	nodeId: UUID
}
```

### `"PLACE_CAMPFIRE"`

Place a campfire.

```ts
{
	x: number,
	y: number
}
```

### `"PLACE_PLANT"`

Place a plant.

```ts
{
	x: number,
	y: number,
	key: string
}
```

### `"BUILD_ON_MEADOW"`

Build on a meadow.

```ts
{
	x: number,
	y: number,
	key: string
}
```

### `"DESTROY_BUILDING"`

Payload:

```js
{
	id: UUID;
}
```

### `"OGRE"`

Payload:

```ts
{
	x: number,
	y: number
}
```

### `"ENEMY"`

Payload:

```ts
{
	x: number,
	y: number
}
```

### `"RELEASE"`

Payload:

```ts
{
	type: "GUN" | "MOVE";
}
```

### `"MOVE"`

Move the player.

```ts
{
	x: number,
	y: number
}
```

### `"MOVE_TOTEM"`

Payload:

```ts
{
	target: UUID;
}
```

### `"RECRUIT"`

Payload:

```ts
{
	x: number,
	y: number
}
```
