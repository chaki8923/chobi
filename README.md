![alt text](chobi.jpg)

<img src="https://img.shields.io/badge/TS-Typescript-007ACC.svg?logo=typescript&style=social">


# 環境構築

## prettierインストール

- npm install --global prettier @prettier/plugin-ruby
- gem install bundler prettier_print syntax_tree syntax_tree-haml syntax_tree-rbs

## 「.prettierrc.json」をホームディレクトリへ移動

- cp .prettierrc.json ~/

## 確認

- ホームディレクトリに適当なrbファイル作成 -「prettier --plugin=@prettier/plugin-ruby ファイル名」　を実行
- エラーなくフォーマットされているか確認できればOK

## 拡張機能をインストール

![alt text](<スクリーンショット 2024-03-28 16.34.27.png>)

-「VSIXからのインストール」を選択

![alt text](<スクリーンショット 2024-03-28 16.41.49.png>)

## 使用方法

- フォーマットしたい部分を選択

-「Shift」 + 「Command」 + 「P」でコマンドパレットを開く

- 「chobi」と打って出てきたコマンドを実行
![alt text](<スクリーンショット 2024-03-28 16.51.56.png>)

## License

[MIT](https://choosealicense.com/licenses/mit/)
