<template>
  <div class="table_index">
    <el-container>
      <el-main style="width:70%" v-loading="loading">
        <div class="content_main">
          <div v-for="(items,index) in dataList.result.words_region_list" :key="index">
            <div v-if="items.type == 'text'" class="text">
              <div>
                <div
                  class="col-xs-6 col-sm-4 col-md-3 col-lg-3 text_name"
                  v-for="(item,i) in items.words_block_list"
                  :key="i"
                  @click="clickDiv(item.words,items.type,index,i)"
                  :class="'words_' + index + '_' + i"
                >{{item.words}}</div>
              </div>
            </div>
            <div v-if="items.type == 'table'" class="ttable">
              <!-- <table @click="TabClick()" id="idTable"> -->
              <table id="idTable">
                <thead>
                  <!-- <th align="center" v-for="(d,l) in columnsLength" :key="l">
              <div align="center" class="itd"></div>
                  </th>-->
                </thead>
                <tbody>
                  <tr v-for="(item,k) in items.words_block_list" :key="k">
                    <td
                      align="center"
                      v-for="(data,g) in item.rowsList"
                      :key="g"
                      :colspan="data.columns.length"
                      :rowspan="data.rows.length"
                    >
                      <div
                        class="itd"
                        @click="clickTd(data.words,items.type,index,k,g,data.columns,data.rows)"
                        :class="'words_' + index +'_' + k + '_' + g"
                      >{{data.words}}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </el-main>
      <el-aside style="width:30%">
        <div>
          <span class="distinguish_order">1.</span>
          <span class="distinguish_name">模板识别：</span>
          <span class="distinguish_data">{{choiceData.templateRecognition}}</span>
        </div>
        <div v-for="(data,index) in choiceData.accessRecognition" :key="index">
          <span class="distinguish_order">{{index + 2}}.</span>
          <span class="distinguish_name">取数识别：</span>
          <span class="distinguish_data">{{data.name}}</span>
        </div>

        <div class="footer">
          <el-button type="success" @click="saveTemplate" :disabled="disabled">保存模板</el-button>
        </div>
      </el-aside>
    </el-container>

    <dialogTemplate
      :dialogVisible="dialogVisible"
      ref="dialogTemplate"
      @confirmDialog="confirmDialog"
      :dataForm="dataForm"
    ></dialogTemplate>
  </div>
</template>
<script>
import {
  GetOcrResult,
  CreateTemplate,
  getDistinguishTypeEnum,
  getAccessMethodEnum,
  getCorrespondingFieldEnum,
} from "../api/preview";

import dialogTemplate from "../components/dialog";

export default {
  name: "tableIndex",
  components: { dialogTemplate },
  data() {
    return {
      wordsType: "",
      dataIndex: "",
      dataI: "",
      wordsIndex: "",
      wordsK: "",
      wordsG: "",
      choiceData: {
        // name:"模板识别"
        templateRecognition: "购销合同",
        accessRecognition: [
          {
            id: "1",
            name: "品名",
          },
          {
            id: "2",
            name: "品牌",
          },
          {
            id: "3",
            name: "单位",
          },
        ],
      },
      tdInnerHtml: "",
      selects: "",
      selectsName: "",
      RowIndex: "",
      CellIndex: "",
      dialogVisible: {
        show: false,
        title: "",
        num: "",
      },
      list: [],
      columnsLength: [],
      dataList: {
        result: {
          words_region_list: [],
        },
      },
      templateData: {
        templateNo: "",
        characteristics: [],
        tableQty: "",
        regionQty: "",
        identificationArea: "",
        accessLine: "",
        tableHead: "",
      },
      loading: true,
      disabled: false,
      dataForm: {
        region: 0,
        regionType: "",
        accessRow: "",
        accessColumn: "",
        distinguishType: 1,
        accessMethod: 1,
        accessParagraph: 0,
        correspondingField: 1,
        correspondingValue: "",
        accessValue: "",
        num: "",
      },
      pinmingName: "",
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      GetOcrResult({
        EnclosureId: localStorage.getItem("pdfOcrId"),
        Pages: 1,
      }).then((res) => {
        this.dataList = JSON.parse(res.result[0].operationRecord.dataArchiving);
        // console.log(this.dataList)

        var listData = this.dataList.result.words_region_list;
        var arrColumns = [];
        listData.forEach((elements) => {
          if (elements.type == "table") {
            elements.words_block_list.forEach((element) => {
              element.columns.forEach((items) => {
                arrColumns.push(items);
              });
            });
          }
        });

        this.columnsLength = arrColumns.sort((a, b) => a - b).pop() + 1;

        this.dataList.result.words_region_list.forEach((elements, index) => {
          if (elements.type == "table") {
            elements.words_block_list.forEach((element, i) => {
              element.id = element.rows[0] + [index];
            });
            const newData = [];

            elements.words_block_list.forEach((item) => {
              const indexFound = newData.findIndex(
                (newItem) =>
                  newItem.id == item.id && newItem.rows[0] == item.rows[0]
              );

              const currentGoods = {
                columns: item.columns,
                rows: item.rows,
                words: item.words,
              };

              if (indexFound > -1) {
                newData[indexFound].rowsList.push(currentGoods);
              } else {
                newData.push({
                  id: item.id,
                  rows: item.rows,
                  rowsList: [currentGoods],
                });
              }
            });
            elements.words_block_list = newData;
            return newData;
          }
        });

        this.loading = false;
      });
    },
    TabClick() {
      //   var rows = document.getElementById("idTable").getElementsByTagName("tr");
      //   var cols;
      //   for (let i = 0; i < rows.length; i++) {
      //     rows[i].onclick = function () {
      //       // alert("行：" + eval(this.rowIndex));
      //       // console.log(this.rowIndex);
      //     };
      //     cols = rows[i].getElementsByTagName("td");
      //     for (let j = 0; j < cols.length; j++) {
      //       cols[j].onclick = function () {
      //         // alert("列：" + eval(this.cellIndex));
      //         // console.log(this.cellIndex);
      //       };
      //       this.dialogVisible = true;
      //     }
      //   }
      //   this.tdInnerHtml = event.srcElement; // 通过event.srcElement 获取激活事件的对象 td
      //   // // console.log(td.parentElement.rowIndex);
      //   // console.log(td.innerHTML);
      //   // console.log(td.cellIndex);
      //   // // alert("行号：" + td.parentElement.rowIndex + "，列号：" + td.cellIndex);
      //   // "<div type='primary' class='confirm_content' style='color: #ffffff;background:#409EFF;border-radius: 10px'>" +
      //   // "dddd" +
      //   // "</div>"; //设置单击单元格的值
      //   // console.log(td.innerHTML);
    },
    selectChange(id, name) {
      this.selectsName = name;
    },
    confirmDialog(val) {
      // console.log(val);
      console.log(this.dataForm);

      this.dataName = this.dataForm.correspondingValue;

      if (val.correspondingField == 1) {
        val.correspondingValue = "品名";
      }

      this.templateData.characteristics.push(val);
      console.log(this.templateData.characteristics);

      var wordsType;
      this.dataList.result.words_region_list.forEach((elements, j) => {
        if (this.wordsType == "text") {
          if (this.dataIndex == j) {
            elements.words_block_list.forEach((element, k) => {
              if (this.dataI == k) {
                element.words =
                  document.getElementsByClassName(
                    "words_" + this.dataIndex + "_" + this.dataI
                  )[0].innerHTML + val.correspondingValue;
              }
            });
          }
        }
        if (this.wordsType == "table") {
          if (this.wordsIndex == j) {
            elements.words_block_list.forEach((element, k) => {
              if (this.wordsK == k) {
                element.rowsList.forEach((item, g) => {
                  if (this.wordsG == g) {
                    item.words =
                      document.getElementsByClassName(
                        "words_" +
                          this.wordsIndex +
                          "_" +
                          this.wordsK +
                          "_" +
                          this.wordsG
                      )[0].innerHTML + val.correspondingValue;
                  }
                });
              }
            });
          }
        }
      });

      if (this.wordsType == "text") {
        if (val.distinguishType == 1) {
          document.getElementsByClassName(
            "words_" + this.dataIndex + "_" + this.dataI
          )[0].innerHTML =
            document.getElementsByClassName(
              "words_" + this.dataIndex + "_" + this.dataI
            )[0].innerHTML +
            "<span class='confirm_content' style='color: #ffffff;background:#67C23A;border-radius: 50%;padding: 10px;'>" +
            val.correspondingValue +
            "</span>";
        }
        if (val.distinguishType == 2) {
          document.getElementsByClassName(
            "words_" + this.dataIndex + "_" + this.dataI
          )[0].innerHTML =
            document.getElementsByClassName(
              "words_" + this.dataIndex + "_" + this.dataI
            )[0].innerHTML +
            "<span class='confirm_content' style='color: #ffffff;background:#409EFF;border-radius: 50%;padding: 10px;'>" +
            val.correspondingValue +
            "</span>";
        }
      }
      if (this.wordsType == "table") {
        if (val.distinguishType == 1) {
          document.getElementsByClassName(
            "words_" + this.wordsIndex + "_" + this.wordsK + "_" + this.wordsG
          )[0].innerHTML =
            document.getElementsByClassName(
              "words_" + this.wordsIndex + "_" + this.wordsK + "_" + this.wordsG
            )[0].innerHTML +
            "<span class='confirm_content' style='color: #ffffff;background:#67C23A;border-radius: 50%;padding: 4px;margin-left: 10px;'>" +
            val.correspondingValue +
            "</span>";
        }
        if (val.distinguishType == 2) {
          document.getElementsByClassName(
            "words_" + this.wordsIndex + "_" + this.wordsK + "_" + this.wordsG
          )[0].innerHTML =
            document.getElementsByClassName(
              "words_" + this.wordsIndex + "_" + this.wordsK + "_" + this.wordsG
            )[0].innerHTML +
            "<span class='confirm_content' style='color: #ffffff;background:#409EFF;border-radius: 50%;padding: 4px;margin-left: 10px;'>" +
            val.correspondingValue +
            "</span>";
        }
      }
    },
    getTableData() {
      var tableInfo = "";
      var tableObj = document.getElementById("idTable");
      for (var i = 0; i < tableObj.rows.length; i++) {
        //遍历Table的所有Row
        for (var j = 0; j < tableObj.rows[i].cells.length; j++) {
          //遍历Row中的每一列
          tableInfo += tableObj.rows[i].cells[j].innerText; //获取Table中单元格的内容
          tableInfo += "   ";
        }
        tableInfo += "\n";
      }
      console.log(tableInfo);
      return tableInfo;
    },
    clickDiv(val, type, index, i) {
      this.dataIndex = index;
      this.dataI = i;
      // this.accessValue = val;
      // this.splitAccessList = this.dataForm.accessValue.split(",");
      this.wordsType = type;
      // this.dialogVisible = true;

      this.$refs.dialogTemplate.getEnumDictionary();
      this.dialogVisible = {
        show: true,
        title: "模板",
        // accessValue: val,
      };
    },
    clickTd(val, type, index, k, g, columns, rows) {
      // console.log(val);
      this.wordsIndex = index;
      this.wordsK = k;
      this.wordsG = g;
      this.wordsType = type;

      // console.log(this.wordsK);
      // console.log(this.wordsG);

      localStorage.setItem("accessValue", val);
      localStorage.setItem("index", index);
      localStorage.setItem("type", type);
      localStorage.setItem("accessRow", rows.toString());
      localStorage.setItem("accessColumn", rows.toString());

      this.templateData.identificationArea = index;
      this.templateData.accessLine = k;

      (this.dataForm = {
        region: 0,
        regionType: "",
        accessRow: "",
        accessColumn: "",
        distinguishType: 1,
        accessMethod: 1,
        accessParagraph: 0,
        correspondingField: 1,
        correspondingValue: "",
        accessValue: "",
        num: "",
      }),
        (this.dialogVisible = {
          show: true,
          title: "模板",
          // num:this.wordsK + this.wordsG
        });
      // this.dataForm.num = this.wordsK + this.wordsG;

      this.$refs.dialogTemplate.getEnumDictionary();
    },

    clickSpan() {
      // console.log("55555555555");
    },
    saveTemplate() {
      this.disabled = true;
      var i = 0;
      this.dataList.result.words_region_list.forEach((element) => {
        if (element.type == "table") {
          i++;
        }
      });

      var date = new Date();
      this.templateData.templateNo = date.toLocaleString() + "的模板";
      this.templateData.tableQty = i;
      this.templateData.regionQty = this.dataList.result.words_region_count;

      GetOcrResult({
        EnclosureId: localStorage.getItem("pdfOcrId"),
        Pages: 1,
      }).then((res) => {
        var list = JSON.parse(res.result[0].operationRecord.dataArchiving)
          .result.words_region_list;
        var arr = [];
        list.forEach((element, index) => {
          if (index == this.templateData.identificationArea) {
            element.words_block_list.forEach((item) => {
              element.words_block_list[0].rows.forEach((i) => {
                if (i == item.rows[0]) {
                  arr.push(item);
                }
              });
            });
          }
        });

        this.templateData.tableHead = JSON.stringify(arr);

        CreateTemplate(this.templateData).then((res) => {
          this.$message({
            message: "模板保存成功",
            type: "success",
          });

          this.disabled = false;
        });
      });
    },
  },
};
</script>
<style  scoped>
td {
  vertical-align: middle;
}
th {
  vertical-align: middle;
}
th .itd {
  width: 150px;
}
.itd {
  white-space: pre-line;
  cursor: pointer;
}
table,
th,
td {
  border: 1px solid blue;
  border-collapse: collapse;
}
table {
}
.text {
  font-size: 12px;
  margin-bottom: 50px;
}
.text_name {
  margin-left: 20px;
  margin-bottom: 5px;
  /* white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all; */
  cursor: pointer;
}

.ttable {
  width: 100%;
  overflow-x: auto;
  /* margin-left: 30px; */
  margin-bottom: 50px;
  padding-left: 30px;
}
.confirm_content {
  color: red;
}
.el-dialog {
  width: 40% !important;
}
.el-main {
  border-right: 1px dashed #dcdfe6;
}
.el-aside {
  padding: 50px 20px 20px 20px;
}
span.distinguish_name {
  color: #606266;
}
span.distinguish_data {
  color: #303133;
}
.content_main {
  width: 100%;
}
.el-button {
  padding: 8px 20px;
}
</style>
<style >
.table_index .el-dialog__header {
  padding: 20px 20px 10px;
  border-bottom: 1px solid #dcdfe6;
}

.footer {
  position: fixed;
  bottom: 100px;
  right: 100px;
}
</style>