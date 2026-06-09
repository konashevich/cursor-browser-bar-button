# HTML Browser Bar Button

Adds a **globe button** to the editor title bar when you have an HTML file open, plus a **Browser** side pane in the Activity Bar with bookmarks. One click opens the current file or a saved URL in **Cursor's embedded browser**.

Works in **Cursor** and **VS Code** (with the built-in browser editor integration).

## Features

- Globe icon in the primary editor title bar for `.html` / `.htm` files
- **Browser** Activity Bar side pane — opens the embedded browser and lists bookmarks
- Save, open, and delete bookmarked URLs (persisted across sessions)
- **Open Local File from Clipboard** — paste an absolute path or `file://` URL from the clipboard
- Explorer context menu for local HTML files
- Uses the correct local file URI format for in-editor preview
- Lightweight — no settings required

## Usage

### Editor title bar

1. Open any HTML file in the editor.
2. Click the **globe** button in the top-right of the editor tab bar.
3. The file opens in Cursor's embedded browser beside your editor.

You can also run **Open HTML in Browser** (`editor.openHtmlInBrowser`) from the Command Palette, Explorer context menu, or editor tab `...` menu.

### Browser bookmarks side pane

1. Click the **Browser** icon in the Activity Bar — the embedded browser opens automatically.
2. Click **+** in the side pane title to add a bookmark (URL + name).
3. Click a bookmark to open it in the embedded browser.
4. Click the trash icon on a bookmark to delete it.
5. Click the clipboard icon to open a local file path copied to the clipboard.

## Requirements

- **Cursor** (recommended) or **VS Code** `1.85.0` or newer
- An HTML file open in a normal text editor (not a diff view)

## Extension Settings

This extension does not add any configuration settings.

## Known Limitations

- Only shown for files with language mode `html`.
- Hidden in diff editors.
- Local `file://` preview depends on Cursor's embedded browser; remote workspaces may behave differently.

## Development

```bash
npm install
npm run compile
npm run package
```

Press **F5** in this folder to launch an Extension Development Host.

## Publish to the Marketplace

1. Create a [Visual Studio Marketplace publisher](https://marketplace.visualstudio.com/manage).
2. Create a [Personal Access Token](https://dev.azure.com/) with **Marketplace (Publish)** scope.
3. Log in: `npx @vscode/vsce login <publisher-id>`
4. Update `publisher` in `package.json` if needed.
5. Publish: `npm run publish`

For Open VSX (VSCodium / compatible editors): `npx ovsx publish *.vsix -p <token>`.

## License

[MIT](LICENSE) © Oleksii Konashevych
