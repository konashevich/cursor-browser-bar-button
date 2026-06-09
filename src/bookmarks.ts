import * as vscode from 'vscode';

export interface FavoriteEntry {
  name: string;
  url: string;
}

export const FAVORITES_STORAGE_KEY = 'cursorBrowserBarButton.favorites';
export const BOOKMARKS_VIEW_ID = 'cursorBrowserBarButton.view';

export class Favorite extends vscode.TreeItem {
  constructor(
    readonly label: string,
    readonly url: string,
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = url;
    this.description = url;
    this.contextValue = 'favorite';
    this.iconPath = new vscode.ThemeIcon('world');
    this.command = {
      command: 'cursorBrowserBarButton.openFavorite',
      title: 'Open Favorite',
      arguments: [this],
    };
  }
}

export class FavoriteProvider implements vscode.TreeDataProvider<Favorite> {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<
    Favorite | undefined | null | void
  >();

  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private readonly context: vscode.ExtensionContext) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Favorite): vscode.TreeItem {
    return element;
  }

  getChildren(): Favorite[] {
    const favorites = this.context.globalState.get<FavoriteEntry[]>(
      FAVORITES_STORAGE_KEY,
      [],
    );
    return favorites.map((f) => new Favorite(f.name, f.url));
  }
}
