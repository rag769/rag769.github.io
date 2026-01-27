$(function () {
    (() => {
        if ($('#center_content').length > 0) return;
        const meta = `
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.14.1/themes/base/jquery-ui.css">
    <style>
        :root {
            --sidebar-width: 500px;
            --header-height: 60px;
            --footer-height: 85px;
        }
        .app {
            display: flex;
            flex-direction: column;
            background: #f7f8fa;
            min-height: calc(100vh - var(--footer-height, 85px) - var(--header-height, 60px));
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
            transition: width 0.3s ease, flex-basis 0.3s ease, opacity 0.3s ease;
            position: relative;
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
        <!-- <header class="titlebar">
            <div class="titlebar-side">
                <button class="title-btn" id="toggleLeft" type="button" aria-expanded="true"
                    aria-controls="leftSidebar">
                    <span class="icon">✕</span>
                </button>
            </div>
            <div class="titlebar-title">非公式ツール</div>
            <div class="titlebar-side right">
                <button class="title-btn" id="toggleRight" type="button" aria-expanded="false"
                    aria-controls="rightSidebar">
                    <span class="icon">≡</span>
                </button>
            </div>
        </header> -->
        <div class="container">
            <aside class="sidebar left-sidebar" id="leftSidebar" aria-hidden="false">
                <div class="sidebar-content search">
                    <div id="search_tabs">
                        <ul>
                            <li><a href="#name_tab">アイテム名</a></li>
                            <li><a href="#description_tab">アイテム説明文</a></li>
                        </ul>
                        <div id="name_tab"></div>
                        <div id="description_tab"></div>
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
                        <div id="favorite_tab">Not implemented</div>
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
        $.ready
        $.getScript("https://code.jquery.com/ui/1.14.1/jquery-ui.min.js", () => {
            $("#list_tabs").tabs();
            $("#search_tabs").tabs();
        });

        // 左カラム
        $(".item_name").removeClass("item_name");
        $(".item_description").removeClass("item_description");
        const clear_search_result = () => {
            $("#item_name").val("");
            $("#item_list_output").html("");
            $("#item_list_output2").empty();
        };
        $(".sidebar-content.search").prepend(`
<div class="search-form-box">
<p><input name="item" class="search_box item_name item_description" id="item_name" onkeydown="complementary_search(event,1);complementary_search_description(event, 1);" placeholder="キーワードを入力してください。" autocomplete="off" enterkeyhint="done"></p>
<p><input type="button" class="reset-btn" value="✕" onclick="clear_search_result();" /></p>
</div>
`);
        $("#item_list_output").parent().appendTo("#name_tab");
        $("#item_list_output2").parent().appendTo("#description_tab");
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
                $('.content-wrap.transaction-wrap').hide();
            });
        }, true);
    })();
});