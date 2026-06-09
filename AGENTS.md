# AGENTS.md — HTML Browser Bar Button

Cursor/VS Code extension: a **globe button** on the editor tab title bar when an `.html` / `.htm` file is open, plus a **Browser** Activity Bar side pane with bookmarks for the embedded browser.

## Repository layout

| Path | Purpose |
|------|---------|
| `src/extension.ts` | Activation, command registration |
| `src/browser.ts` | Embedded browser open helpers |
| `src/bookmarks.ts` | Bookmark tree view provider |
| `media/browser.svg` | Activity Bar icon |
| `package.json` | Extension manifest, menus, commands |
| `CHANGELOG.md` | User-facing version history |
| `VSIX/` | Packaged `.vsix` artifacts (keep **last 5** only; **tracked in git**) |
| `scripts/prune-vsix.mjs` | Deletes older VSIX files beyond the retention limit |

## Cursor-specific rules (do not regress)

1. **Title bar visibility** — Command id must start with a built-in prefix (`editor.`, `workbench.`, `git.`, etc.). Use `editor.openHtmlInBrowser`. Extension ids like `cursorBrowserBarButton.*` are hidden by default in Cursor.
2. **Menu `when` clause** — Use `resourceExtname == .html || resourceExtname == .htm`, not `resourceLangId`.
3. **Browser URL** — Pass the file URI string directly, matching Explorer **Open in Browser** (`filesExplorer.openFileInBrowser`):
   ```ts
   await vscode.commands.executeCommand('workbench.action.openBrowserEditor', {
     url: uri.toString(true),
     trackingId: 'html_bar_button',
   });
   ```
   Do **not** use `vscode.env.asExternalUri` or `vscode-file://` conversion (breaks with `https://cursor:workspace?file://...`).
   To open/focus an empty browser tab (Activity Bar click), use `workbench.action.focusOrOpenBrowserEditor`. Do **not** use `workbench.action.browser.open` or `simpleBrowser.show` — those are VS Code commands and are not registered in Cursor.
4. **Icon** — Use codicon `"icon": "$(globe)"` on the command so the title bar matches other actions. Custom SVG/png icons render with wrong colors.

## Development

```bash
npm install
npm run compile
npm run watch   # optional
```

Press **F5** in this folder to run an Extension Development Host.

## After every functional update

When code or manifest changes are complete, **always** produce a release artifact:

1. **Bump version** in `package.json` (semver) and add a `CHANGELOG.md` entry.
2. **Build and package** into `VSIX/`:
   ```bash
   npm run package:vsix
   ```
   This runs `compile`, creates `VSIX/cursor-browser-bar-button-<version>.vsix`, then prunes old files.
3. **Retention** — Keep **at most 5** `.vsix` files in `VSIX/`. The prune script removes older versions automatically (by semver, newest kept). Do not leave stray `.vsix` files in the repo root.
4. **Git** — `VSIX/` and its `.vsix` files are **not** gitignored; commit them with the release.
5. Tell the user the new version and path, e.g. `VSIX/cursor-browser-bar-button-0.1.5.vsix`.

Install locally:

```bash
cursor --install-extension "VSIX/cursor-browser-bar-button-<version>.vsix" --force
```

Then **Developer: Reload Window**.

## Publishing (Marketplace)

Publisher: `konashevich`

```bash
npm run publish
```

Requires `vsce login konashevich` and a Marketplace PAT.

## Scope

- Keep changes minimal; this extension is a single command + menu contributions.
- Do not commit secrets, `.env`, or `node_modules/`.
- Only create git commits when the user asks.
