// ==UserScript==
// @name        アイテム検索 Rebuild
// @namespace   https://rag769.github.io/
// @description RO公式ツール アイテム検索を画面遷移不要の3カラムに再構成
// @author      rag769
// @match       https://rotool.gungho.jp/item/
// @version     1.1.3
// @require     https://code.jquery.com/jquery-3.7.1.min.js
// @require     https://code.jquery.com/ui/1.14.1/jquery-ui.min.js
// @require     https://rotool.gungho.jp/js/itemdetial.js?ver=5.0.0
// @require     https://cdn.jsdelivr.net/npm/chart.js
// @require     https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns
// @grant       none
// ==/UserScript==
(($) => {
    if ($('#center_content').length > 0) return;
    $('.site-logo').parent().html(function (_, html) {
        return html.replace('公式ツール', '公式ツール [非公式拡張 v1.1.3]');
    });
    $("main").hide();
    const meta = `
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.14.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        :root {
            --sidebar-width: 450px;
            --header-height: 60px;
            --footer-height: 85px;
        }
        .app {
            display: flex;
            flex-direction: column;
            background: #f7f8fa;
            height: calc(100vh - var(--footer-height, 85px) - var(--header-height, 60px));
        }

        .titlebar-side {
            display: flex;
            align-items: center;
            min-width: 48px;
        }

        .titlebar-side.right {
            justify-content: flex-end;
        }

        .titlebar-title {
            font-weight: 600;
            letter-spacing: 0.2px;
            flex: 1;
            /* text-align: center; */
        }

        .title-btn {
            width: 32px;
            height: 32px;
            padding: 0;
            border-radius: 0;
            border: none;
            background: transparent;
            box-shadow: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            font-size: 14px;
            color: #374151;
        }

        .title-btn:hover {
            transform: translateY(-1px);
        }

        .title-btn:active {
            transform: translateY(0);
        }

        .title-btn:focus-visible {
            outline: 2px solid #6366f1;
            outline-offset: 2px;
        }

        .container {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        .sidebar {
            width: var(--sidebar-width, 450px);
            flex: 0 0 var(--sidebar-width, 450px);
            position: relative;
            overflow-y: auto;
        }

        .sidebar-content {
            padding: 24px;
            transition: opacity 0.2s ease;
        }

        .title-btn .icon {
            font-size: 18px;
            line-height: 1;
        }

        #center_content {
            flex: 1;
            /* 残りの幅をすべて使う */
            transition: all 0.3s ease;
            padding: 24px;
            box-shadow: inset 0 0 0 1px #e5e7eb;
            min-width: 0;
            overflow-y: auto;
        }

        /* 隠す時のクラス */
        .is-hidden {
            width: 0;
            flex-basis: 0;
            min-width: 0;
            max-height: 0;
            opacity: 0;
            overflow: auto;
        }

        .is-hidden .sidebar-content {
            opacity: 0;
            pointer-events: none;
        }

        header {
            height: var(--header-height, 60px) !important;
        }

        footer {
            height: var(--footer-height, 85px) !important;
        }
    </style>
    <script>
        $(document).ready(function () {
            function applySettings() {
                const settings = JSON.parse(localStorage.getItem('sidebarSettings')) || {};
                Object.entries(settings).forEach(([key, value]) => {
                    const $sidebar = $("#" + key.replace("_hidden", ""));
                    if (value) {
                        $sidebar.addClass('is-hidden');
                    } else {
                        $sidebar.removeClass('is-hidden');
                    }
                });
            }
            applySettings();

            function updateSidebarSettings($sidebar) {
                const settings = JSON.parse(localStorage.getItem('sidebarSettings')) || {};
                settings[$sidebar.attr('id')+"_hidden"] = $sidebar.hasClass('is-hidden');
                localStorage.setItem('sidebarSettings', JSON.stringify(settings));
            }

            function updateButton($sidebar, side, $btn) {
                const isHidden = $sidebar.hasClass('is-hidden');
                const $icon = $btn.find('.icon');

                $icon.text(isHidden ? '≡' : '✕');
                $btn.attr('aria-label', side === 'left'
                    ? (isHidden ? '左パネルを開く' : '左パネルを閉じる')
                    : (isHidden ? '右パネルを開く' : '右パネルを閉じる'));
                $btn.attr('aria-expanded', !isHidden);
                $sidebar.attr('aria-hidden', isHidden);
            }

            function toggleSidebar($sidebar, side, $btn) {
                $sidebar.toggleClass('is-hidden');
                updateButton($sidebar, side, $btn);
                updateSidebarSettings($sidebar);
            }

            const $leftSidebar = $('#leftSidebar');
            const $rightSidebar = $('#rightSidebar');
            const $leftBtn = $('#toggleLeft');
            const $rightBtn = $('#toggleRight');

            $leftBtn.click(function () {
                toggleSidebar($leftSidebar, 'left', $leftBtn);
            });

            $rightBtn.click(function () {
                toggleSidebar($rightSidebar, 'right', $rightBtn);
            });

            updateButton($leftSidebar, 'left', $leftBtn);
            updateButton($rightSidebar, 'right', $rightBtn);
        });
    </script>
<script>
//パラメーターを作る関数
function make_prameter(param,param_name,param_array){
    for ( i = 0; i < param_array.length; i++) {
        if ( param_array[i].checked === true ) {
            if(param){
                param += "&" + param_name + "[]=" + param_array[i].value;
            }else{
                param = "" + param_name + "[]=" + param_array[i].value;
            }
        }
    }
    return param;
}
//パラメータがある場合に取引履歴を上書きする関数
function over_wrrite_trade_log(trade_log,param){


    //アイテムグレードの設定の宣言
                        var Item_Grade_Level = {};
            Item_Grade_Level[0] = 'なし';
                                Item_Grade_Level[1] = '★1';
                                Item_Grade_Level[2] = '★2';
                                Item_Grade_Level[3] = '★3';
                                Item_Grade_Level[4] = '★4';
            
    
    //パラメーターが選択されいた場合
    if(param){
        // Ajaxリクエスト
        $.ajax({
        type: "GET",
        url: "/item_trade_log_filtered_search/?" + param,
        dataType : "json",
        cahe:false
        })
        // Ajaxリクエストが成功した場合
        .done(function(data){
            var html = "";
            if(data == "none" ){
                html = '<p class="alert_msg">露店取引情報が見つかりません。</p>';
                trade_log.innerHTML = html
                return;
            }
            //アイテムが見つかった場合の処理
            //通常価格
            html += '<div id="Normal_Coefficient" class="status-table">';
            html += '<table>';
            html += '<thead><tr><th>取引実績</th><th>価格(単価)</th><th>個数</th><th>日時</th><th>MAP</th></tr></thead>';
            for(var i=0; i<data.length; i++){
                html += '<tr><td>';
                if(data[i].GradeLevel>0){ html += '<div>超越段階　' + Item_Grade_Level[data[i].GradeLevel] + '</div>'; }
                if(data[i].refining_level>0){ html += '<div> + ' + data[i].refining_level + '　' + data[i].item_name + '</div>'; }
                else{ html += '<div>' + data[i].item_name + '</div>'; }
                if(data[i].card1){ html += '<div>' + data[i].card1 + '</div>'; }
                if(data[i].card2){ html += '<div>' + data[i].card2 + '</div>'; }
                if(data[i].card3){ html += '<div>' + data[i].card3 + '</div>'; }
                if(data[i].card4){ html += '<div>' + data[i].card4 + '</div>'; }
                if(data[i].RandOption1){ html += '<div>' + data[i].RandOption1 + '</div>'; }
                if(data[i].RandOption2){ html += '<div>' + data[i].RandOption2 + '</div>'; }
                if(data[i].RandOption3){ html += '<div>' + data[i].RandOption3 + '</div>'; }
                if(data[i].RandOption4){ html += '<div>' + data[i].RandOption4 + '</div>'; }
                if(data[i].RandOption5){ html += '<div>' + data[i].RandOption5 + '</div>'; }
                if(data[i].attribute_stone){ html += '<div>属性石　' + data[i].attribute_stone + '</div>'; }
                if(data[i].star_piece){ html += '<div>星のかけら　' + data[i].star_piece + '</div>'; }
                html += '</td>';
                html += '<td><div class="money">'+ Math.ceil(data[i].price / data[i].item_count).toLocaleString() + 'zeny</div></td>';
                html += '<td>' + data[i].item_count + '</td>';
                html += '<td>' + data[i].log_date.substring(0,16) + '</td>';
                html += '<td>' + data[i].mapname + '</td>';
                html += '</tr>';
            }
            html += '</table>';
            html += '</div>';
            //Noatun価格
            html += '<div id="Noatun_Coefficient" class="status-table">';
            html += '<table>';
            html += '<thead><tr><th>取引実績</th><th>価格(単価)</th><th>個数</th><th>日時</th><th>MAP</th></tr></thead>';
            for(var i=0; i<data.length; i++){
                html += '<tr><td>';
                if(data[i].GradeLevel>0){ html += '<div>超越段階　' + Item_Grade_Level[data[i].GradeLevel] + '</div>'; }
                if(data[i].refining_level>0){ html += '<div> + ' + data[i].refining_level + '　' + data[i].item_name + '</div>'; }
                else{ html += '<div>' + data[i].item_name + '</div>'; }
                if(data[i].card1){ html += '<div>' + data[i].card1 + '</div>'; }
                if(data[i].card2){ html += '<div>' + data[i].card2 + '</div>'; }
                if(data[i].card3){ html += '<div>' + data[i].card3 + '</div>'; }
                if(data[i].card4){ html += '<div>' + data[i].card4 + '</div>'; }
                if(data[i].RandOption1){ html += '<div>' + data[i].RandOption1 + '</div>'; }
                if(data[i].RandOption2){ html += '<div>' + data[i].RandOption2 + '</div>'; }
                if(data[i].RandOption3){ html += '<div>' + data[i].RandOption3 + '</div>'; }
                if(data[i].RandOption4){ html += '<div>' + data[i].RandOption4 + '</div>'; }
                if(data[i].RandOption5){ html += '<div>' + data[i].RandOption5 + '</div>'; }
                if(data[i].attribute_stone){ html += '<div>属性石　' + data[i].attribute_stone + '</div>'; }
                if(data[i].star_piece){ html += '<div>星のかけら　' + data[i].star_piece + '</div>'; }
                html += '</td>';
                //単価が0円未満の場合unavaliableを表示する
                if(data[i].price / data[i].item_count / 1000>1){
                    html += '<td><div class="money">'+ Math.ceil(data[i].price / data[i].item_count / 1000).toLocaleString() + 'zeny</div></td>';
                }else{
                    html += '<td><div class="money">unavaliable</div></td>';
                }
                html += '<td>' + data[i].item_count + '</td>';
                html += '<td>' + data[i].log_date.substring(0,16) + '</td>';
                html += '<td>' + data[i].mapname + '</td>';
                html += '</tr>';
            }
            html += '</table>';
            html += '</div>';

            trade_log.innerHTML = html
        })
        // Ajaxリクエストが失敗した場合
        .fail(function(XMLHttpRequest, textStatus, errorThrown){
            var html = '<p class="alert_msg">通信に失敗しました。時間をおいてお試しください。</p>';
            trade_log.innerHTML = html
        });
    //1度でもパラメーター選択後に条件が指定されていなかった場合
    }else{
        html = '<p class="alert_msg">条件が指定されていません。</p>';
            trade_log.innerHTML = html
            return;
    }
}
//パラメータがある場合に取引サマリーを上書きする関数
function over_wrrite_trade_log_summary(trade_log_summary,param){
    //パラメーターが選択されいた場合
    if(param){
        // Ajaxリクエスト
        $.ajax({
        type: "GET",
        url: "/item_trade_log_summary_filtered_search/?" + param,
        dataType : "json"
        })
        // Ajaxリクエストが成功した場合
        .done(function(data){
            var html = "";
            if(data == "none" ){
                //UI的におかしいので何も出力させない
                html = '';
                trade_log_summary.innerHTML = html
                return;
            }
            //アイテムが見つかった場合の処理
            //通常価格
            html += '<div id="Normal_Coefficient_Summary" class="transaction-summary">';
            html += '<h4>取引概要</h4>';
            html += '<div class="summary_price">';
            html += '<div class="median_price">';
            html += '<p class="summary_price_label">中央値</p>';
            html += '<p class="money">'+ Math.ceil(data.median).toLocaleString() + 'zeny</p>';
            html += '</div>';
            html += '<div class="min_price">';
            html += '<p class="summary_price_label">最低値</p>';
            html += '<p class="money">'+ Math.ceil(data.min).toLocaleString() + 'zeny</p>';
            html += '</div>';
            html += '<div class="max_price">';
            html += '<p class="summary_price_label">最高値</p>';
            html += '<p class="money">'+ Math.ceil(data.max).toLocaleString() + 'zeny</p>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            //Noatun価格
            html += '<div id="Noatun_Coefficient_Summary" class="transaction-summary">';
            html += '<h4>取引概要(Noatun価格)</h4>';
            html += '<div class="summary_price">';
            html += '<div class="median_price">';
            html += '<p class="summary_price_label">中央値</p>';
            //単価が0円未満の場合unavaliableを表示する
            if(data.median / 1000>1){
                html += '<p class="money">'+ Math.ceil(data.median / 1000).toLocaleString() + 'zeny</p>';
            }else{
                html += '<p class="money">unavaliable</p>';
            }
            html += '</div>';
            html += '<div class="min_price">';
            html += '<p class="summary_price_label">最低値</p>';
            //単価が0円未満の場合unavaliableを表示する
            if(data.min / 1000>1){
                html += '<p class="money">'+ Math.ceil(data.min / 1000).toLocaleString() + 'zeny</p>';
            }else{
                html += '<p class="money">unavaliable</p>';
            }
            html += '</div>';
            html += '<div class="max_price">';
            html += '<p class="summary_price_label">最高値</p>';
            //単価が0円未満の場合unavaliableを表示する
            if(data.max / 1000>1){
                html += '<p class="money">'+ Math.ceil(data.max / 1000).toLocaleString() + 'zeny</p>';
            }else{
                html += '<p class="money">unavaliable</p>';
            }
            html += '</div>';
            html += '</div>';
            html += '</div>';

            trade_log_summary.innerHTML = html
        })
        // Ajaxリクエストが失敗した場合
        .fail(function(XMLHttpRequest, textStatus, errorThrown){
            var html = '<p class="alert_msg">通信に失敗しました。時間をおいてお試しください。</p>';
            trade_log_summary.innerHTML = html
        });
    //1度でもパラメーター選択後に条件が指定されていなかった場合
    }else{
        //UI的におかしいので何も出力させない
        html = '';
        trade_log_summary.innerHTML = html
        return;
    }
}

/*
 *アイテム
*/
function parameter_search(item_id,make_flag=0){
    //出力先を代入する
    let trade_log = document.getElementById('trade_log')
    let trade_log_summary = document.getElementById('trade_log_summary')

    //パラメーターを取得する
    var refining_level = document.getElementsByClassName('refining_level');
    var card_flg = document.getElementsByClassName('card_flg');
    var grade_level = document.getElementsByClassName('grade_level');

    //必ず毎回初期化する
    if (!item_id){
        item_id = $("#center_content h1.conent-ttl").data('id');
    }
    if (!make_flag){
        make_flag = $("#center_content h1.conent-ttl").data('make_flag');
    }
    var param = "item_id=" + item_id + "&make_flag=" + make_flag;
    //モンスターサイズのパラメター作成
    param = make_prameter(param,'refining_level',refining_level);
    param = make_prameter(param,'card_flg',card_flg);
    param = make_prameter(param,'grade_level',grade_level);


    //アイテムの取引履歴
    over_wrrite_trade_log(trade_log,param);
    over_wrrite_trade_log_summary(trade_log_summary,param);
};
</script>
`;
    const titlebar_side_left = `
            <div class="titlebar-side">
                <button class="title-btn" id="toggleLeft" type="button" aria-expanded="true"
                    aria-controls="leftSidebar">
                    <span class="icon">✕</span>
                </button>
            </div>
`;
    const titlebar_side_right = `
            <div class="titlebar-side right">
                <button class="title-btn" id="toggleRight" type="button" aria-expanded="false"
                    aria-controls="rightSidebar">
                    <span class="icon">≡</span>
                </button>
            </div>
`;
    const contents = `
    <div class="app">
        <div class="container">
            <aside class="sidebar left-sidebar" id="leftSidebar" aria-hidden="false">
                <div class="sidebar-content search">
                    <div id="search_tabs">
                        <ul>
                            <li><a href="#name_tab">アイテム名</a></li>
                            <li><a href="#description_tab">アイテム説明文</a></li>
                            <li><a href="#costume_tab">衣装</a></li>
                        </ul>
                        <div id="name_tab"></div>
                        <div id="description_tab"></div>
                        <div id="costume_tab">
                            <div class="result-list result-list_2columns">
                                <ul id="costume_list_output">
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
            <main id="center_content">
                
            </main>
            <aside class="sidebar right-sidebar is-hidden" id="rightSidebar" aria-hidden="true">
                <div class="sidebar-content list">
                    <div id="list_tabs">
                        <ul>
                            <li><a href="#history_tab">検索履歴</a></li>
                            <li><a href="#featured_tab">注目アイテム</a></li>
                            <li><a href="#favorite_tab">お気に入り</a></li>
                        </ul>
                        <div id="history_tab"></div>
                        <div id="featured_tab"></div>
                        <div id="favorite_tab">
                            <section class="content-wrap">
                                <h3 class="section-ttl_mini">お気に入り</h3>
                                <div class="result-list">
                                    <ul id="favorite-list">
                                    </ul>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
`
    $("header").css("display", "flex").css("margin-bottom", 0);
    $(".header-inner").css("flex", "1").css("justify-content", "center");
    $("header").prepend(titlebar_side_left).append(titlebar_side_right);
    $("article").hide();
    $("head").append(meta);
    $("main").append(contents);

    // 右カラム
    // 検索履歴と注目アイテムを右サイドバーへ送ってタブ可
    $(".two-column-container section.content-wrap").slice(0, 1).appendTo("#featured_tab");
    $(".two-column-container section.content-wrap").slice(0, 1).appendTo("#history_tab");
    $("#list_tabs").tabs();
    $("#search_tabs").tabs();
    const settings = JSON.parse(localStorage.getItem("tabSettings")) || {};
    $("#list_tabs").tabs("option", "active", settings["list_tabs"] || 0);
    $("#search_tabs").tabs("option", "active", settings["search_tabs"] || 0);
    $("#list_tabs,#search_tabs").on("tabsactivate", function (_, ui) {
        const settings = JSON.parse(localStorage.getItem("tabSettings")) || {};
        settings[$(this).attr("id")] = $(this).tabs("option", "active");
        localStorage.setItem("tabSettings", JSON.stringify(settings));
    });

    // 左カラム
    $(".item_name").removeClass("item_name");
    $(".item_description").removeClass("item_description");
    $(".sidebar-content.search").prepend(`
<div class="search-form-box">
<p><input name="item" class="search_box item_name item_description" id="item_name" placeholder="キーワードを入力してください。" autocomplete="off" enterkeyhint="done"></p>
<p><input type="button" class="reset-btn" value="✕" /></p>
</div>
`);
    $(document).on("click", ".reset-btn", function () {
        $(".search_box.item_name.item_description").val("");
        $("#item_list_output").empty();
        $("#item_list_output2").empty();
        $("#costume_list_output").empty();
    });

    function make_costume_prameter(param) {
        if (param) {
            param += "&costume=1";
        } else {
            param = "costume=1";
        }
        return param;
    }
    function make_text_prameter(param, param_name, param_array) {
        if (param_array[0].value) {
            if (param) {
                param += "&" + param_name + "=" + param_array[0].value;
            } else {
                param = "" + param_name + "=" + param_array[0].value;
            }
        }
        return param;
    }
    function complementary_search(event, flg = false) {
        if (event.keyCode !== 13 && flg == 1) { return; }
        let item_list = document.getElementById('item_list_output');
        let costume_list = document.getElementById('costume_list_output');
        var name_text = document.getElementsByClassName('item_name');
        var param = '';
        param = make_text_prameter(param, 'item_name', name_text);
        param = make_costume_prameter(param);

        if (param) {
            $.ajax({
                type: "GET",
                url: "/item/prediction_conversion_search_name/?" + param,
                dataType: "json",
                cache: false
            })
                .done(function (data) {
                    var html = "";
                    var costume_html = "";
                    if (data == "none") {
                        html += '<li class="alert_msg">ご指定のキーワードではアイテムが見つかりませんでした。</li>';
                        item_list.innerHTML = html
                        if ($(costume_list).children(".search_result").length == 0) {
                            costume_list.innerHTML = html;
                        }
                        return;
                    }
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].item_name.startsWith("[衣装]")) {
                            $(costume_list).children(".alert_msg").remove();
                            $(costume_list).append('<li class="search_result"><span class="icon-item"><img src="/images/item_icon/' + data[i].item_icon + '.png"></span><a href="' + data[i].item_id + '/' + data[i].make_flag + '/" class="history-link" data-id="' + data[i].item_id + '" data-name="' + data[i].item_name + '" data-make_flag="' + data[i].make_flag + '" data-icon="' + data[i].item_icon + '" >' + data[i].item_name + '</a></li>');
                        } else {
                            html += '<li class="search_result"><span class="icon-item"><img src="/images/item_icon/' + data[i].item_icon + '.png"></span><a href="' + data[i].item_id + '/' + data[i].make_flag + '/" class="history-link" data-id="' + data[i].item_id + '" data-name="' + data[i].item_name + '" data-make_flag="' + data[i].make_flag + '" data-icon="' + data[i].item_icon + '" >' + data[i].item_name + '</a></li>';
                        }
                    }
                    item_list.innerHTML = html ? html : '<li class="alert_msg">ご指定のキーワードでは通常アイテムが見つかりませんでした。</li>';
                    if ($(costume_list).children(".search_result").length == 0) {
                        costume_list.innerHTML = '<li class="alert_msg">ご指定のキーワードでは衣装アイテムが見つかりませんでした。</li>';
                    }
                })
                .fail(function (XMLHttpRequest, textStatus, errorThrown) {
                    var html = '<p class="alert_msg">通信に失敗しました。時間をおいてお試しください。</p>';
                    item_list.innerHTML = html;
                    costume_list.innerHTML = html;
                });
        }
    };
    function complementary_search_description(event, flg = false) {
        if (event.keyCode !== 13 && flg == 1) { return; }

        let description_text = document.getElementsByClassName('item_description');
        let item_list = document.getElementById('item_list_output2');
        let costume_list = document.getElementById('costume_list_output');

        var param = '';
        param = make_text_prameter(param, 'item_description', description_text);
        if (param) {
            param = param.replace('%', '-パーセント-')
            param = param.replace('％', '-パーセント-')
            param = param.replace('+', '-プラス-')
            param = param.replace('＋', '-プラス-')
            param = param.replace('[', '［')
            param = param.replace(']', '］')
        }
        param = make_costume_prameter(param);

        if (param) {
            $.ajax({
                type: "GET",
                url: "/item/prediction_conversion_search_description/?" + param,
                dataType: "json"
            })
                .done(function (data) {
                    var html = "";
                    var costume_html = "";
                    if (data == "none") {
                        html += '<li class="alert_msg">ご指定のキーワードではアイテムが見つかりませんでした。</li>';
                        item_list.innerHTML = html;
                        if ($(costume_list).children(".search_result").length == 0) {
                            costume_list.innerHTML = html;
                        }
                        return;
                    }
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].item_name.startsWith("[衣装]")) {
                            $(costume_list).children(".alert_msg").remove();
                            $(costume_list).append('<li class="search_result"><span class="icon-item"><img src="/images/item_icon/' + data[i].item_icon + '.png"></span><a href="' + data[i].item_id + '/' + data[i].make_flag + '/" class="history-link" data-id="' + data[i].item_id + '" data-name="' + data[i].item_name + '" data-make_flag="' + data[i].make_flag + '" data-icon="' + data[i].item_icon + '" >' + data[i].item_name + '</a></li>');
                        } else {
                            html += '<li class="search_result"><span class="icon-item"><img src="/images/item_icon/' + data[i].item_icon + '.png"></span><a href="' + data[i].item_id + '/' + data[i].make_flag + '/" class="history-link" data-id="' + data[i].item_id + '" data-name="' + data[i].item_name + '" data-make_flag="' + data[i].make_flag + '" data-icon="' + data[i].item_icon + '" >' + data[i].item_name + '</a> ' + data[i].description_search + '</li>';
                        }
                    }
                    item_list.innerHTML = html ? html : '<li class="alert_msg">ご指定のキーワードでは通常アイテムが見つかりませんでした。</li>';
                    if ($(costume_list).children(".search_result").length == 0) {
                        costume_list.innerHTML = '<li class="alert_msg">ご指定のキーワードでは衣装アイテムが見つかりませんでした。</li>';
                    }
                })
                // Ajaxリクエストが失敗した場合
                .fail(function (XMLHttpRequest, textStatus, errorThrown) {
                    var html = '<p class="alert_msg">通信に失敗しました。時間をおいてお試しください。</p>';
                    item_list.innerHTML = html;
                    costume_list.innerHTML = html;
                });
        }
    };

    $(document).on("keydown", "#item_name", function (e) {
        if (e.keyCode == 13) {
            $('#costume_list_output').empty();
        }
        complementary_search(e, 1);
        complementary_search_description(e, 1);
    });
    $("#item_list_output").parent().appendTo("#name_tab");
    $("#item_list_output2").parent().appendTo("#description_tab");
    const visualize_trade_log = () => {
        if ($("#extras_ro_card_enchant_select_box").length > 0) return;
        const scatter_data = {
            datasets: [{
                label: "",
                data: [],
            }]
        };
        let scatter = null;
        $("#trade_log").before(`<canvas id="trade_scatter"></canvas>`);
        scatter = new Chart(document.getElementById('trade_scatter').getContext('2d'), {
            type: 'scatter',
            data: scatter_data,
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            tooltipFormat: 'yyyy-MM-dd HH:mm',
                            displayFormats: {
                                day: 'yyyy-MM-dd'
                            }
                        },
                        title: {
                            display: true,
                            text: '日時'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '単価'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                }
            },
        });
        const filter_history = () => {
            const card_filter = $("#extras_ro_card_select").val() || "";
            const enchant_filter = $("#extras_ro_enchant_select").val() || "";
            const trades = [];
            const scatter_trade_data = []
            $("#Normal_Coefficient > table > tbody > tr").each((i, tr) => {
                let card_hit = card_filter == "nocard";
                let enchant_hit = false;
                $("td:first-child > div", tr).each((j, div) => {
                    if (card_filter == "nocard") {
                        card_hit = card_hit && !card_keywords.find((s) => { return $(div).text().indexOf(s) >= 0 })
                    } else {
                        card_hit = card_hit || ($(div).text().indexOf(card_filter) >= 0);
                    }
                    enchant_hit = enchant_hit || ($(div).text().indexOf(enchant_filter) >= 0);
                });
                if (card_hit && enchant_hit) {
                    $(tr).show();
                    $($("#Noatun_Coefficient > table > tbody > tr")[i]).show();
                    const td = $("td", tr);
                    trades.push(parseInt($($("td", tr)[1]).text().replaceAll(",", "").replace("zeny", "")));
                    const trade = { x: "", y: 0 };
                    trade.y = parseInt($($("td", tr)[1]).text().replaceAll(",", "").replace("zeny", ""))
                    trade.x = new Date($($("td", tr)[3]).text().replace(" ", "T"));
                    scatter_trade_data.push(trade);
                } else {
                    $(tr).hide();
                    $($("#Noatun_Coefficient > table > tbody > tr")[i]).hide();
                }
            });
            if (trades.length) {
                trades.sort((a, b) => a - b);
                const half = (trades.length % 2 ? trades.length - 1 : trades.length) / 2;
                $("#Normal_Coefficient_Summary .median_price .money").text(`${trades[half].toLocaleString()}zeny`);
                $("#Normal_Coefficient_Summary .min_price .money").text(`${trades[0].toLocaleString()}zeny`);
                $("#Normal_Coefficient_Summary .max_price .money").text(`${trades[trades.length - 1].toLocaleString()}zeny`);
                $("#Noatun_Coefficient_Summary .median_price .money").text(`${Math.ceil(trades[half] / 1000).toLocaleString()}zeny`);
                $("#Noatun_Coefficient_Summary .min_price .money").text(`${Math.ceil(trades[0] / 1000).toLocaleString()}zeny`);
                $("#Noatun_Coefficient_Summary .max_price .money").text(`${Math.ceil(trades[trades.length - 1] / 1000).toLocaleString()}zeny`);
            } else {
                $("#Normal_Coefficient_Summary .median_price .money").text("N/A");
                $("#Normal_Coefficient_Summary .min_price .money").text("N/A");
                $("#Normal_Coefficient_Summary .max_price .money").text("N/A");
                $("#Noatun_Coefficient_Summary .median_price .money").text("N/A");
                $("#Noatun_Coefficient_Summary .min_price .money").text("N/A");
                $("#Noatun_Coefficient_Summary .max_price .money").text("N/A");
            }
            if (scatter) {
                scatter.data.datasets[0].data = scatter_trade_data;
                scatter.update();
            }
        }
        filter_history();
        const card_keywords = ["カード", "アクエリアス", "アリエス", "ヴァルゴ", "ヴァルゴの欠片", "カプリコーン", "キャンサー", "サーペンタリウス", "サジタリウス", "ジェミニ", "スコーピオ", "タウロス", "パイシーズ", "リーブラ", "レオ", "レオの欠片", "覇者の思念", "魔神の幸運", "魔神の集中", "魔神の迅速", "魔神の体力", "魔神の知力", "魔神の腕力"];
        const get_item_option = () => {
            const cards = new Set();
            const enchants = new Set();
            const item_name = $("#center_content .conent-ttl").text();
            $("#Normal_Coefficient > table > tbody > tr:not([style*='display: none']) > td:first-child > div").each((i, el) => {
                if ($(el).text().indexOf(item_name) == -1) {
                    if (card_keywords.find((s) => { return $(el).text().indexOf(s) >= 0 })) {
                        cards.add($(el).text());
                    } else {
                        enchants.add($(el).text());
                    }
                }
            });
            const sort = (a, b) => {
                a = String(a).replace("%", "").split("+");
                b = String(b).replace("%", "").split("+");
                if (a.length == 1 || b.length == 1 || a[0] != b[0]) {
                    return a[0] < b[0] ? -1 : 1;
                } else {
                    return a[1] - b[1];
                }
            }
            return [Array.from(cards).sort(sort), Array.from(enchants).sort(sort)];
        }
        const buildSelectOptions = () => {
            let cards, enchants;
            [cards, enchants] = get_item_option();
            $("#extras_ro_card_enchant_select_box").remove();
            if (cards.length + enchants.length > 0) {
                $(".card_flg:last").parent().after(`<div id="extras_ro_card_enchant_select_box"><h4>フィルタ</h4></div>`);
            }
            if (cards.length > 0) {
                $("#extras_ro_card_enchant_select_box").append(`<select id="extras_ro_card_select" style="width:20em;color:#666;padding: 0.4em 1em; border-radius: 20px;border:1px solid;background:#fff"><option value="">カード指定なし</option><option value="nocard">カードなし</option></select>`);
                cards.forEach((t) => { $("#extras_ro_card_select").append($('<option>').val(t).text(t)) })
            }
            if (enchants.length > 0) {
                $("#extras_ro_card_enchant_select_box").append(`<select id="extras_ro_enchant_select" style="width:20em;color:#666;margin-left:0.5em;padding: 0.4em 1em; border-radius: 20px;border:1px solid;background:#fff"><option value="">エンチャント指定なし</option></select>`);
                enchants.forEach((t) => { $("#extras_ro_enchant_select").append($('<option>').val(t).text(t)) })
            }
        }
        $(document).on("change", "#extras_ro_card_select,#extras_ro_enchant_select", filter_history);
        const rebuild = () => {
            if ($("#trade_log>*:first").length == 0 || $("#trade_log>*:first").data("loading")) {
                setTimeout(rebuild, 100);
                return;
            }
            buildSelectOptions();
            filter_history();
        }
        $(".item_filter input[type=checkbox]").click(() => {
            $("#trade_log>*:first").data("loading", "loading");
            rebuild();
        });
        rebuild();
    };
    document.addEventListener('click', (event) => {
        const link = event.target.closest('.history-link');
        if (!link) {
            return;
        }
        if (event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }
        if (event.button === 1) return;
        saveLinkHistory(link);
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        $.get(link.href, function (data) {
            const article = $(data).find('article');
            $('#center_content').html(article);
            display_none('item-drop-monster-list');
            display_none('item-drop-map-list');
            parameter_search(link.dataset.id, link.dataset.make_flag);
            const $title = $('#center_content h1.conent-ttl');
            Object.entries(link.dataset).forEach(([key, val]) => $title.data(key, val));
            $("#center_content .parameter-control .btn").removeAttr("onclick").off("click");
            $("#center_content .parameter-control .btn:first").on("click", function () {
                display_change('Normal_Coefficient','Normal_Coefficient_Summary','Noatun_Coefficient','Noatun_Coefficient_Summary');
            });
            $("#center_content .parameter-control .btn:last").on("click", function () {
                display_change('Noatun_Coefficient','Noatun_Coefficient_Summary','Normal_Coefficient','Normal_Coefficient_Summary');
            });
            if (existsInFavorite($title.data('name'))) {
                $('#center_content h1.conent-ttl').append('<i class="fav-icon fas fa-star" style="cursor:pointer; margin-left:10px; color: #f1c40f"></i>');
            } else {
                $('#center_content h1.conent-ttl').append('<i class="fav-icon far fa-star" style="cursor:pointer; margin-left:10px;"></i>');
            }
            visualize_trade_log();
        });
    }, true);
    //----------------------------------------------------------
    // お気に入り機能
    //----------------------------------------------------------
    const FAVO_KEY = 'item_favorite';
    function loadFavorite() {
        try {
            const rawFavorite = localStorage.getItem(FAVO_KEY);
            if (rawFavorite) {
                const favorite = JSON.parse(rawFavorite);
                if (Array.isArray(favorite)) {
                    return favorite;
                }
            }
        } catch (e) { /* fail silent */ }
        return [];
    }
    function displayFavorite() {
        let item_list = document.getElementById('favorite-list');
        const favorite = loadFavorite(); // オブジェクトの配列を取得

        var html = "";

        favorite.forEach(item => {
            // item と item.name が存在するかチェック
            if (item && item.item_name) {
                html += '<li><span class="icon-item"><img src="/images/item_icon/' + item.item_icon + '.png"></span><a href="' + item.item_id + '/' + item.make_flag + '/" class="history-link" data-id="' + item.item_id + '" data-name="' + item.item_name + '" data-make_flag="' + item.make_flag + '" data-icon="' + item.item_icon + '" >' + item.item_name + '</a></li>';
            }
        });
        item_list.innerHTML = html;
    }
    displayFavorite();
    function existsInFavorite(itemName) {
        const favorite = loadFavorite();
        return favorite.some(item => item.item_name === itemName);
    }
    function saveFavorite(itemObject, add = true) {
        if (!itemObject || !itemObject.item_name) return; // 項目名がなければ何もしない
        try {
            let favorite = loadFavorite();
            favorite = favorite.filter(item => item.item_name !== itemObject.item_name);
            if (add) {
                favorite.push(itemObject);
            }
            localStorage.setItem(FAVO_KEY, JSON.stringify(favorite));
        } catch (e) {
            console.error('お気に入りの保存に失敗しました。', e);
        }
    }

    $(document).on('click', '.fav-icon', function () {
        $(this).toggleClass('fas fa-star'); // 塗りつぶしアイコン
        $(this).toggleClass('far fa-star'); // 枠線アイコン
        const $title = $('#center_content h1.conent-ttl')
        const itemObject = {
            item_name: $title.data('name').replace(/</g, '＜').replace(/>/g, '＞'),
            item_id: $title.data('id'),
            make_flag: $title.data('make_flag'),
            item_icon: $title.data('icon')
        };
        if ($(this).hasClass('fas')) {
            saveFavorite(itemObject, true);
            $(this).css('color', '#f1c40f');
        } else {
            saveFavorite(itemObject, false);
            $(this).css('color', '#ccc');
        }
        displayFavorite();
    });
    $("main").show();
})(jQuery);
