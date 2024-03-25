import * as vscode from 'vscode';
import {exec} from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "hoge" is now active!');

  let disposable = vscode.commands.registerCommand('hoge.helloWorld', () => {

    let command = 'ls -l';
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


    command = 'ls -l';
    exec(command, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            vscode.window.showErrorMessage(`Command stderr: ${stderr}`);
            return;
        }

        // コマンドの結果を変数に格納する
        const commandOutput: string = stdout;

        let editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
          return;
        }


        let selection = editor.selection;
        editor.edit(builder => {
          builder.replace(selection, commandOutput);
        });
    });
  });


  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
