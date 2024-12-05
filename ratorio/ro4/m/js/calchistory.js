$(function () {
  const buildForm = () => {
    $("#OBJID_ATTACK_SETTING_BLOCK_MIG").after(`
<div style="margin-left:1em;width:4em">
<input type="button" id="history_clip" value="Clip" style="width:100%"><br>
<label style="font-size:x-small;white-space: nowrap;"><input type="checkbox" id="clip_with_memo">memo</label>
<input type="button" id="history_list" value="List" style="margin-top:0.5em;width:100%;font-size:x-small;">
<input type="button" id="history_reset" value="Reset" style="margin-top:1.5em;width:100%">
</div>
<div id="history_container" style="margin-left:1em;padding:0px 5px;height:7em;width:40em">
  <canvas id="history_graph"></canvas>
</div>
<style>
.jquery-modal.blocker {
  z-index: 100 !important;
}
#clip_modal {
  min-width: 800px;
}
#clip_modal_table {
  width: 100%;
  border-collapse: collapse;
}
#clip_modal_table tr{
  border-bottom: 1px solid lightgray;
}
.col {
  width: 7rem;
  text-align: right;
  padding-right: 1rem;
}
.col.target {
  width: 1rem;
}
.col.no {
  width: 1rem;
}
.col.memo {
  width: unset;
  text-align: left;
  padding: unset;
}
.col.action {
  width: 4.5rem;
  padding-right: unset;
}
.clip_memo {
  width: 100%;
}
div.clip_memo {
  cursor: pointer;
  min-height: 1.5rem;
}
div.clip_compare_area {
  display:flex;
  margin-top:2rem;
}
div.clip_compare_area button {
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
<div id="clip_modal" class="modal">
  <h3 id="clip_target_monster"></h3>
  <table id="clip_modal_table">
    <thead><tr>
        <th class="col target"></th>
        <th class="col no">No.</th><th class="col">DPS</th>
        <th class="col">確殺</th>
        <th class="col memo">メモ</th>
        <th class="col action"></th>
    </tr></thead>
    <tbody></tbody>
  </table>
  <div class="clip_compare_area">
    <button type="button" class="clip_compare">比較</button>
    <div class="clip_compare_select_area"></div>
  </div>
  <div id="compare_container">
    <canvas id="compare_graph" style="display:none"></canvas>
  </div>
</div>
    `);

    let target = 0;
    const data = {
      labels: [],
      datasets: [{
        label: "DPS",
        data: [],
        borderColor: "blue",
        yAxisID: "y",
      }, {
        label: "確殺",
        data: [],
        borderColor: "red",
        yAxisID: "y1",
      }]
    }
    const footer = (items) => {
      return items[0].dataset.metadata[items[0].parsed.x].memo;
    };
    const ctx = document.getElementById("history_graph");
    const chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: "right"
          },
          tooltip: {
            callbacks: {
              footer: footer,
            }
          },
        },
        stacked: false,
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
            grid: {
              drawOnChartArea: false,
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            grid: {
              drawOnChartArea: false,
            },
          }
        },
        onClick: (e) => {
          const canvasPosition = Chart.helpers.getRelativePosition(e, chart);
          const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
          if (chart.data.datasets[0].data.length > dataX) {
            url = chart.data.datasets[0].metadata[Math.abs(dataX)]["url"];
            CSaveController.loadFromURL(url);
            CItemInfoManager.OnClickExtractSwitch();
            LoadSelect2();
          }
        }
      }
    });
    $("#history_clip").click(e => {
      // 直前の敵と同じか？
      if (target != $(".OBJID_MONSTER_MAP_MONSTER").val()) {
        chart.data.labels = [];
        chart.data.datasets[0].data = [];
        chart.data.datasets[0].metadata = [];
        chart.data.datasets[1].data = [];
        target = $(".OBJID_MONSTER_MAP_MONSTER").val();
        $("#clip_target_monster").text($(".OBJID_MONSTER_MAP_MONSTER option:selected").text());
      }
      const metadata = { "memo": "", "url": CSaveController.encodeToURL() };
      if ($("#clip_with_memo").prop('checked')) {
        memo = prompt("clipメモ");
        if (memo) metadata["memo"] = memo;
      }
      chart.data.labels.push(chart.data.labels.length + 1);
      const dps = parseFloat($("#BTLRSLT_PART_ATKCNT").parent().prev().prev().prev().prev().text().replaceAll(",", ""))
      chart.data.datasets[0].data.push(isNaN(dps) ? 0 : dps);
      chart.data.datasets[0].metadata.push(metadata);
      const cnt = parseInt($("#BTLRSLT_PART_EXP").parent().prev().prev().text().replaceAll(",", ""));
      chart.data.datasets[1].data.push(isNaN(cnt) ? 0 : cnt);
      chart.update();
    });
    $("#history_reset").click(e => {
      chart.data.labels = [];
      chart.data.datasets[0].data = [];
      chart.data.datasets[0].metadata = [];
      chart.data.datasets[1].data = [];
      target = 0;
      chart.update();
    });
    $("#history_list").click(e => {
      $("div.clip_compare_area > button").prop("disabled", true);
      $("div.clip_compare_select_area > select").remove();
      const attack_method = $("#OBJID_TD_ATTACK_METHOD_ROOT > table:nth-child(1) > tbody > tr > td:nth-child(1) > select").clone();
      attack_method.prepend("<option value='-1'></option>").val(-1);
      for (let i of Array(6)) {
        attack_method.clone().appendTo("div.clip_compare_select_area");
      }
      $("#history_graph").insertBefore("#clip_modal_table");
      reload_history_table();
      $("#clip_modal").modal();
    });
    const flip_clip = (i, j) => {
      [data.datasets[0].data[i], data.datasets[0].data[j]] =
        [data.datasets[0].data[j], data.datasets[0].data[i]];
      [data.datasets[0].metadata[i], data.datasets[0].metadata[j]] =
        [data.datasets[0].metadata[j], data.datasets[0].metadata[i]];
      [data.datasets[1].data[i], data.datasets[1].data[j]] =
        [data.datasets[1].data[j], data.datasets[1].data[i]];
    }
    const reload_history_table = () => {
      $("#clip_modal_table tbody *").remove();
      body = ""
      for (i = 0; i < data.labels.length; i++) {
        body += `<tr>
                  <td class="col target"><input type="checkbox" name="compare_target" value="${i}"></td>
                  <td class="col no">${data.labels[i].toLocaleString()}</td>
                  <td class="col">${data.datasets[0].data[i].toLocaleString()}</td>
                  <td class="col">${data.datasets[1].data[i].toLocaleString()}</td>
                  <td class="col memo"><div class="clip_memo">${data.datasets[0].metadata[i].memo}</div><input type="text" class="clip_memo" style="display:none;" value="${data.datasets[0].metadata[i].memo}"></td>
                  <td class="col action"><button class="up_clip" ${i == 0 ? "disabled" : ""}>↑</button><button class="down_clip"${i == data.labels.length - 1 ? "disabled" : ""}>↓</button><button class="remove_clip">×</button></td>
                </tr>`;
      }
      $("#clip_modal_table tbody").append(body);
    }
    $(document).on("click", "div.clip_memo", (e) => {
      $(e.target).toggle();
      $(e.target).next("input").toggle().focus();
    });
    $(document).on("change", "input.clip_memo", (e) => {
      const index = e.target.closest("tr").rowIndex - 1;
      data.datasets[0].metadata[index]["memo"] = e.target.value;
      chart.update();
      reload_history_table();
    });
    $(document).on("blur", "input.clip_memo", (e) => {
      $(e.target).toggle();
      $(e.target).prev("div").toggle();
    });
    $(document).on("click", ".up_clip", (e) => {
      const row = e.target.closest("tr");
      if (row.previousElementSibling) {
        const index = row.rowIndex - 1;
        flip_clip(index, index - 1);
        chart.update();
        reload_history_table();
      }
    });
    $(document).on("click", ".down_clip", (e) => {
      const row = e.target.closest("tr");
      if (row.nextElementSibling) {
        const index = row.rowIndex - 1;
        flip_clip(index, index + 1);
        chart.update();
        reload_history_table();
      }
    });
    $(document).on("click", ".remove_clip", (e) => {
      const row = e.target.closest("tr");
      const index = row.rowIndex - 1;
      data.labels.pop();
      data.datasets[0].data.splice(index, 1);
      data.datasets[0].metadata.splice(index, 1);
      data.datasets[1].data.splice(index, 1);
      chart.update();
      reload_history_table();
    });
    $("#clip_modal").on("modal:before-close", () => {
      $("#history_graph").appendTo("#history_container");
      $("#compare_graph").css("display", "none");
    });
    $(document).on("change", "[name=compare_target]", (e) => {
      const targets = $("[name=compare_target]:checked").map((i, e) => parseInt(e.value)).toArray();
      $("div.clip_compare_area > button").prop("disabled", targets.length < 2);
    });
    let radar_chart = null;
    $("div.clip_compare_area > button").click((e) => {
      $.LoadingOverlay("show", {fade: false});
      setTimeout(()=>{
        const current_url = CSaveController.encodeToURL();
        try{
          const labels = ["", "", "", "", "", ""];
          const data = {
            labels: labels,
            datasets: []
          };
          $("[name=compare_target]:checked").each((i, e) => {
            const metadata = chart.data.datasets[0].metadata[$(e).val()];
            const d = {
              label: metadata["memo"] || ("CLIP-" + (parseInt($(e).val()) + 1)),
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
              if (method_id >= 0) {
                attack_method.val(method_id).change();
                $("#OBJID_BUTTON_CALC").click();
                const dps = parseFloat($("#BTLRSLT_PART_ATKCNT").parent().prev().prev().prev().prev().text().replaceAll(",", ""))
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
          const ctx = document.getElementById("compare_graph");
          if (radar_chart) {
            radar_chart.data = data;
            radar_chart.update();
          } else {
            radar_chart = new Chart(ctx, {
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
  };
  buildForm();
});
