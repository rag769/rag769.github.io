# ROラトリオHub非公式拡張：レーダーチャート

計算履歴モーダルに比較機能を付加します。


## Requirements

ROラトリオHub 2025/02/05 20:00 版

それ以降のバージョンでもしばらくは動く。。。はず


## Setup

* DevToolでもアドレスバーでもどちらでも (ブラウザによっては全文コピペできません。Bookmarkletとしての利用を推奨) 

    ````
    javascript:(function(){$.getScript("https://rag769.github.io/extras/ratorio/compare_calc.min.js");})();
    ````

## How to use

1. ROラトリオHubを開いたウィンドウ・タブで Setup のどちらかを実施します。  
    ROラトリオHubを開いている限りは大丈夫ですが、ブラウザを閉じたりリロードした場合は再度実施してください。

1. ROラトリオHubで比較したい装備セットを設定し `Clip` します。 x N回  

1. `List` をクリックしてモーダル画面を表示します。

1. `比較` 横のセレクトボックスで比較したい攻撃方法を選択し、`比較` をクリックします。  
    _注) Clipが2つ以上ないと `比較` は有効になりません_

1. モーダル下部にレーダーチャート(DPS)が表示されます。  
    チャートは1番上の装備セットを100とした割合で表示します。実際のダメージ値は各点にカーソルを合わて確認してください。


## Notes

* この拡張を使って発生したいかなる損害に関しても責任は負いません。
* 「とりあえず動けばいい」の雑実装なので、多くを期待してはいけません。  
    不具合等は「しょうがないにゃあ」と大きな心で受け止めてください。
* ROラトリオHub様とは一切関係ありません。  
  この拡張適用後に計算機で不具合が発生しても、ROラトリオHub様への問合せ等は行わないでください。
* れっつえんじょい
