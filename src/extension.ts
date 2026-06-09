import * as vscode from 'vscode';
import {
  BOOKMARKS_VIEW_ID,
  FAVORITES_STORAGE_KEY,
  Favorite,
  FavoriteEntry,
  FavoriteProvider,
} from './bookmarks';
import {
  getTargetUri,
  looksLikeLocalFileTarget,
  openInEmbeddedBrowser,
} from './browser';

// Must use an `editor.*` command id so Cursor shows it in the editor tab
// title bar. Extension-contributed title actions are hidden by default unless
// the id starts with a built-in prefix (editor., workbench., git., etc.).
const OPEN_HTML_COMMAND_ID = 'editor.openHtmlInBrowser';

export function activate(context: vscode.ExtensionContext): void {
  const favoriteProvider = new FavoriteProvider(context);
  const treeView = vscode.window.createTreeView(BOOKMARKS_VIEW_ID, {
    treeDataProvider: favoriteProvider,
    showCollapseAll: false,
  });

  const addFavorite = async (): Promise<void> => {
    const url = await vscode.window.showInputBox({
      prompt: 'Enter the URL of the bookmark',
      placeHolder: 'https://example.com',
      ignoreFocusOut: true,
      validateInput: (text) => (text.trim() ? null : 'URL cannot be empty'),
    });
    if (url === undefined) {
      return;
    }

    const name = await vscode.window.showInputBox({
      prompt: 'Enter a name for the bookmark',
      placeHolder: 'My Favorite Site',
      value: url,
      ignoreFocusOut: true,
      validateInput: (text) => (text.trim() ? null : 'Name cannot be empty'),
    });
    if (name === undefined) {
      return;
    }

    const favorites = context.globalState.get<FavoriteEntry[]>(
      FAVORITES_STORAGE_KEY,
      [],
    );
    favorites.push({ name, url });
    await context.globalState.update(FAVORITES_STORAGE_KEY, favorites);
    favoriteProvider.refresh();
  };

  const deleteFavorite = async (item: Favorite): Promise<void> => {
    const favorites = context.globalState
      .get<FavoriteEntry[]>(FAVORITES_STORAGE_KEY, [])
      .filter((f) => f.url !== item.url || f.name !== item.label);
    await context.globalState.update(FAVORITES_STORAGE_KEY, favorites);
    favoriteProvider.refresh();
  };

  const openFavorite = async (favorite: Favorite): Promise<void> => {
    if (favorite?.url) {
      await openInEmbeddedBrowser(favorite.url);
    }
  };

  const openClipboardLocalFile = async (): Promise<void> => {
    const clipboardText = await vscode.env.clipboard.readText();

    if (!looksLikeLocalFileTarget(clipboardText)) {
      void vscode.window.showInformationMessage(
        'Clipboard does not contain an absolute local file path or a file:// URL.',
      );
      return;
    }

    await openInEmbeddedBrowser(clipboardText);
  };

  let openedForCurrentVisibility = false;

  const openFromActivityBar = async (): Promise<void> => {
    if (!treeView.visible || openedForCurrentVisibility) {
      return;
    }

    openedForCurrentVisibility = true;
    await openInEmbeddedBrowser();
  };

  context.subscriptions.push(
    treeView,
    treeView.onDidChangeVisibility(() => {
      if (treeView.visible) {
        void openFromActivityBar();
        return;
      }

      openedForCurrentVisibility = false;
    }),
    vscode.commands.registerCommand(OPEN_HTML_COMMAND_ID, async (uri?: vscode.Uri) => {
      const target = getTargetUri(uri);
      if (!target) {
        void vscode.window.showWarningMessage(
          'Open in Browser: no HTML file is active.',
        );
        return;
      }

      await openInEmbeddedBrowser(target);
    }),
    vscode.commands.registerCommand(
      'cursorBrowserBarButton.openBrowser',
      openInEmbeddedBrowser,
    ),
    vscode.commands.registerCommand(
      'cursorBrowserBarButton.addFavorite',
      addFavorite,
    ),
    vscode.commands.registerCommand(
      'cursorBrowserBarButton.deleteFavorite',
      deleteFavorite,
    ),
    vscode.commands.registerCommand(
      'cursorBrowserBarButton.openFavorite',
      openFavorite,
    ),
    vscode.commands.registerCommand(
      'cursorBrowserBarButton.openClipboardLocalFile',
      openClipboardLocalFile,
    ),
  );

  void openFromActivityBar();
}

export function deactivate(): void {}
