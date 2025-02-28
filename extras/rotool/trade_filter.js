$(function () {
    (() => {
        if ($("#extras_ro_card_enchant_select_box").length>0) return;
        const scatter_data = {
            datasets: [{
                label: "",
                data: [],
            }]
        };
        let scatter = null;
        const card_keywords=["カード","アクエリアス","アリエス","ヴァルゴ","ヴァルゴの欠片","カプリコーン","キャンサー","サーペンタリウス","サジタリウス","ジェミニ","スコーピオ","タウロス","パイシーズ","リーブラ","レオ","レオの欠片","覇者の思念","魔神の幸運","魔神の集中","魔神の迅速","魔神の体力","魔神の知力","魔神の腕力"];
        const get_item_option = () => {
            const cards = new Set();
            const enchants = new Set();
            const item_name = $(".conent-ttl").text();
            $("#Normal_Coefficient > table > tbody > tr:not([style*='display: none']) > td:first-child > div").each((i, el) => {
                if ($(el).text().indexOf(item_name) == -1){
                    if (card_keywords.find((s) => {return $(el).text().indexOf(s)>=0})) {
                        cards.add($(el).text());
                    } else {
                        enchants.add($(el).text());
                    }
                }
            });
            const sort = (a,b)=> {
                a = String(a).replace("%","").split("+");
                b = String(b).replace("%","").split("+");
                if (a.length==1 || b.length==1 || a[0] != b[0]) {
                    return a[0] < b[0]?-1:1;
                } else {
                    return a[1]-b[1];
                }
            }
            return [Array.from(cards).sort(sort), Array.from(enchants).sort(sort)];
        }
        const buildSelectOptions = () => {
            let cards, enchants;
            [cards, enchants] = get_item_option();
            $("#extras_ro_card_enchant_select_box").remove();
            if (cards.length+enchants.length>0) {
                $(".card_flg:last").parent().after(`<div id="extras_ro_card_enchant_select_box"><h4>フィルタ</h4></div>`);
            }
            if (cards.length>0) {
                $("#extras_ro_card_enchant_select_box").append(`<select id="extras_ro_card_select" style="width:20em;color:#666;padding: 0.4em 1em; border-radius: 20px;border:1px solid;background:#fff"><option value="">カード指定なし</option><option value="nocard">カードなし</option></select>`);
                cards.forEach((t)=>{$("#extras_ro_card_select").append($('<option>').val(t).text(t))})
            }
            if (enchants.length>0) {
                $("#extras_ro_card_enchant_select_box").append(`<select id="extras_ro_enchant_select" style="width:20em;color:#666;margin-left:0.5em;padding: 0.4em 1em; border-radius: 20px;border:1px solid;background:#fff"><option value="">エンチャント指定なし</option></select>`);
                enchants.forEach((t)=>{$("#extras_ro_enchant_select").append($('<option>').val(t).text(t))})
            }
        }
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
                        card_hit = card_hit && !card_keywords.find((s) => {return $(div).text().indexOf(s)>=0})
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
                    const trade = {x:"", y:0};
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
                $("#Noatun_Coefficient_Summary .median_price .money").text(`${Math.ceil(trades[half]/1000).toLocaleString()}zeny`);
                $("#Noatun_Coefficient_Summary .min_price .money").text(`${Math.ceil(trades[0]/1000).toLocaleString()}zeny`);
                $("#Noatun_Coefficient_Summary .max_price .money").text(`${Math.ceil(trades[trades.length - 1]/1000).toLocaleString()}zeny`);
            } else {
                $("#Normal_Coefficient_Summary .median_price .money").text("N/A");
                $("#Normal_Coefficient_Summary .min_price .money").text("N/A");
                $("#Normal_Coefficient_Summary .max_price .money").text("N/A");
                $("#Noatun_Coefficient_Summary .median_price .money").text("N/A");
                $("#Noatun_Coefficient_Summary .min_price .money").text("N/A");
                $("#Noatun_Coefficient_Summary .max_price .money").text("N/A");
            }
            if(scatter) {
                scatter.data.datasets[0].data = scatter_trade_data;
                scatter.update();
            }
        }
        $(document).on("change", "#extras_ro_card_select,#extras_ro_enchant_select", filter_history);
        const rebuild = () => {
            if ($("#trade_log>*:first").length==0||$("#trade_log>*:first").data("loading")) {
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
    })();
});
