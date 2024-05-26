[javamgr](../wiki/globals) / JavaManager

# Class: JavaManager

Initialize a java manager instance, taking as input the path to the folder storing the runtimes. In the following documentation, a "store" refers to the folder where runtimes are stored.

## Constructors

### new JavaManager()

> **new JavaManager**(`path`): [`JavaManager`](../wiki/Class.JavaManager)

#### Parameters

• **path**: `string`

#### Returns

[`JavaManager`](../wiki/Class.JavaManager)

#### Source

[index.ts:20](https://github.com/HerozDotExe/javamgr/blob/8b8546c1052ba43594e5884a2f9ffabd4a23f655/src/index.ts#L20)

## Properties

### path

> **path**: `string`

#### Source

[index.ts:16](https://github.com/HerozDotExe/javamgr/blob/8b8546c1052ba43594e5884a2f9ffabd4a23f655/src/index.ts#L16)

***

### progressCallback()?

> `private` `optional` **progressCallback**: (`progress`, `total`) => `void`

#### Parameters

• **progress**: `number`

• **total**: `number`

#### Returns

`void`

#### Source

[index.ts:18](https://github.com/HerozDotExe/javamgr/blob/8b8546c1052ba43594e5884a2f9ffabd4a23f655/src/index.ts#L18)

***

### runtimes?

> `private` `optional` **runtimes**: [`Runtimes`](../wiki/Type.Runtimes)

#### Source

[index.ts:17](https://github.com/HerozDotExe/javamgr/blob/8b8546c1052ba43594e5884a2f9ffabd4a23f655/src/index.ts#L17)

## Methods

### checkForStore()

> `private` **checkForStore**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Source

[index.ts:24](https://github.com/HerozDotExe/javamgr/blob/8b8546c1052ba43594e5884a2f9ffabd4a23f655/src/index.ts#L24)

***

### checkIntegrity()

> **checkIntegrity**(`component`): `Promise`\<`void`\>

Compares runtime files with mojang api checksums; if a file doesn't match, it's downloaded again.

#### Parameters

• **component**: `string`

#### Returns

`Promise`\<`void`\>

#### Source

[index.ts:136](https://github.com/HerozDotExe/javamgr/blob/8b8546c1052ba43594e5884a2f9ffabd4a23f655/src/index.ts#L136)

***

### getRuntimes()

> `private` **getRuntimes**(): `Promise`\<[`Runtimes`](../wiki/Type.Runtimes)\>

#### Returns

`Promise`\<[`Runtimes`](../wiki/Type.Runtimes)\>

#### Source

[index.ts:30](https://github.com/HerozDotExe/javamgr/blob/8b8546c1052ba43594e5884a2f9ffabd4a23f655/src/index.ts#L30)

***

### install()

> **install**(`component`): `Promise`\<`void`\>

Install a runtume by component.

#### Parameters

• **component**: `string`

#### Returns

`Promise`\<`void`\>

#### Source

[index.ts:43](https://github.com/HerozDotExe/javamgr/blob/8b8546c1052ba43594e5884a2f9ffabd4a23f655/src/index.ts#L43)

***

### list()

> **list**(): `Promise`\<`string`[]\>

Returns an array of component strings, essentially fs.readdir on the store path.

#### Returns

`Promise`\<`string`[]\>

#### Source

[index.ts:104](https://github.com/HerozDotExe/javamgr/blob/8b8546c1052ba43594e5884a2f9ffabd4a23f655/src/index.ts#L104)

***

### onProgress()

> **onProgress**(`cb`): `void`

Define the callback function called each time a file is downloaded.

#### Parameters

• **cb**

#### Returns

`void`

#### Source

[index.ts:129](https://github.com/HerozDotExe/javamgr/blob/8b8546c1052ba43594e5884a2f9ffabd4a23f655/src/index.ts#L129)

***

### uninstall()

> **uninstall**(`component`): `Promise`\<`void`\>

Delete a runtime by component.

#### Parameters

• **component**: `string`

#### Returns

`Promise`\<`void`\>

#### Source

[index.ts:92](https://github.com/HerozDotExe/javamgr/blob/8b8546c1052ba43594e5884a2f9ffabd4a23f655/src/index.ts#L92)

***

### use()

> **use**(`mcVersion`, `executable`): `Promise`\<`string`\>

Calls .install with the corresponding Minecraft version and returns the path to the executable. On Windows, you can define the executable as javaw to hide the console.

#### Parameters

• **mcVersion**: `string`

• **executable**: `string`= `"java"`

#### Returns

`Promise`\<`string`\>

#### Source

[index.ts:111](https://github.com/HerozDotExe/javamgr/blob/8b8546c1052ba43594e5884a2f9ffabd4a23f655/src/index.ts#L111)
