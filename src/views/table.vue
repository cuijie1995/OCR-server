<template>
  <div class="table_table">
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
      choiceData: {
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
          words_region_count: 4,
          words_region_list: [
            {
              type: "text",
              words_block_count: 6,
              words_block_list: [
                {
                  words: "W4T4W4BE ELECTRIC INDUSTRY CO.LTD.",
                },
                {
                  words:
                    "16-19,6-chome,jingumae,Shibuya-ku,Tokyo,150-0001,JAPA]",
                },
                {
                  words: "PHONE:+81-3-3400-6147",
                },
                {
                  words: "FAX",
                },
                {
                  words: "+81-3-3409-3156",
                },
                {
                  words: "URL: https://www.watanabe-electric.co.jn",
                },
              ],
            },
            {
              type: "table",
              words_block_count: 8,
              words_block_list: [
                {
                  words:
                    "10/1 \nINVOICE \nSold to : Shenzhen Jusn Technology Co.Ltd                 No.t    K00003159 \nAddress  Rm 410.Baoyunda Logistics Information Building.            Date:     7-Jul-2020 \nXixiang.Qianjin Er Rd.Bao'an District, \nShenzhen City                   Proforma Invoice No.：      WA-5625c \nCountry：  P.R.China                    Contract No.：       P/O JUSN-20200622-3\nTel No.： +86-755-8981 5780 \nFax No.  +86-755-3390 2160 \nAttn：    Mr.Rocky Pong \nShip to   HUATAIIMPORT AND EXPORT(HK)LIMITED\nAddress： : FLAT/RM 307,Shing Yip Industrial Building, \nNo.19-21 Shing Yip Street \nKwun Tong. \nCountry   HongKong \nTel No.：   00852-35946537 \nFax No.   00852-35946537\nAttn：    Mr.Hu \nShipped from:   TOKYOJAPAN to    HongKong   per       EMS \nMaker & Numbers   Quantity         Description",
                  rows: [0],
                  columns: [0, 1, 2, 3, 4, 5],
                },
                {
                  words: "",
                  rows: [0, 1],
                  columns: [6],
                },
                {
                  words: "1.1）\n1.2)\n13)\n1.4)\n15)\nTOTAL：1 Cartoy(",
                  rows: [1],
                  columns: [0],
                },
                {
                  words: "1 set \n8 sets \n2.sets \n5 sets \n1 set \n17 sets",
                  rows: [1],
                  columns: [1],
                },
                {
                  words:
                    "P/O JUSN-20200622-3 \nSignal converter \nModel TZ-5XA-AYH \nOutput:0-12VDC(Speclal) \nDigital panel meter \nModel A7117-4 \n￥6.9 \nSignal converter \nModel TZ-5XA-2AL \nDigital panel meter \nModel AMH-148-VA-22 \nDigital panel meter \nModel A911B-02 \nEMS charge",
                  rows: [1],
                  columns: [2],
                },
                {
                  words:
                    "Unit Price \n@   ￥13,000\n@ ￥17,400 \n@ ￥11,000 \n@  Y30,900 \n@ Y20,300 \nC & F HongKong",
                  rows: [1],
                  columns: [3],
                },
                {
                  words:
                    "Amount \n￥13,000 \n￥139.200\n￥22.000 \n￥154.500 \n￥20.300 \n￥9,300 \n￥358.300",
                  rows: [1],
                  columns: [4],
                },
                {
                  words: "",
                  rows: [1],
                  columns: [5],
                },
              ],
            },
            {
              type: "text",
              words_block_count: 6,
              words_block_list: [
                {
                  words: "Country of Origin : Japan",
                },
                {
                  words: "WXTANABE ELPOTRION DOVSTRYOO.LTD",
                },
                {
                  words: "Ulatan aoc",
                },
                {
                  words: "COLCLE",
                },
                {
                  words: "Y.ISHIGE",
                },
                {
                  words: "ES20001-21 [05.03.01]",
                },
              ],
            },
          ],
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
        id: "",
        // splitRadio:"",
        value: "",
        splitAccess: "",
      },
      pinmingName: "",
      typeName: "",
    };
  },
  mounted() {
    this.getData();
    this.getTable();
  },
  methods: {
    getTable() {
      var mytable = document.getElementById("idTable");
      // console.log(mytable.rows.length);
      var data = [];
      for (var i = 0, rows = mytable.rows.length; i < rows; i++) {
        console.log(mytable.rows[i].cells);
        // console.log(mytable.rows.length)

        for (var j = 0, cells = mytable.rows[i].cells.length; j < cells; j++) {
          if (!data[i]) {
            data[i] = new Array();
          }
          data[i][j] = mytable.rows[i].cells[j].innerHTML;
        }
        console.log(data);

        return data;
      }
    },
    getData() {
      // GetOcrResult({
      //   EnclosureId: localStorage.getItem("pdfOcrId"),
      //   Pages: 1,
      // }).then((res) => {
      //   localStorage.setItem("templateId", res.result[0].operationRecord.id);
      //   this.dataList = JSON.parse(res.result[0].operationRecord.dataArchiving);
      //   console.log(this.dataList);

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
      // });
    },
    confirmDialog(val) {
      this.dataName = this.dataForm.correspondingValue;
      // console.log(this.dataForm);

      if (this.dataForm.distinguishType == 2) {
        if (val.correspondingField == 1) {
          val.correspondingValue = "品名";
        }
      }

      this.templateData.characteristics.push(val);

      // function unique(arr) {
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
            this.templateData.characteristics[i] ===
            this.templateData.characteristics[j]
          ) {
            this.templateData.characteristics.splice(j, 1);
            j--;
            len--;
          }
        }
      }
      return this.templateData.characteristics;
    },
    clickSpan(val) {
      this.dataForm = val;
      this.dialogVisible = {
        show: true,
        title: "模板",
      };
    },
    deleteSpan(index) {
      this.templateData.characteristics.splice(index, 1);
    },
    clickDiv(val, type, index, i) {
      this.dataIndex = index;
      this.dataI = i;

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
        id: "",
      };

      var curguid = "";
      for (var i = 1; i <= 32; i++) {
        var id = Math.floor(Math.random() * 16.0).toString(16);
        curguid += id;
        if (i == 8 || i == 12 || i == 16 || i == 20) curguid += "-";
      }

      this.dataForm.id = curguid;

      this.dataForm.region = index;
      this.dataForm.regionType = type;
      this.dataForm.accessValue = val;

      this.$refs.dialogTemplate.getEnumDictionary();
      this.dialogVisible = {
        show: true,
        title: "模板",
      };
    },
    clickTd(val, type, index, k, g, columns, rows) {
      // console.log(val);
      this.wordsType = type;

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
        id: "",
        // splitRadio:"",
        value: "",
        splitAccess: "",
      };

      var curguid = "";
      for (var i = 1; i <= 32; i++) {
        var id = Math.floor(Math.random() * 16.0).toString(16);
        curguid += id;
        if (i == 8 || i == 12 || i == 16 || i == 20) curguid += "-";
      }

      this.dataForm.id = curguid;

      this.dataForm.region = index;
      this.dataForm.regionType = type;
      this.dataForm.accessRow = rows.toString();
      this.dataForm.accessColumn = columns.toString();
      this.dataForm.value = val;
      this.dialogVisible = {
        show: true,
        title: "模板",
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
      var i = 0;
      this.templateData.characteristics.forEach((element) => {
        // console.log(element);
        if (element.distinguishType == 1) {
          i++;
        }
      });

      console.log(this.templateData.characteristics);

      // console.log(i);

      // if (i < 3) {
      //   // 型号  数量

      // }

      // GetOcrResult({
      //   EnclosureId: localStorage.getItem("pdfOcrId"),
      //   Pages: 1,
      // }).then((res) => {
      //   var list = JSON.parse(res.result[0].operationRecord.dataArchiving)
      //     .result.words_region_list;
      //   var arr = [];
      //   list.forEach((element, index) => {
      //     if (index == this.templateData.identificationArea) {
      //       element.words_block_list.forEach((item) => {
      //         element.words_block_list[0].rows.forEach((i) => {
      //           if (i == item.rows[0]) {
      //             arr.push(item);
      //           }
      //         });
      //       });
      //     }
      //   });

      //   this.templateData.tableHead = JSON.stringify(arr);

      //   CreateTemplate(this.templateData).then((res) => {
      //     this.$message({
      //       message: "模板保存成功",
      //       type: "success",
      //     });

      //     this.disabled = false;

      //     this.$router.push("/saveTemplate");
      //   });
      // });
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

.table_table {
  background: #ffffff;
}
</style>