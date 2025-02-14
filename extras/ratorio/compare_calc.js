$(function () {
  (() => {
    if ($("#compare_graph").length) {
      console.log("Already applied.")
      return;
    }
    $("#clip_modal").prepend(`
      <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.7/dist/loadingoverlay.min.js"></script>
      <style>
        .jquery-modal.blocker {
          z-index: 100 !important;
        }
        div.clip_compare_condition {
          display:flex;
          margin-top:2rem;
        }
        div.clip_compare_condition button {
          border-radius:5px;
          margin: 0 2px;
          width: 5rem;
        }
        div.clip_compare_select_area select {
          border-radius:5px;
          padding:2px;
          margin: 0 2px;
        }
      </style>
      <h3 id="clip_target_monster"></h3>
    `);
    $("#clip_modal_table").after(`
      <div class="clip_compare_condition">
        <button type="button" class="clip_compare">比較</button>
        <div class="clip_compare_select_area"></div>
      </div>
      <div id="compare_container">
        <canvas id="compare_graph" style="display:none"></canvas>
      </div>
    `);

    let radar_chart = null;
    $("#clip_modal").on("modal:before-open", () => {
      $("div.clip_compare_condition > button").prop("disabled", $("#clip_modal_table tbody tr").length < 2);
      $("div.clip_compare_select_area > select").remove();
      const attack_method = $("#OBJID_TD_ATTACK_METHOD_ROOT > table:nth-child(1) > tbody > tr > td:nth-child(1) > select").clone().removeAttr("id");
      attack_method.prepend("<option value='-1'></option>").val(-1);
      for (let i of Array(6)) {
        attack_method.clone().appendTo("div.clip_compare_select_area");
      }
    });
    $("#clip_modal").on("modal:before-close", () => {
      $("#compare_graph").css("display", "none");
    });
    $("div.clip_compare_condition > button").click((e) => {
      const chart = Chart.getChart("history_graph");
      $.LoadingOverlay("show", {fade: false});
      setTimeout(()=>{
        const current_url = CSaveController.encodeToURL();
        try{
          const labels = ["", "", "", "", "", ""];
          const data = {
            labels: labels,
            datasets: []
          };
          $("#clip_modal_table tbody tr").each((i) => {
            const metadata = chart.data.datasets[0].metadata[i];
            const d = {
              label: metadata["memo"] || ("CLIP-" + (parseInt(i) + 1)),
              data: [],
              metadata: [],
            }
            CSaveController.loadFromURL(metadata["url"]);
            CItemInfoManager.OnClickExtractSwitch();
            const attack_method = $("#OBJID_TD_ATTACK_METHOD_ROOT > table:nth-child(1) > tbody > tr > td:nth-child(1) > select");

            $("div.clip_compare_select_area select").each((j, e) => {
              const method_name = $("option:selected", e).text();
              const method_id = parseInt($(e).val());
              labels[j] = method_name;
              if (method_id >= 0 && $(`option[value=${method_id}]`,attack_method).length > 0) {
                attack_method.val(method_id).change();
                $("#OBJID_BUTTON_CALC").click();
                const dps = parseFloat($("#BTLRSLT_PART_ATKCNT").parent().prev().prev().prev().prev().text().replaceAll(",", ""))
                // 先頭データを基準とした比率とする
                if (i == 0) {
                  d.data.push(100);
                } else {
                  d.data.push((isNaN(dps) ? 0 : dps) / data.datasets[0].metadata[j]["memo"] * 100);
                }
                d.metadata.push({ memo: isNaN(dps) ? 0 : dps })
              } else {
                d.data.push(0);
                d.metadata.push({ memo: 0 })
              }
            });
            data.datasets.push(d);
          });
          if (radar_chart) {
            radar_chart.data = data;
            radar_chart.update();
          } else {
            radar_chart = new Chart(document.getElementById("compare_graph"), {
              type: 'radar',
              data: data,
              options: {
                responsive: true,
                scales: {
                  r: {
                    min: 0,
                  },
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      footer: (items)=>{
                        return items[0].dataset.metadata[items[0].dataIndex].memo;
                      },
                    }
                  },
                },
              },
            });
          }
          $("#compare_graph").css("display", "block");
        }finally{
          CSaveController.loadFromURL(current_url);
          CItemInfoManager.OnClickExtractSwitch();
          LoadSelect2();
          $.LoadingOverlay("hide");
        }
      },0);
    });
  })();
});
