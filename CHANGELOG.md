# Change Log

All notable changes to the **HTML Browser Bar Button** extension are documented in this file.

## [0.2.1] - 2026-06-09

### Fixed

- Open the embedded browser in Cursor using `workbench.action.focusOrOpenBrowserEditor` instead of the VS Code-only `workbench.action.browser.open` command.

## [0.2.0] - 2026-06-09

### Added

- **Browser** Activity Bar side pane with persistent bookmarks (add, open, delete).
- Opens the embedded browser when the side pane is shown.
- **Open Local File from Clipboard** toolbar action for absolute paths and `file://` URLs.
- Explorer context menu entry to open local HTML files in the embedded browser.

## [0.1.4] - 2026-06-09

### Fixed

- Use the `$(globe)` codicon so the title-bar button matches other editor action icon colors.

## [0.1.3] - 2026-06-09

### Fixed

- Open the active HTML file using `uri.toString()` for `workbench.action.openBrowserEditor`, matching Cursor's built-in Explorer **Open in Browser** action (`filesExplorer.openFileInBrowser`).

## [0.1.2] - 2026-06-09

### Fixed

- Use command id `editor.openHtmlInBrowser` so Cursor shows the button in the editor tab title bar (Cursor hides extension title actions unless the command id starts with a built-in prefix such as `editor.`).

## [0.1.1] - 2026-06-09

### Fixed

- Show the title-bar button using `resourceExtname` instead of `resourceLangId` (matches how Cursor evaluates editor title context).
- Add the command to the editor `...` menu as a fallback.
- Use a dedicated SVG globe icon on the command.

## [0.1.0] - 2026-06-09

### Added

- Globe button in the editor title bar when an HTML file is open.
- Opens the active HTML file in Cursor's embedded browser.
- Command: **Open in Browser** (`cursorBrowserBarButton.openHtmlInBrowser`).
