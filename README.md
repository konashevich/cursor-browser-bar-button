# HTML Browser Bar Button

Adds a **globe button** to the editor title bar when you have an HTML file open. One click opens the current file in **Cursor's embedded browser** — right next to actions like Split Editor, without digging through the `...` menu.

Works in **Cursor** and **VS Code** (with the built-in Simple Browser / browser editor integration).

## Features

- Globe icon in the primary editor title bar for `.html` / `.htm` files
- Opens the active file in Cursor's embedded browser
- Uses the correct local file URI format for in-editor preview
- Lightweight — no settings required

## Usage

1. Open any HTML file in the editor.
2. Click the **globe** button in the top-right of the editor tab bar.
3. The file opens in Cursor's embedded browser beside your editor.

You can also run the command from the Command Palette:

**Open HTML in Browser** (`editor.openHtmlInBrowser`)

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
