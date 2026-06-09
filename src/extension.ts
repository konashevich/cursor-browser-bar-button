import * as vscode from 'vscode';

// Must use an `editor.*` command id so Cursor shows it in the editor tab
// title bar. Extension-contributed title actions are hidden by default unless
// the id starts with a built-in prefix (editor., workbench., git., etc.).
const COMMAND_ID = 'editor.openHtmlInBrowser';

function getTargetUri(uri?: vscode.Uri): vscode.Uri | undefined {
  if (uri) {
    return uri;
  }

  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor?.document.uri.scheme === 'file') {
    return activeEditor.document.uri;
  }

  return undefined;
}

async function openInEmbeddedBrowser(uri: vscode.Uri): Promise<void> {
  // Match Cursor's built-in Explorer action `filesExplorer.openFileInBrowser`:
  // pass the file URI string directly to openBrowserEditor. Do not use
  // env.asExternalUri (produces https://cursor:workspace?file://...) or
  // vscode-file:// conversion.
  await vscode.commands.executeCommand('workbench.action.openBrowserEditor', {
    url: uri.toString(true),
    trackingId: 'html_bar_button',
  });
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      COMMAND_ID,
      async (uri?: vscode.Uri) => {
        const target = getTargetUri(uri);
        if (!target) {
          void vscode.window.showWarningMessage(
            'Open in Browser: no HTML file is active.',
          );
          return;
        }

        await openInEmbeddedBrowser(target);
      },
    ),
  );
}

export function deactivate(): void {}
