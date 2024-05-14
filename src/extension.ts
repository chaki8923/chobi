import * as vscode from "vscode";
import { execSync, exec } from "child_process";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let prettier = vscode.commands.registerCommand("chobi", () => {
    let editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
      return;
    }
    let selection = editor.selection;
    let selectedText = editor.document.getText(selection);

    let command =
      'echo "' +
      convertDoubleToSingleQuotes(selectedText) +
      '" > ~/.rbprettier.rb';
    try {
      execSync(command);
    } catch (error: unknown) {
      if (error instanceof Error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
      }
      return;
    }

    command =
      "cd ~ && prettier --plugin=@prettier/plugin-ruby ~/.rbprettier.rb";
    try {
      const commandOutput = execSync(command).toString();
      editor.edit((builder) => {
        builder.replace(selection, convertDoubleToDoubleQuotes(commandOutput));
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        vscode.window.showErrorMessage(`ChobiError👎: ${error.message}`);
      }
      return;
    }
  });

  let rspec = vscode.commands.registerCommand("chobispec", () => {
    let editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
      return;
    }
    const currentFilePath = editor.document.fileName;
    const currentFileName = path.basename(currentFilePath);
    const currentLineNumber = editor.selection.active.line + 1;
    const apiBasePath = "spec/controllers/";

    try {
      vscode.window.showInformationMessage("Please wating.....");
      // rspecコマンドを実行する
      exec(
        `docker exec ibjs_api bash -c "cd api && rspec ${apiBasePath}${currentFileName}:${currentLineNumber}"`, (error,stdout,stderr) => {
          if(!error){
            vscode.window.showInformationMessage(`"Test All Passed!!${stdout}"`);
          }else{
            vscode.window.showErrorMessage(`"Test failure => ${stdout}"`);
          }
        });
    } catch (error: unknown) {
      if (error instanceof Error) {
        vscode.window.showErrorMessage(`MochobiError👎: ${error.stack}`);
      }
    }
  });

  let controller_or_model_jump = vscode.commands.registerCommand("ojump", () => {
    let editor = vscode.window.activeTextEditor;

    if (editor === undefined) {
      return;
    }
    const currentFilePath = editor.document.fileName;
    const currentFileName = path.basename(currentFilePath);
    const jumpFileName = currentFileName.replace("_spec", "");
    let fileName = ""
    if(currentFileName.includes("controller")){
      fileName = `apps/api/app/controllers/${jumpFileName}`; // アクティブにしたいファイルの名前
    }else{
      fileName = `apps/api/app/models/${jumpFileName}`; // アクティブにしたいファイルの名前
    }

    const filePath = vscode.Uri.file(
      path.join(vscode.workspace.rootPath || "", fileName),
    );
    vscode.workspace.openTextDocument(filePath).then((document) => {
      vscode.window.showTextDocument(document);
    });
  });

  let spec_jump = vscode.commands.registerCommand("sjump", () => {
    let editor = vscode.window.activeTextEditor;

    if (editor === undefined) {
      return;
    }
    const currentFilePath = editor.document.fileName;
    const currentFileName = path.basename(currentFilePath);
    let jumpFileName
    if(currentFileName.includes("controller")){
      jumpFileName = currentFileName.replace(
        "controller.rb",
        "controller_spec.rb",
      );
    }else {
      jumpFileName = currentFileName.replace(
        ".rb",
        "_spec.rb",
      );
    }
    const fileName = `apps/api/spec/controllers/${jumpFileName}`; // アクティブにしたいファイルの名前

    const filePath = vscode.Uri.file(
      path.join(vscode.workspace.rootPath || "", fileName),
    );
    vscode.workspace.openTextDocument(filePath).then((document) => {
      vscode.window.showTextDocument(document);
    });
  });



  context.subscriptions.push(prettier, rspec, controller_or_model_jump, spec_jump);
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
