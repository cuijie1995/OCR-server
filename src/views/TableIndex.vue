<template>
  <div class="table_index">
    <div class="table_header">
      <el-button title="go back" @click="goBack">
        <i class="el-icon-back"></i> 返回预览页
      </el-button>
    </div>

    <div>
      <saveTemplate :templateList="templateList" :tableShow="tableShow" :page="page"></saveTemplate>
    </div>
    <el-container>
      <el-main v-loading="loading">
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
                >
                  <span>{{item.words}}</span>
                  <div
                    v-for="(aa,j) in templateData.characteristics"
                    :key="j"
                    style=" display: inline;"
                  >
                    <span
                      style="color: #ffffff;background:#409EFF;border-radius: 50%;padding: 4px;margin-left: 10px;cursor: pointer;"
                      v-if="aa.distinguishType == 2 && aa.region == index && aa.index == i"
                      @click="clickSpan(aa)"
                    >{{aa.correspondingValue}}</span>
                    <span
                      style="color: #ffffff;background:#67C23A;border-radius: 50%;padding: 4px;margin-left: 10px;cursor: pointer;"
                      v-if="aa.distinguishType == 1 && aa.region == index && aa.index == i"
                      @click="clickSpan(aa)"
                    >{{aa.correspondingValue}}</span>
                    <span
                      style="color:red;position: relative;top: -7px;left: -5px;cursor: pointer;"
                      v-if=" aa.region == index  && aa.index == i"
                      @click="deleteSpan(j)"
                    >X</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="items.type == 'table' && items.words_block_list.length > 1" class="ttable">
              <!-- {{items}} -->
              <!-- <table @click="TabClick()" id="idTable"> -->
              <table id="idTable" style="display:inline-block">
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

                      <div
                        v-for="(item,j) in templateData.characteristics"
                        :key="j"
                        style=" display: inline;"
                      >
                        <span
                          style="color: #ffffff;background:#409EFF;border-radius: 50%;padding: 4px;margin-left: 10px;cursor: pointer;"
                          v-if="item.accessRow[0] == data.rows[0] && item.accessColumn[0] == data.columns[0] && item.distinguishType == 2 && item.region == index"
                          @click="clickSpan(item)"
                        >{{item.correspondingValue}}</span>
                        <span
                          style="color: #ffffff;background:#67C23A;border-radius: 50%;padding: 4px;margin-left: 10px;cursor: pointer;"
                          v-if="item.accessRow[0] == data.rows[0] && item.accessColumn[0] == data.columns[0] && item.distinguishType == 1 && item.region == index"
                          @click="clickSpan(item)"
                        >{{item.correspondingValue}}</span>
                        <span
                          style="color:red;position: relative;top: -7px;left: -5px;cursor: pointer;"
                          v-if="item.accessRow[0] == data.rows[0] && item.accessColumn[0] == data.columns[0] && item.region == index "
                          @click="deleteSpan(j)"
                        >X</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <el-button
                type="primary"
                style="position: absolute;margin-left: 20px;"
                @click="exportData(index)"
              >导出</el-button>
            </div>
          </div>
        </div>

        <div class="footer">
          <el-button type="success" @click="saveTemplate" :disabled="disabled">保存模板</el-button>
        </div>
      </el-main>
      <!-- <el-aside style="width:10%"> -->
      <!-- <div class="footer">
        <el-button type="success" @click="saveTemplate" :disabled="disabled">保存模板</el-button>
      </div>-->
      <!-- </el-aside> -->
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
  GetOcrResultChange,
  TableExportExcel,
} from "../api/preview";

import dialogTemplate from "../components/dialog";
import saveTemplate from "../components/saveTemplate";

export default {
  name: "tableIndex",
  components: { dialogTemplate, saveTemplate },

  data() {
    return {
      dialogVisible: {
        show: false,
        title: "",
        num: "",
        tableShow: false,
        radioShow: false,
      },
      list: [],
      columnsLength: [],
      dataList: {
        result: {
          words_region_count: 3,
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
        resultData: "",
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
        dataId: "",
        value: "",
        splitAccess: "",
        index: 0,
        isCheckHead: true,
      },
      templateList: [],
      tableShow: false,
      radioShow: false,
      templateId: "",
      u8arr: "",
      page: 1,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      GetOcrResult({
        EnclosureId: localStorage.getItem("pdfOcrId"),
        Page: localStorage.getItem("page"),
      }).then((res) => {
        console.log(res.result.page);
        this.page = res.result.page;
        this.templateData.resultData = res.result.dataArchiving;

        this.templateId = res.result.id;

        GetOcrResultChange({
          operationRecord: this.templateId,
        }).then((response) => {
          console.log(response);
          this.templateList = JSON.parse(response.result.resultData);

          this.tableShow = true;
        });
        this.dataList = JSON.parse(res.result.dataArchiving);

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
    confirmDialog(val) {
      this.dataName = this.dataForm.correspondingValue;

      console.log(this.dataForm);

      if (this.dataForm.distinguishType == 2) {
        if (val.correspondingField == 1) {
          val.correspondingValue = "品名";
        }
      }

      this.templateData.characteristics.push(val);
      for (
        var i = 0, len = this.templateData.characteristics.length;
        i < len;
        i++
      ) {
        for (
          var j = i + 1, len = this.templateData.characteristics.length;
          j < len;
          j++
        ) {
          if (
            this.templateData.characteristics[i].dataId ===
            this.templateData.characteristics[j].dataId
          ) {
            this.templateData.characteristics.splice(j, 1);
            j--;
            len--;
          }
        }
      }

      console.log(this.templateData.characteristics);
      return this.templateData.characteristics;
    },
    clickSpan(val) {
      this.dataForm = val;
      console.log(val);

      console.log("ffffffffffffffffffffff");

      this.dialogVisible = {
        show: true,
        title: "模板",
        tableShow: false,
        radioShow: false,
      };
      if (val.distinguishType == 2) {
        this.dialogVisible.tableShow = true;
      }
      if (val.accessMethod != 1) {
        this.dialogVisible.radioShow = true;
      }
      // else if (val.distinguishType == 1 && val.accessMethod != 1) {
      //   this.dialogVisible = {
      //     show: true,
      //     title: "模板",
      //     tableShow: false,
      //     radioShow: true,
      //   };
      // }
      // else {
      //   this.dialogVisible = {
      //     show: true,
      //     title: "模板",
      //     tableShow: false,
      //     radioShow: false,
      //   };
      // }
    },
    deleteSpan(index) {
      console.log(index);
      this.templateData.characteristics.splice(index, 1);
    },
    clickDiv(val, type, index, i) {
      this.dataForm = {
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
        dataId: "",
        index: i,
        isCheckHead: true,
      };

      var curguid = "";
      for (var i = 1; i <= 32; i++) {
        var id = Math.floor(Math.random() * 16.0).toString(16);
        curguid += id;
        if (i == 8 || i == 12 || i == 16 || i == 20) curguid += "-";
      }

      this.dataForm.dataId = curguid;

      this.dataForm.region = index;
      this.dataForm.regionType = type;
      this.dataForm.value = val;

      this.$refs.dialogTemplate.getEnumDictionary();
      this.dialogVisible = {
        show: true,
        title: "模板",
        tableShow: false,
        radioShow: false,
      };
    },
    clickTd(val, type, index, k, g, columns, rows) {
      this.templateData.identificationArea = index;
      this.templateData.accessLine = k;

      this.dataForm = {
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
        dataId: "",
        value: "",
        splitAccess: "",
        index: i,
        isCheckHead: true,
      };

      var curguid = "";
      for (var i = 1; i <= 32; i++) {
        var id = Math.floor(Math.random() * 16.0).toString(16);
        curguid += id;
        if (i == 8 || i == 12 || i == 16 || i == 20) curguid += "-";
      }

      this.dataForm.dataId = curguid;

      this.dataForm.region = index;
      this.dataForm.regionType = type;
      this.dataForm.accessRow = rows.toString();
      this.dataForm.accessColumn = columns.toString();
      this.dataForm.value = val;
      this.dialogVisible = {
        show: true,
        title: "模板",
        tableShow: false,
        radioShow: false,
      };

      this.$refs.dialogTemplate.getEnumDictionary();
    },
    saveTemplate() {
      this.disabled = false;
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

      this.templateData.characteristics.forEach((element) => {
        // console.log(element);
      });

      // console.log(this.templateData);
      CreateTemplate(this.templateData).then((res) => {
        this.$message({
          message: "模板保存成功",
          type: "success",
        });

        this.disabled = false;

        GetOcrResultChange({
          operationRecord: this.templateId,
        }).then((res) => {
          console.log(res);
          this.templateList = JSON.parse(res.result.resultData);

          this.tableShow = true;
        });
        // });
      });
    },
    goBack() {
      this.$router.push("/preview");
    },
    exportData(index) {
      var exportData = JSON.parse(this.templateData.resultData);
      var data;

      exportData.result.words_region_list.forEach((element, i) => {
        if (index == i) {
          data = element;
        }
      });

      console.log(data.words_block_list);

      TableExportExcel(data.words_block_list).then((res) => {
        console.log(res.result);

        const data = res.result.fileByte;

        var disLength = res.result.excelName.length;

        var shortName = res.result.excelName.substring(
          disLength - 4,
          disLength
        );

        var url = "";
        if (shortName == ".xls" || shortName == "xlsx") {
          this.base64toBlob(data);

          let blob = new Blob([this.u8arr], {
            type: "application/octet-stream",
          }); // 转化为blob对象

          url = window.URL.createObjectURL(blob);
        } else {
          url = window.URL.createObjectURL(
            new Blob([data], {
              type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
          );
        }

        const link = document.createElement("a");
        const fileName = res.result.excelName;
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    base64toBlob(base64) {
      // 将base64转为Unicode规则编码
      var bstr = atob(base64);
      var n = bstr.length;
      this.u8arr = new Uint8Array(n);
      while (n--) {
        this.u8arr[n] = bstr.charCodeAt(n); // 转换编码后才可以使用charCodeAt 找到Unicode编码
      }

      return new Blob([bstr]);
    },
  },
};
</script>
<style  scoped>
.table_index {
  background: #404040;
}
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
  border: 1px solid #ffffff;
  border-collapse: collapse;
  color: #ffffff;
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
  color: #ffffff;
}

.ttable {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 50px;
  padding-left: 30px;
}
.confirm_content {
  color: red;
}
.el-dialog {
  width: 40% !important;
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

.table_index .el-table th,
.table_index .el-table tr {
  background: #404040;
  color: #ffffff;
}

/* // 鼠标悬浮 */
.table_index .el-table tr.hover-row,
.table_index .el-table tr.hover-row td {
  background: #000000 !important;
}

.el-loading-spinner {
  background: #404040;
}
</style>

<style lang="scss">
.table_header {
  text-align: center;
  background: #474747;
  padding: 10px 0;

  .el-button {
    background: none;
    color: #ffffff;
    //  border: none;
  }
}
</style>