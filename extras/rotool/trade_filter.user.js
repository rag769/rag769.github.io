// ==UserScript==
// @name        露店取引情報フィルター
// @namespace   https://rag769.github.io/
// @description RO公式ツール アイテム検索の露店取引情報にカード・エンチャントのフィルタを追加
// @author      rag769
// @include     /^https://rotool.gungho.jp/item/\d/
// @version     2025-02-18
// @require     https://code.jquery.com/jquery-3.7.1.min.js
// @grant       none
// ==/UserScript==
(($) => {
    $(".card_flg:last").parent().after(`<select id="extras_ro_card_enchant_select" style="color:#666;margin-left:0.5em;padding: 0.4em 1em; border-radius: 20px;"><option value=""></option></select>`);
    const buildSelectOptions = () => {
        $("#extras_ro_card_enchant_select option").remove();
        $("#extras_ro_card_enchant_select").append($('<option>').val("none").text(""));
        const item_name = $(".conent-ttl").text();
        const options = new Set();
        $("#Normal_Coefficient > table > tbody > tr > td:first-child > div").each((i, el) => {
            if ($(el).text().indexOf(item_name) == -1) options.add($(el).text());
        });
        Array.from(options).sort((a,b)=>{
            a = String(a).replace("%","").split("+");
            b = String(b).replace("%","").split("+");
            if (a.length==1 || b.length==1 || a[0] != b[0]) {
                return a[0] < b[0]?-1:1;
            } else {
                return a[1]-b[1];
            }
        }).forEach((option) => {
            $("#extras_ro_card_enchant_select").append($('<option>').val(option).text(option));
        });
    }
    $(document).on("change", "#extras_ro_card_enchant_select", (event) => {
        const filter = $(event.target).val();
        const trades = []
        $("#Normal_Coefficient > table > tbody > tr").each((i, tr) => {
            if (filter != "none" && $("td:first-child > div", tr).text().indexOf(filter) < 0) {
                $(tr).hide();
            } else {
                $(tr).show();
                const td = $("td", tr);
                trades.push(parseInt($($("td", tr)[1]).text().replaceAll(",", "").replace("zeny", "")));
            }
        });
        $("#Noatun_Coefficient > table > tbody > tr").each((i, tr) => {
            if (filter != "none" && $("td:first-child > div", tr).text().indexOf(filter) < 0) {
                $(tr).hide();
            } else {
                $(tr).show();
            }
        });
        trades.sort((a, b) => a - b);
        const half = (trades.length % 2 ? trades.length - 1 : trades.length) / 2;
        $("#Normal_Coefficient_Summary .median_price .money").text(`${trades[half].toLocaleString()}zeny`);
        $("#Normal_Coefficient_Summary .min_price .money").text(`${trades[0].toLocaleString()}zeny`);
        $("#Normal_Coefficient_Summary .max_price .money").text(`${trades[trades.length - 1].toLocaleString()}zeny`);
        $("#Noatun_Coefficient_Summary .median_price .money").text(`${Math.ceil(trades[half]/1000).toLocaleString()}zeny`);
        $("#Noatun_Coefficient_Summary .min_price .money").text(`${Math.ceil(trades[0]/1000).toLocaleString()}zeny`);
        $("#Noatun_Coefficient_Summary .max_price .money").text(`${Math.ceil(trades[trades.length - 1]/1000).toLocaleString()}zeny`);
    });
    const rebuild = () => {
        if ($("#trade_log>*:first").length==0||$("#trade_log>*:first").data("loading")) {
            setTimeout(rebuild, 500);
            return;
        }
        buildSelectOptions();
    }
    $(".item_filter input[type=checkbox]").click(() => {
        $("#trade_log>*:first").data("loading", "loading");
        rebuild();
    });
    rebuild();
})(jQuery);
