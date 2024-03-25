import * as vscode from 'vscode';
import {exec} from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "hoge" is now active!');


  let disposable = vscode.commands.registerCommand('hoge.helloWorld', () => {

    let editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
      return;
    }
    let selection = editor.selection;
    let selectedText = editor.document.getText(selection);

    let command = 'echo "' + selectedText + '" > ~/.rbprettier.rb';
    exec(command, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            vscode.window.showErrorMessage(`Command stderr: ${stderr}`);
            return;
        }
    });


    command = 'prettier --plugin=@prettier/plugin-ruby ~/.rbprettier.rb';
    exec(command, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            vscode.window.showErrorMessage(`Command stderr: ${stderr}`);
            return;
        }

        const commandOutput: string = stdout;

        if (editor === undefined) {
          return;
        }
        editor.edit(builder => {
          builder.replace(selection, commandOutput);
        });
    });
  });


  context.subscriptions.push(disposable);
}

export function deactivate() {}
