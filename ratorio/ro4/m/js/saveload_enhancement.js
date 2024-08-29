$(function () {
  //===========================================
  //  requirement library
  //===========================================
  $("head").append(`
    <link href="https://cdn.datatables.net/v/dt/dt-2.1.4/sp-2.3.2/sl-2.0.5/datatables.min.css" rel="stylesheet">
    <script src="https://cdn.datatables.net/v/dt/dt-2.1.4/sp-2.3.2/sl-2.0.5/datatables.min.js"></script>
  `);
  const build = () => {
    //===========================================
    //  HTML/CSS
    //===========================================
    $("#OBJID_BUTTON_IMAGE_SAVE_DATA_MIG").after(`
      <button id="save_list" type="button">一覧</button>
      <style>
      #save_list {
        grid-row: 2;
        grid-column: 5;
      }
      .jquery-modal.blocker {
        z-index: 100 !important;
      }
      #save_modal {
        min-width: 1024px;
        min-height: 90vh;
      }
      #save_modal .dtsp-titleRow {
        display: none;
      }

      #save_modal_table tbody tr {
        cursor: pointer;
      }
      #save_modal_table .no {
        width:5%;
      }
      #save_modal_table .name {
        overflow:hiddden;
        overflow-wrap: break-word;
      }
      #save_modal_table .job {
        width:22%;
      }
      #save_modal_table .lv {
        width:5%;
      }
      #save_modal_table .monster {
        width:20%;
      }
      #save_modal_table .date {
        width:20%;
      }
      #save_toolbar {
        margin: 0.5rem;
        text-align: right;
      }
      #save_toolbar .button {
        width: 100px;
      }
      #save_file {
        display: none;
      }
      #save_toolbar .button:first{
        margin-right: 0.5rem;
      }
      </style>
      <div id="save_modal" class="modal">
        <div id="save_toolbar">
        </div>
        <div style="width:100%">
          <table id="save_modal_table" class="display" style="width:100%">
            <thead><tr>
                <th class="no">No.</th>
                <th class="name">名称</th>
                <th class="job">職業</th>
                <th class="lv">LV</th>
                <th class="monster">モンスター</th>
                <th class="date">更新日</th>
            </tr></thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    `);
    if (window.File) {
      $("#save_toolbar").append(`
      <input type="file" id="save_file"></input><button id="save_import" type="button" class="button">インポート</button>
      <button id="save_export" type="button" class="button">エクスポート</button>
      `);
    }
    //===========================================
    //  core
    //===========================================
    const STORAGE_NAME_CHARA_DATA_EX = CSaveController.STORAGE_NAME_CHARA_DATA + "_EX";
    if (!CSaveController.isAvailableBrowserStorage(CSaveController.STORAGE_TYPE_LOCALSTORAGE)) {
      return;
    }
    const d = localStorage.getItem(STORAGE_NAME_CHARA_DATA_EX);
    const tmp_arr = JSON.parse(d) || [];
    const ex_array = []

    const rrtcdAll = localStorage.getItem(CSaveController.STORAGE_NAME_CHARA_DATA);
    const rrtcdArray = (rrtcdAll ? rrtcdAll.split(CSaveController.STORAGE_DATA_DELIMITER_UNIT) : []);
    rrtcdArray.forEach((v, i) => {
      if (v != CSaveController.STORAGE_DATA_DELIMITER_PROP) {
        const d = tmp_arr.find((val) => { return val != null && val.no == i + 1 }) || {
          no: i + 1,
          name: "",
          job: "",
          lv: "",
          monster: "",
          date: ""
        }
        ex_array[i] = d;
      }
    });

    $("#OBJID_BUTTON_SAVE_SAVE_DATA_MIG").on("click", () => {
      const index = HtmlGetObjectValueByIdAsInteger("OBJID_SELECT_SAVE_DATA_MIG", 0);
      data = {
        no: index + 1,
        name: HtmlGetObjectValueById("OBJID_INPUT_SAVE_NAME_MIG", "").slice(0, CSaveController.CHARA_DATA_NAME_LENGTH),
        job: GetJobName(n_A_JOB),
        lv: n_A_BaseLV,
        monster: $("select.OBJID_MONSTER_MAP_MONSTER option:selected").text(),
        date: datetime.format(new Date())
      };
      ex_array[index] = data;
      localStorage.setItem(STORAGE_NAME_CHARA_DATA_EX, JSON.stringify(ex_array));
    });
    $("#OBJID_BUTTON_DELETE_SAVE_DATA_MIG").on("click", () => {
      const dataIndex = HtmlGetObjectValueByIdAsInteger("OBJID_SELECT_SAVE_DATA_MIG", 0);
      ex_array[dataIndex] = null;
      localStorage.setItem(STORAGE_NAME_CHARA_DATA_EX, JSON.stringify(ex_array));
    });

    $("#save_list").on("click", () => {
      const data_table = new DataTable('#save_modal_table', {
        destroy: true,
        data: ex_array.filter(v => v),
        columns: [
          { className: "no", data: "no" },
          {
            className: "name", orderable: false, data: "name", render: (data) => {
              return `<div style="width:288px;">${data}</div>`;
            }
          },
          { className: "job", searchPanes: { show: true }, orderable: false, data: "job" },
          { className: "lv", data: "lv" },
          { className: "monster", searchPanes: { show: true }, orderable: false, data: "monster" },
          { className: "date", data: "date" }
        ],
        layout: {
          top1: {
            searchPanes: {
              layout: "columns-2",
              columns: [2, 4],
              dtOpts: {
                scrollY: '100px'
              }
            }
          }
        }
      });
      data_table.draw();
      $("#save_modal").modal();
    });
    $(document).on("click", "#save_modal_table tbody", (e) => {
      const num_td = $(e.target.closest("tr")).find("td:first");
      const dataIndex = parseInt(num_td.text()) - 1;
      load_save_data(dataIndex);
      $.modal.close();
    });
    $("#save_file").on("change", (e) => {
      if (e.target.files.length == 1 && e.target.files[0].type == "application/json") {
        var reader = new FileReader();
        reader.onload = () => {
          try {
            data = JSON.parse(reader.result);
            if (!data.hasOwnProperty(CSaveController.STORAGE_NAME_CHARA_DATA)) {
              throw Error();
            }
            localStorage.setItem(CSaveController.STORAGE_NAME_CHARA_DATA, data[CSaveController.STORAGE_NAME_CHARA_DATA]);
            if (data.hasOwnProperty(STORAGE_NAME_CHARA_DATA_EX)) {
              localStorage.setItem(STORAGE_NAME_CHARA_DATA_EX, data[STORAGE_NAME_CHARA_DATA_EX]);
            } else {
              localStorage.removeItem(STORAGE_NAME_CHARA_DATA_EX);
            }
            if (confirm("インポートデータを反映するためにリロードします。\nリロードしなかった場合、動作に不整合が発生します")) {
              location.reload();
            }
          } catch (e) {
            alert("ファイルエラー");
          }
        }
        reader.readAsText(e.target.files[0]);
      } else {
        alert("ファイルエラー");
      }
      $("#save_file").val("");
    });
    $("#save_import").on("click", () => {
      $("#save_file").click();
    });
    $("#save_export").on("click", () => {
      const content = {
        [CSaveController.STORAGE_NAME_CHARA_DATA]: localStorage.getItem(CSaveController.STORAGE_NAME_CHARA_DATA),
        [STORAGE_NAME_CHARA_DATA_EX]: localStorage.getItem(STORAGE_NAME_CHARA_DATA_EX)
      }
      const blob = new Blob([JSON.stringify(content)], { "type": "application/json" });
      const download = document.createElement("a");
      download.download = "ratorio_save_data.json";
      download.href = window.URL.createObjectURL(blob)
      download.click();
    });
    //===========================================
    //  util
    //===========================================
    const escape = (t) => {
      return $("<span/>").text(t).html();
    }
    const datetime = new Intl.DateTimeFormat(
      undefined,
      {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
    const load_save_data = (index) => {
      $("#OBJID_SELECT_SAVE_DATA_MIG").val(index);
      $("#OBJID_BUTTON_LOAD_SAVE_DATA_MIG").click();
      $("#save_modal").modal();
    }
  }
  build();
});
