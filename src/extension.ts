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
        `docker exec ibjs_api bash -c "cd api && rspec ${apiBasePath}${currentFileName}:${currentLineNumber}"`,
        (error, stdout, stderr) => {
          const match = stdout.match(/(\d+) examples?, (\d+) failures?/);
          const examples = parseInt(match![1]);
          const failures = parseInt(match![2]);
          const success = examples - failures;
          if (!error) {
            vscode.window.showInformationMessage(`
            ALL PASSED🤩\n実行したテスト=>「 ${examples} 」|
             成功「 ${success} 」|
             失敗 「 ${failures} 」`);
          } else {
            const panel = vscode.window.createWebviewPanel(
              "testResults", // Identifies the type of the webview. Used internally
              "Test Results", // Title of the panel displayed to the user
              vscode.ViewColumn.One, // Editor column to show the new webview panel in.
              {}, // Webview options. More on these later.
            );
            panel.webview.html = getFailContent(
              stderr,
              examples,
              success,
              failures,
              currentFileName,
            );
            // vscode.window.showErrorMessage(
            //   `ぴえん🥲 実行したテスト=>「 ${examples} 」 | 成功「 ${success} 」| 失敗 「 ${failures} 」| メッセージ・・・・>${stdout}`,
            // );
          }
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        vscode.window.showErrorMessage(`MochobiError👎: ${error.stack}`);
      }
    }
  });

  let controller_or_model_jump = vscode.commands.registerCommand(
    "ojump",
    () => {
      let editor = vscode.window.activeTextEditor;

      if (editor === undefined) {
        return;
      }
      const currentFilePath = editor.document.fileName;
      const currentFileName = path.basename(currentFilePath);
      const jumpFileName = currentFileName.replace("_spec", "");
      let fileName = "";
      if (currentFileName.includes("controller")) {
        fileName = `apps/api/app/controllers/${jumpFileName}`; // アクティブにしたいファイルの名前
      } else {
        fileName = `apps/api/app/models/${jumpFileName}`; // アクティブにしたいファイルの名前
      }

      const filePath = vscode.Uri.file(
        path.join(vscode.workspace.rootPath || "", fileName),
      );
      vscode.workspace.openTextDocument(filePath).then((document) => {
        vscode.window.showTextDocument(document);
      });
    },
  );

  let spec_jump = vscode.commands.registerCommand("sjump", () => {
    let editor = vscode.window.activeTextEditor;

    if (editor === undefined) {
      return;
    }
    const currentFilePath = editor.document.fileName;
    const currentFileName = path.basename(currentFilePath);
    let jumpFileName;
    if (currentFileName.includes("controller")) {
      jumpFileName = currentFileName.replace(
        "controller.rb",
        "controller_spec.rb",
      );
    } else {
      jumpFileName = currentFileName.replace(".rb", "_spec.rb");
    }
    const fileName = `apps/api/spec/controllers/${jumpFileName}`; // アクティブにしたいファイルの名前

    const filePath = vscode.Uri.file(
      path.join(vscode.workspace.rootPath || "", fileName),
    );
    vscode.workspace.openTextDocument(filePath).then((document) => {
      vscode.window.showTextDocument(document);
    });
  });

  context.subscriptions.push(
    prettier,
    rspec,
    controller_or_model_jump,
    spec_jump,
  );
}
function convertDoubleToSingleQuotes(input: string): string {
  // ダブルクオーテーションをシングルクオーテーションに置換する
  return input.replace(/"/g, "'");
}
function convertDoubleToDoubleQuotes(input: string): string {
  // 逆にね
  return input.replace(/'/g, '"');
}

function getFailContent(
  message: string,
  examples: number,
  success: number,
  failures: number,
  filename: string,
) {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${filename}</title>
      </head>
      <body>
          <h1>ぴえん🥲</h1>
          <p>実行したテスト => 「 ${examples} 」</p>
          <p>成功 => 「 ${success} 」</p>
          <p>失敗 => 「 ${failures} 」</p>
          <p>メッセージ => 「 ${message} 」</p>
          <p>「cmd + w」で閉じる</p>
          <p>「command + shift + [ 」で左のタブに移動</p>
      </body>
      </html>
  `;
}

export function deactivate() {}
