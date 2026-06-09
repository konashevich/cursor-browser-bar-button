import * as path from 'path';
import * as vscode from 'vscode';

const TRACKING_ID = 'html_bar_button';

function isAbsoluteFilePath(target: string): boolean {
  return path.isAbsolute(target) || /^[a-zA-Z]:[\\/]/.test(target);
}

export function normalizeBrowserTarget(
  target: string | vscode.Uri | undefined,
): string | undefined {
  if (!target) {
    return undefined;
  }

  if (target instanceof vscode.Uri) {
    return target.toString(true);
  }

  if (typeof target !== 'string') {
    return undefined;
  }

  const trimmedTarget = target.trim();
  if (!trimmedTarget) {
    return undefined;
  }

  if (isAbsoluteFilePath(trimmedTarget)) {
    return vscode.Uri.file(trimmedTarget).toString(true);
  }

  try {
    const parsedTarget = vscode.Uri.parse(trimmedTarget, true);
    if (parsedTarget.scheme) {
      return parsedTarget.toString(true);
    }
  } catch {
    // Leave non-URI strings unchanged and let the browser command handle them.
  }

  return trimmedTarget;
}

export function looksLikeLocalFileTarget(target: unknown): boolean {
  if (!target || typeof target !== 'string') {
    return false;
  }

  const trimmedTarget = target.trim();
  if (!trimmedTarget) {
    return false;
  }

  if (isAbsoluteFilePath(trimmedTarget)) {
    return true;
  }

  try {
    const parsedTarget = vscode.Uri.parse(trimmedTarget, true);
    return parsedTarget.scheme === 'file';
  } catch {
    return false;
  }
}

export async function openInEmbeddedBrowser(
  target?: string | vscode.Uri,
): Promise<void> {
  const normalizedTarget = normalizeBrowserTarget(target);

  try {
    if (normalizedTarget) {
      await vscode.commands.executeCommand('workbench.action.openBrowserEditor', {
        url: normalizedTarget,
        trackingId: TRACKING_ID,
      });
      return;
    }

    // Cursor: focus an existing browser tab or open a new empty one.
    // Do not use workbench.action.browser.open — that command exists in VS Code
    // 1.109+ but is not registered in Cursor.
    await vscode.commands.executeCommand(
      'workbench.action.focusOrOpenBrowserEditor',
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);
    void vscode.window.showErrorMessage(
      `Failed to open embedded browser: ${message}`,
    );
  }
}

export function getTargetUri(uri?: vscode.Uri): vscode.Uri | undefined {
  if (uri) {
    return uri;
  }

  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor?.document.uri.scheme === 'file') {
    return activeEditor.document.uri;
  }

  return undefined;
}
