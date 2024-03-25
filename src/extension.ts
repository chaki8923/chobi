import * as vscode from 'vscode';
import {execSync} from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('pret.run', () => {

    let editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
      return;
    }
    let selection = editor.selection;
    let selectedText = editor.document.getText(selection);

    let command = 'echo "' + selectedText + '" > ~/.rbprettier.rb';
    try {
      execSync(command);
    } catch (error: unknown) {
      if (error instanceof Error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
      }
      return;
    }

    command = 'prettier --plugin=@prettier/plugin-ruby ~/.rbprettier.rb';
    try {
      const commandOutput = execSync(command).toString();
      editor.edit(builder => {
        builder.replace(selection, commandOutput);
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
      }
      return;
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

