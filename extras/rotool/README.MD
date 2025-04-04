# RO非公式RO公式ツール拡張：露店取引情報フィルタ

露店取引情報にエンチャント・カードのフィルタ機能を付加します。(サンプル画像オレンジでマスク)  
グラフ表示をおまけで追加(サンプル画像グリーンでマスク)
![サンプル画像](ss.png)

### 2025－02－28 Update

フィルタをカードとエンチャで分離 (AND条件)

![サンプル画像](ff.png)

## Setup
* Greaseonkey・Tampermonkey UserScript (作者は Tampermonkey で確認)  
    * [フィルタのみ](https://rag769.github.io/extras/rotool/trade_filter.user.js)
    * [フィルタ＋グラフ](https://rag769.github.io/extras/rotool/trade_filter_scatter.user.js)

* DevToolでもアドレスバーでもどちらでも (ブラウザによっては全文コピペできません。Bookmarkletとしての利用を推奨)  
    フィルタのみ
    ```
    javascript:(function(){$.getScript("https://rag769.github.io/extras/rotool/trade_filter.min.js");})();
    ```
    フィルタ＋グラフ
    ```
    javascript:(function(){$.getScript("https://rag769.github.io/extras/rotool/trade_filter_scatter.min.js");})();
    ```

## How to use
※ XxxmonkeyのUserScriptをインストールしている場合は普通に無視してください ※

1. RO公式ツールでアイテム検索します

1. Setup のどちらかを実施します。  
    アイテム検索後のページでのみ有効です。リロード、別アイテム検索などした場合は再度実施してください。

## Notes

* この拡張を使って発生したいかなる損害に関しても責任は負いません。
* 「とりあえず動けばいい」の雑実装なので、多くを期待してはいけません。  
    不具合等は「しょうがないにゃあ」と大きな心で受け止めてください。
* この拡張適用後に不具合が発生しても、RO公式ツールへの問合せ等は行わないでください。
* れっつえんじょい

© Gravity Co., Ltd. & Lee MyoungJin(studio DTDS). All rights reserved.  
© GungHo Online Entertainment, Inc. All Rights Reserved.  
当コンテンツの再利用（再転載・配布など）は、禁止しています。
