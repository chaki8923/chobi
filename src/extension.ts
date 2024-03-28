import * as vscode from 'vscode';
import {execSync} from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('chobi', () => {

    let editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
      return;
    }
    let selection = editor.selection;
    let selectedText = editor.document.getText(selection);

    let command = 'echo "' + convertDoubleToSingleQuotes(selectedText) + '" > ~/.rbprettier.rb';
    try {
      execSync(command);
    } catch (error: unknown) {
      if (error instanceof Error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
      }
      return;
    }
    
    command = "cd ~ && prettier --plugin=@prettier/plugin-ruby ~/.rbprettier.rb"
    try {
        const commandOutput = execSync(command).toString();
      editor.edit(builder => {
        builder.replace(selection, convertDoubleToDoubleQuotes(commandOutput));
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        vscode.window.showErrorMessage(`ChobiError👎: ${error.message}`);
      }
      return;
    }
  });

  context.subscriptions.push(disposable);
}
function convertDoubleToSingleQuotes(input: string): string {
  // ダブルクオーテーションをシングルクオーテーションに置換する
  return input.replace(/"/g, "'");
}
function convertDoubleToDoubleQuotes(input: string): string {
  // 逆にね
  return input.replace(/'/g, '"');
}


export function deactivate() {}
