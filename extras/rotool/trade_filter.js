$(function () {
    (() => {
        $(".card_flg:last").parent().after(`<select id="extras_ro_card_enchant_select" style="color:#666;margin-left:0.5em;padding: 0.4em 1em; border-radius: 20px;"><option value=""></option></select>`);
        const buildSelectOptions = () => {
            $("#extras_ro_card_enchant_select option").remove();
            $("#extras_ro_card_enchant_select").append($('<option>').val("none").text(""));
            const item_name = $(".conent-ttl").text();
            const options = new Set();
            $("#Normal_Coefficient > table > tbody > tr > td:first-child > div").each((i, el) => {
                if ($(el).text().indexOf(item_name) == -1) options.add($(el).text());
            });
            options.forEach((option) => {
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
            trades.sort((a, b) => a - b);
            half = (trades.length % 2 ? trades.length - 1 : trades.length) / 2;
            $(".median_price .money").text(`${trades[half].toLocaleString()}zeny`);
            $(".min_price .money").text(`${trades[0].toLocaleString()}zeny`);
            $(".max_price .money").text(`${trades[trades.length - 1].toLocaleString()}zeny`);
        });
        const rebuild = () => {
            if ($("#trade_log>*:first").data("loading")) {
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
    })();
});
