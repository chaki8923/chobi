# 環境構築
 ## prettierインストール
 - npm install --global prettier @prettier/plugin-ruby
 - gem install bundler prettier_print syntax_tree syntax_tree-haml syntax_tree-rbs

 ## 「.prettierrc.json」をホームディレクトリへ移動
 - cp .prettierrc.json ~/

 ## 確認
 - ホームディレクトリに適当なrbファイル作成
 - 「prettier --plugin=@prettier/plugin-ruby」 ファイル名　を実行
 - エラーなくフォーマットされているか確認できればOK