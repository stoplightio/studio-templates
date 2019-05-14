---
tags: [Plugins]
---

# Plugins

The Stoplight plugin system allows end users and organizations to enrich their experience across the Stoplight ecosystem - from Studio to Explorer to Governance.

## Quick Reference

### Install a plugin

1. Press `Cmd+P` to open up the plugin installer
2. Enter the location of the plugin's package.json file and hit **Enter**.

- a remote URL i.e. "http://localhost:5000/package.json", or
- an absolute filepath i.e. "/Users/stoplight/studio/src/project-templates/scratch/plugins/example/package.json", or
- a relative filepath. (Relative to the current active project i.e. "plugins/example/package.json")

After a plugin is installed, it will be enabled by default.

> Plugins installed using a relative filepath will only install in the current project. This is useful for developing plugins while in Studio.

### Enabling / disabling plugins

There's no UI yet, but in the developer console you can run

```js
// Plugins are enabled by default
__SL.registries.plugin.enablePlugin('plugin-id'); // to enable
__SL.registries.plugin.disablePlugin('plugin-id'); // to disable
```

**Plugins will be enabled by default**

### Uninstalling a plugin

There's no UI yet, but in the developer console you can run

```js
__SL.registries.plugin.uninstallPlugin('plugin-id'); // to uninstall
```

### Example

1. Start by opening the plugin loader `mod+p`
2. Enter the relative path to the **example-plugin**'s package.json file: `plugins/example/package.json`

Use the **example-plugin**! In its package.json file, it binds `mod+e` to the `notification.info` command it declares. You can trigger the plugin via `mod+e` shortcut and it will ask you for some input.

## Developing Plugins

Plugin's are powered using two files, a `package.json` and `plugin.js`.

### Package file

The package file is used to register menus, commands and keybindings.

package.json

```json
{
  "name": "plugin-name",
  "version": "0.0.1",
  "main": "./plugin.js",
  "stoplight": {
    "commands": [],

    "keybindings": [],

    "menus": {
      "view/item/context": [],
      "editor/actions": []
    }
  }
}
```

### Plugin file

The plugin file should export a function called "activate" that will be executed when the project is activated.

plugin.js

```javascript
module.exports = {
  async activate() {
    // Access the Plugin API using the global SL variable
  },
};
```

### Çommands

A command is declared in your package file using the following interface. Commands have a unique identifier that are referenced by menu items and keybindings in order to execute a CommandHandler.

package.json

```json
{
  "name": "example-plugin",
  "version": "0.0.1",
  "main": "./plugin.js",
  "stoplight": {
    "commands": [
      {
        "command": "notifications.info",
        "title": "Send Info Notification"
      }
    ]
  }
}
```

A command has the following interface,

```typescript
interface ICommand {
  command: string; // A unique identifier for the command
  title: string; // The title to be shown when this command is referenced (ie. the label for a menu item)
  when?: string; // A javascript expression to determine if the command should be enabled. (ie. "nodeType === 'file'")
}
```

CommandHandlers are JavaScript functions that are registered to specific commands declared in your package file. They should be registered in your plugin file using the following API:

plugin.js

```javascript
SL.commands.register('my-plugin.commandId', function(node, ...commandArgs) {
  // Logic to handle the command...
});
```

### Graph

Every project has a graph that contains all of it's files (called "source nodes"). A source node's content is parsed using a source map that creates "sourcemap" nodes for each part of content it matches.

When commands are executed, they are given a node as their first argument. You can also use the Plugin API to look up any node in the current project's graph.

plugin.js

```javascript
const node = await SL.graph.getNode('some-node-id');
```

```typescript
interface INode {
  readonly id: string;

  owner: string; // The plugin which created this node.

  readonly category: NodeCategory; // "source", "sourcemap", or "virtual" .
  type: string;

  readonly parentId?: string;
  readonly uri: string; // The nodes full path (ie. /users/me/files/file.json)
  path: string; // The node's relative path to it's parent (ie. 'files.json')

  data?: any; // An object that contains the raw and parsed content of the file.
}
```

### Menus

A **Menu** is just an array for **MenuItem** that are registered for a particular view. There are a few different views where you can register a **Menu**,

- `view/item/context`: Registers a menu items for a specific node's context menu.
- `editor/actions`: Registers menu items above the right sidebar.

#### Menu items

```typescript
interface IMenuItem {
  command: string; // The command to execute when this menu item is clicked
  commandArgs?: any[]; // Extra arguments that should be passed to the command
  label?: string; // Override the command's title
  when?: string; // A javascript expression to determine when this menu item should enabled. (ie. "nodeType === 'file'")
}
```

### Keybindings

```typescript
interface IKeybinnings {
  commandId: string; // A command Id to execute when the keybinding is pressed.
  shortcut: string; // The keys that will execute the above command. (ie. "mod + shift + n")
  when?: string; // A javascript expression to determine when this keybinding should be enabled. (ie. "nodeType === 'file'")
  args?: any[]; // Any additional arguments that should be passed to the command handler.
}
```

### Cache

Each plugin contains its own storage space that will persist between app loads. You can access your plugin's cache within your command handlers using the Plugin API.

```javascript
// Let's set some value in the cache
SL.cache.set('some-cache-key', { key: 'value' });

// You get the entire value using the key you set it with
await SL.cache.get('some-cache-key'); // Resolves to { key: "value" }

// Or you can also use dot notation to get a specific value from a key
await SL.cache.get('some-cache-key.key'); // Resolves to "value"
```

### Send HTTP requests

```javascript
try {
  var response = await SL.http.send({
    method: 'get',
    url: 'https://example.com',
    // ...headers, query params, body
  });
} catch (error) {
  // Handle request failure
}
```

### Notifications

You can trigger a notification that will popup in the bottom right hand side of the screen to notify the user of some information such as a successful event or an error.

```javascript
SL.notifications.addError('Oops something went wrong');
```

### Omnibar

The Omnibar is a global input that can be used to gather input from the user.

For example, you could ask for some input before sending an HTTP request.

```javascript
const url = await SL.omnibar.showInput('Where do you want to send the request?', {
  placeholder: 'http://localhost:8000',
});

if (!url) {
  // User canceled
  return;
}

await SL.http.send({ method: 'get', url });
```

## Plugin API

```typescript
export declare class SL {
  public cache: {
    get<T>(id: string): Promise<T>;
    set(id: string, value: any, configurationTarget?: ConfigurationTarget): Promise<void>;
  };

  public commands: {
    register(commandId: string, handler: (...args: any[]) => any): IDisposable;
    execute<T>(commandId: string, ...args: any[]): Promise<T | undefined>;
  };

  public http: {
    send(request: IHttpRequest): Promise<IHttpResponse>;
  };

  public notifications: {
    addInfo(message: string, options?: INotificationOptions): Promise<void>;
    addSuccess(message: string, options?: INotificationOptions): Promise<void>;
    addWarning(message: string, options?: INotificationOptions): Promise<void>;
    addError(message: string, options?: INotificationOptions): Promise<void>;
  };

  public omnibar: {
    showInput(prompt: string, options?: IOmnibarInputOptions): Promise<string | undefined>;
  };

  public graph: {
    getNode(id: string): Promise<DehydratedNode | undefined>;
    patchNode(id: string, patch: JsonPatch): Promise<void>;

    /**
     * Register a specification provider.
     *
     * Multiple providers can be registered for a node. In that case providers are asked in
     * parallel and the results are merged. A failing provider (rejected promise or exception) will
     * not cause a failure of the whole operation.
     *
     * @param selector A selector that defines the nodes this provider is applicable to, beyond those with the given spec id.
     * @param provider A specification provider.
     * @return A disposable that unregisters this provider when being disposed.
     */
    registerSpecProvider(selector: NodeSelector, provider: ISpecProvider): IDisposable;

    /**
     * Register a markdown provider.
     *
     * Multiple providers can be registered for a node. In that case providers are asked in
     * parallel and the results are merged. A failing provider (rejected promise or exception) will
     * not cause a failure of the whole operation.
     *
     * @param selector A selector that defines the nodes this provider is applicable to.
     * @param provider A markdown provider.
     * @return A disposable that unregisters this provider when being disposed.
     */
    registerMarkdownProvider(
      selector: NodeSelector,
      provider: (nodeId: string) => Promise<string | undefined>
    ): IDisposable;

    onDidChangeSourceNodeContent(
      handler: (event: ISourceNodeChangeEvent) => void,
      selector?: NodeSelector
    ): Promise<void>;
    setSourceNodeDiagnostics(id: string, diagnostics: IDiagnostic[]): void;
  };

  public form: {
    register(form: IPluginPkgForm): Promise<void>;
  };
}
```
