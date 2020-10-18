# ResourceManager

Basic resource manager without external dependencies.

### Usage

In your project folder, run `npm i @alifurkan/resourcemanager`.

`index.js`

```js
const ResourceManager = require("resourcemanager");
const resources = new ResourceManager( // Defaults
	"resources", // Folder name
	true, // Recursion
	true // Caching
); // defaults

async function main() {
	console.log(await resources.get("hello.txt"));
}
main();
```

`resources/hello.txt`

```
Hello, world!
```

Assuming your file hierarchy is like this,

```
app
\____ resources
 \	  \____ hello.txt
  \__ index.js
```

the program will output `Hello, world!`.