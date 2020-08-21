<template>
  <div class="table_index">
    <el-container>
      <el-main style="width:70%">
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
                        @click="clickTd(data.words,items.type,index,k,g)"
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
      </el-aside>
    </el-container>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-form ref="dataForm" :model="dataForm" label-width="100px">
        <el-form-item size="small" label="文本内容：" prop="labelValue">
          <el-input v-model="dataForm.labelValue" placeholder="文本内容" disabled style="width: 57%;"></el-input>
        </el-form-item>

        <el-form-item size="small" label="识别类别：" prop="identifyCategories">
          <el-select v-model="dataForm.identifyCategories" placeholder="请选择">
            <el-option
              v-for="item in identifyCategoriesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <div @click="clickIdentifyCategories(item.id,item.name)">{{item.name}}</div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="accessFieldShow" size="small" label="取数字段：" prop="accessField">
          <el-select v-model="dataForm.accessField" placeholder="请选择">
            <el-option
              v-for="item in accessFieldList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="取数方式：" prop="accessMethod">
          <el-select v-model="dataForm.accessMethod" placeholder="请选择">
            <el-option
              v-for="item in accessMethodList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <div @click="clickAccessMethod(item.name)">{{item.name}}</div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="separatorShow"
          size="small"
          :label="separatorLabel + '：'"
          prop="separator"
        >
          <el-select v-model="dataForm.separator" placeholder="请选择">
            <el-option
              v-for="item in separatorList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <div @click="clickSeparator(item.name,item.id)">{{item.name}}</div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="splitAccessShow"
          size="small"
          :label="splitAccessLabel + '：'"
          prop="separator"
        >
          <!-- <el-select v-model="dataForm.splitAccess" placeholder="请选择">
            <el-option
              v-for="item in splitAccess"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option> 

          </el-select>-->

          <el-radio-group size="small" v-model="dataForm.splitAccess">
            <el-radio
              v-for="item in splitAccessList"
              :key="item"
              :label="item"
              name="checkPro"
            >{{item}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "tableIndex",
  data() {
    return {
      identifyCategoriesId: "",
      wordsType: "",
      dataIndex: "",
      dataI: "",
      wordsIndex: "",
      wordsK: "",
      wordsG: "",
      accessFieldShow: false,
      separatorLabel: "",
      separatorShow: false,
      splitAccessShow: false,
      splitAccessLabel: "",
      splitAccessList: "",
      dataForm: {
        labelValue: "",
        identifyCategories: "",
        accessField: "",
        accessMethod: "",
        separator: "",
        splitAccess: [],
      },
      identifyCategoriesList: [
        {
          keyId: "1",
          text: "模板识别",
        },
        {
          keyId: "2",
          text: "取数识别",
        },
      ],
      accessFieldList: [
        {
          text: "品名",
          keyId: "1",
        },
        {
          text: "型号",
          keyId: "2",
        },
        {
          text: "产地",
          keyId: "3",
        },
        {
          text: "品牌",
          keyId: "4",
        },
        {
          text: "数量",
          keyId: "5",
        },
        {
          text: "单价",
          id: "6",
        },
        {
          text: "金额",
          keyId: "7",
        },
        {
          text: "净重",
          keyId: "8",
        },
        {
          text: "毛重",
          keyId: "9",
        },
        {
          text: "箱重",
          keyId: "10",
        },
        {
          text: "客户料号",
          keyId: "11",
        },
      ],
      accessMethodList: [
        {
          keyId: "1",
          text: "分隔符",
        },
      ],
      separatorList: [
        {
          keyId: "1",
          text: "空格",
        },
        {
          keyId: "2",
          text: "换行",
        },
        {
          keyId: "3",
          text: "/",
        },
        {
          keyId: "4",
          text: "，",
        },
        {
          keyId: "5",
          text: "|",
        },
        {
          keyId: "6",
          text: "@",
        },
        {
          keyId: "7",
          text: "：",
        },
        {
          keyId: "8",
          text: "不分割",
        },
      ],
      splitAccess: [],
      choiceData: {
        // name:"模板识别"
        templateRecognition: "购销合同",
        accessRecognition: [
          {
            keyId: "1",
            name: "品名",
          },
          {
            keyId: "2",
            name: "品牌",
          },
          {
            keyId: "3",
            name: "单位",
          },
        ],
      },
      tdInnerHtml: "",
      selects: "",
      selectsName: "",
      RowIndex: "",
      CellIndex: "",
      dialogVisible: false,
      list: [],
      columnsLength: [],
      dataList: {
        result: {
          words_region_count: 3,
          words_region_list: [
            {
              type: "text",
              words_block_count: 22,
              words_block_list: [
                {
                  words: "购销合同",
                },
                {
                  words: "SALES CONTRACT",
                },
                {
                  words: "日期Date：2020-03-05",
                },
                {
                  words: "合同号：JK200300010",
                },
                {
                  words: "Contract No：JK200300010",
                },
                {
                  words: "买 方：测试客户GX002",
                },
                {
                  words: "实 方：测试客户GD001",
                },
                {
                  words: "Buyer：测试客户GX002",
                },
                {
                  words: "Seller：测试客户GD001",
                },
                {
                  words: "地址：",
                },
                {
                  words: "江西省南昌市南昌高新技术产业开发区紫阳大道1",
                },
                {
                  words: "地址：",
                },
                {
                  words: "RM601，6/F ALBION PLAZA,2-6 GRANYILLE ROAD",
                },
                {
                  words: "Address：",
                },
                {
                  words: "Address：",
                },
                {
                  words: "RM601，6/F ALBION PLAZA,2-6 GRANYILLE ROAD",
                },
                {
                  words: "电话Tel：0791-88301770",
                },
                {
                  words: "电话Tel：00852-88251228",
                },
                {
                  words: "传真Fax：",
                },
                {
                  words: "传真Fax：",
                },
                {
                  words:
                    "兹经买卖双方同意由卖方出售买方购进如下货物，并按下列条款签定本合同：",
                },
                {
                  words:
                    "This contract is mand between the Buyers aners, withe Buyers agree to buy and the Sellers agr",
                },
              ],
            },
            {
              type: "table",
              words_block_count: 132,
              words_block_list: [
                {
                  words: "序号\nNo.",
                  rows: [0, 1, 2],
                  columns: [0],
                },
                {
                  words: "货物品名及规格",
                  rows: [0],
                  columns: [1],
                },
                {
                  words: "数量",
                  rows: [0],
                  columns: [2],
                },
                {
                  words: "单位",
                  rows: [0],
                  columns: [3],
                },
                {
                  words: "单价",
                  rows: [0],
                  columns: [4],
                },
                {
                  words: "总价",
                  rows: [0],
                  columns: [5],
                },
                {
                  words: "品名 品牌 型号 \nDescription Brand specification",
                  rows: [1, 2],
                  columns: [1],
                },
                {
                  words: "Quantity",
                  rows: [1, 2],
                  columns: [2],
                },
                {
                  words: "tnit",
                  rows: [1, 2],
                  columns: [3],
                },
                {
                  words: "UnitPrice",
                  rows: [1],
                  columns: [4],
                },
                {
                  words: "Hawent",
                  rows: [1],
                  columns: [5],
                },
                {
                  words: "USD",
                  rows: [2],
                  columns: [4],
                },
                {
                  words: "USD",
                  rows: [2],
                  columns: [5],
                },
                {
                  words: "",
                  rows: [3],
                  columns: [0],
                },
                {
                  words: "集成电路 0NN FSUSB242LCXA",
                  rows: [3],
                  columns: [1],
                },
                {
                  words: "21000",
                  rows: [3],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [3],
                  columns: [3],
                },
                {
                  words: "1",
                  rows: [3],
                  columns: [4],
                },
                {
                  words: "21000",
                  rows: [3],
                  columns: [5],
                },
                {
                  words: "2",
                  rows: [4],
                  columns: [0],
                },
                {
                  words: "集成电路 AVINIC AW87318CSRA",
                  rows: [4],
                  columns: [1],
                },
                {
                  words: "423000",
                  rows: [4],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [4],
                  columns: [3],
                },
                {
                  words: "0.13736",
                  rows: [4],
                  columns: [4],
                },
                {
                  words: "58103.28",
                  rows: [4],
                  columns: [5],
                },
                {
                  words: "3",
                  rows: [5],
                  columns: [0],
                },
                {
                  words: "集成电路 AVINIC AW3643CSRA",
                  rows: [5],
                  columns: [1],
                },
                {
                  words: "297000",
                  rows: [5],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [5],
                  columns: [3],
                },
                {
                  words: "0.072922",
                  rows: [5],
                  columns: [4],
                },
                {
                  words: "21657.834",
                  rows: [5],
                  columns: [5],
                },
                {
                  words: "4",
                  rows: [6],
                  columns: [0],
                },
                {
                  words: "集成电路 AWINIC AW33905FCR",
                  rows: [6],
                  columns: [1],
                },
                {
                  words: "21000",
                  rows: [6],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [6],
                  columns: [3],
                },
                {
                  words: "0.55",
                  rows: [6],
                  columns: [4],
                },
                {
                  words: "11550",
                  rows: [6],
                  columns: [5],
                },
                {
                  words: "5",
                  rows: [7],
                  columns: [0],
                },
                {
                  words: "集成电路 AWINIC AW32905FCR",
                  rows: [7],
                  columns: [1],
                },
                {
                  words: "45000",
                  rows: [7],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [7],
                  columns: [3],
                },
                {
                  words: "0.086559",
                  rows: [7],
                  columns: [4],
                },
                {
                  words: "2995.155",
                  rows: [7],
                  columns: [5],
                },
                {
                  words: "6",
                  rows: [8],
                  columns: [0],
                },
                {
                  words: "贴片滤波器 WALSIN RFDIP2012090GM1T58",
                  rows: [8],
                  columns: [1],
                },
                {
                  words: "12000",
                  rows: [8],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [8],
                  columns: [3],
                },
                {
                  words: "0.024038",
                  rows: [8],
                  columns: [4],
                },
                {
                  words: "288.456",
                  rows: [8],
                  columns: [5],
                },
                {
                  words: "7",
                  rows: [9],
                  columns: [0],
                },
                {
                  words: "贴片滤波器 WALSIN RFDIPI608060TM7T62",
                  rows: [9],
                  columns: [1],
                },
                {
                  words: "4000",
                  rows: [9],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [9],
                  columns: [3],
                },
                {
                  words: "0.010302",
                  rows: [9],
                  columns: [4],
                },
                {
                  words: "41.208",
                  rows: [9],
                  columns: [5],
                },
                {
                  words: "8",
                  rows: [10],
                  columns: [0],
                },
                {
                  words: "贴片滤波器 WALSIN RFDIP2012090GM1T58",
                  rows: [10],
                  columns: [1],
                },
                {
                  words: "44000",
                  rows: [10],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [10],
                  columns: [3],
                },
                {
                  words: "0.23",
                  rows: [10],
                  columns: [4],
                },
                {
                  words: "10120",
                  rows: [10],
                  columns: [5],
                },
                {
                  words: "9",
                  rows: [11],
                  columns: [0],
                },
                {
                  words: "贴片滤波器 WALSIN RFDIP1005040L38QIC",
                  rows: [11],
                  columns: [1],
                },
                {
                  words: "84000",
                  rows: [11],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [11],
                  columns: [3],
                },
                {
                  words: "0.025048",
                  rows: [11],
                  columns: [4],
                },
                {
                  words: "2104.032",
                  rows: [11],
                  columns: [5],
                },
                {
                  words: "10",
                  rows: [12],
                  columns: [0],
                },
                {
                  words: "贴片滤波器 WALSIN RFBFF16081G9DMAT79",
                  rows: [12],
                  columns: [1],
                },
                {
                  words: "140000",
                  rows: [12],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [12],
                  columns: [3],
                },
                {
                  words: "0.017574",
                  rows: [12],
                  columns: [4],
                },
                {
                  words: "2480.36",
                  rows: [12],
                  columns: [5],
                },
                {
                  words: "11",
                  rows: [13],
                  columns: [0],
                },
                {
                  words: "贴片滤波器 WALSIN RFLPF10050G9DM1T76",
                  rows: [13],
                  columns: [1],
                },
                {
                  words: "24000",
                  rows: [13],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [13],
                  columns: [3],
                },
                {
                  words: "0.017675",
                  rows: [13],
                  columns: [4],
                },
                {
                  words: "424.2",
                  rows: [13],
                  columns: [5],
                },
                {
                  words: "12",
                  rows: [14],
                  columns: [0],
                },
                {
                  words: "贴片滤波器 WALSIN RFDIP1005040L38Q1C",
                  rows: [14],
                  columns: [1],
                },
                {
                  words: "32000",
                  rows: [14],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [14],
                  columns: [3],
                },
                {
                  words: "0.025048",
                  rows: [14],
                  columns: [4],
                },
                {
                  words: "801.536",
                  rows: [14],
                  columns: [5],
                },
                {
                  words: "13",
                  rows: [15],
                  columns: [0],
                },
                {
                  words: "声表滤波器 KYOCERA SD18-0847R8ULB1",
                  rows: [15],
                  columns: [1],
                },
                {
                  words: "27000",
                  rows: [15],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [15],
                  columns: [3],
                },
                {
                  words: "0.1212",
                  rows: [15],
                  columns: [4],
                },
                {
                  words: "3272.4",
                  rows: [15],
                  columns: [5],
                },
                {
                  words: "14",
                  rows: [16],
                  columns: [0],
                },
                {
                  words: "贴片滤波器 WALSIN RFBPF1608060K68Q1C",
                  rows: [16],
                  columns: [1],
                },
                {
                  words: "8000",
                  rows: [16],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [16],
                  columns: [3],
                },
                {
                  words: "0.01919",
                  rows: [16],
                  columns: [4],
                },
                {
                  words: "153.52",
                  rows: [16],
                  columns: [5],
                },
                {
                  words: "15",
                  rows: [17],
                  columns: [0],
                },
                {
                  words: "声表滤波曌 KYOCERA SQ25-1745K6SLA1",
                  rows: [17],
                  columns: [1],
                },
                {
                  words: "6000",
                  rows: [17],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [17],
                  columns: [3],
                },
                {
                  words: "0.8383",
                  rows: [17],
                  columns: [4],
                },
                {
                  words: "5029.8",
                  rows: [17],
                  columns: [5],
                },
                {
                  words: "16",
                  rows: [18],
                  columns: [0],
                },
                {
                  words: "热敏电阻 PANASOVIC ERTJZER104F",
                  rows: [18],
                  columns: [1],
                },
                {
                  words: "60000",
                  rows: [18],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [18],
                  columns: [3],
                },
                {
                  words: "0.003615",
                  rows: [18],
                  columns: [4],
                },
                {
                  words: "216.9",
                  rows: [18],
                  columns: [5],
                },
                {
                  words: "17",
                  rows: [19],
                  columns: [0],
                },
                {
                  words: "集成电路 AMS TSL25403",
                  rows: [19],
                  columns: [1],
                },
                {
                  words: "170000",
                  rows: [19],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [19],
                  columns: [3],
                },
                {
                  words: "0.202",
                  rows: [19],
                  columns: [4],
                },
                {
                  words: "34340",
                  rows: [19],
                  columns: [5],
                },
                {
                  words: "18",
                  rows: [20],
                  columns: [0],
                },
                {
                  words: "集成电路 FORESEF NCEMASLD-32G",
                  rows: [20],
                  columns: [1],
                },
                {
                  words: "18240",
                  rows: [20],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [20],
                  columns: [3],
                },
                {
                  words: "2.828",
                  rows: [20],
                  columns: [4],
                },
                {
                  words: "51582.72",
                  rows: [20],
                  columns: [5],
                },
                {
                  words: "19",
                  rows: [21],
                  columns: [0],
                },
                {
                  words: "集成电路 FORESEE NCIDXC1MC512M32",
                  rows: [21],
                  columns: [1],
                },
                {
                  words: "18000",
                  rows: [21],
                  columns: [2],
                },
                {
                  words: "个",
                  rows: [21],
                  columns: [3],
                },
                {
                  words: "7.272",
                  rows: [21],
                  columns: [4],
                },
                {
                  words: "130896",
                  rows: [21],
                  columns: [5],
                },
                {
                  words: "合计Total",
                  rows: [22],
                  columns: [0, 1],
                },
                {
                  words: "1454240.00",
                  rows: [22],
                  columns: [2],
                },
                {
                  words: "",
                  rows: [22],
                  columns: [3],
                },
                {
                  words: "",
                  rows: [22],
                  columns: [4],
                },
                {
                  words: "357037.40",
                  rows: [22],
                  columns: [5],
                },
              ],
            },
            {
              type: "text",
              words_block_count: 31,
              words_block_list: [
                {
                  words: "1.收货单位：",
                },
                {
                  words: "我的测试客户CT00004",
                },
                {
                  words: "consignec:",
                },
                {
                  words: "测试客户CT00004",
                },
                {
                  words: "2.运费：",
                },
                {
                  words: "3.保费",
                },
                {
                  words: "freight:",
                },
                {
                  words: "insurance",
                },
                {
                  words: "4.价格条款",
                },
                {
                  words: "FOB深圳",
                },
                {
                  words: "5.包装",
                },
                {
                  words: "Tertis：",
                },
                {
                  words: "Packing：",
                },
                {
                  words: "6.装运唛头",
                },
                {
                  words: "7.装运口岸",
                },
                {
                  words: "HOVGKOVG",
                },
                {
                  words: "Shipping Mark：",
                },
                {
                  words: "Departure：",
                },
                {
                  words: "8. 指运港",
                },
                {
                  words: "9.最迟装运日期",
                },
                {
                  words: "SHENZHEN",
                },
                {
                  words: "Latest Shipping",
                },
                {
                  words: "2020-03-12",
                },
                {
                  words: "Part of Discharge：",
                },
                {
                  words: "10.保险",
                },
                {
                  words: "卖方承付Paid by Seller",
                },
                {
                  words: "11.结汇方式",
                },
                {
                  words: "Insurance：",
                },
                {
                  words: "Term of Payment:",
                },
                {
                  words:
                    "12.质量、数量素赔：如交货质量不符，买方须于货物安装调试后30天内提出索赔：数量素赔须于货物到达目的港30天内提出。对由于",
                },
                {
                  words:
                    "days after the arrival of the goods at port of destination. It is understood that the Seller shall not be liabl",
                },
              ],
            },
          ],
        },
      },
    };
  },
  mounted() {
    this.getData();
    this.getTableData();
  },
  methods: {
    getData() {
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
          // console.log(elements)
          elements.words_block_list.forEach((element, i) => {
            element.id = element.rows[0] + [index];
            // console.log(element);
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

      // console.log(listData);
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
    confirm() {
      var wordsType;
      this.dialogVisible = false;
      this.dataList.result.words_region_list.forEach((elements, j) => {
        if (this.wordsType == "text") {
          if (this.dataIndex == j) {
            elements.words_block_list.forEach((element, k) => {
              if (this.dataI == k) {
                element.words =
                  document.getElementsByClassName(
                    "words_" + this.dataIndex + "_" + this.dataI
                  )[0].innerHTML + this.dataForm.accessField;
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
                      )[0].innerHTML + this.dataForm.accessField;
                  }
                });
              }
            });
          }
        }
      });

      if (this.wordsType == "text") {
        if (this.identifyCategoriesId == "1") {
          document.getElementsByClassName(
            "words_" + this.dataIndex + "_" + this.dataI
          )[0].innerHTML =
            document.getElementsByClassName(
              "words_" + this.dataIndex + "_" + this.dataI
            )[0].innerHTML +
            "<span class='confirm_content' style='color: #ffffff;background:#67C23A;border-radius: 50%;padding: 10px;'>" +
            this.dataForm.accessField +
            "</span>";
        }
        if (this.identifyCategoriesId == "2") {
          document.getElementsByClassName(
            "words_" + this.dataIndex + "_" + this.dataI
          )[0].innerHTML =
            document.getElementsByClassName(
              "words_" + this.dataIndex + "_" + this.dataI
            )[0].innerHTML +
            "<span class='confirm_content' style='color: #ffffff;background:#409EFF;border-radius: 50%;padding: 10px;'>" +
            this.dataForm.accessField +
            "</span>";
        }
      }
      if (this.wordsType == "table") {
        if (this.identifyCategoriesId == "1") {
          document.getElementsByClassName(
            "words_" + this.wordsIndex + "_" + this.wordsK + "_" + this.wordsG
          )[0].innerHTML =
            document.getElementsByClassName(
              "words_" + this.wordsIndex + "_" + this.wordsK + "_" + this.wordsG
            )[0].innerHTML +
            "<span class='confirm_content' style='color: #ffffff;background:#67C23A;border-radius: 50%;padding: 4px;margin-left: 10px;'>" +
            this.dataForm.accessField +
            "</span>";
        }
        if (this.identifyCategoriesId == "2") {
          document.getElementsByClassName(
            "words_" + this.wordsIndex + "_" + this.wordsK + "_" + this.wordsG
          )[0].innerHTML =
            document.getElementsByClassName(
              "words_" + this.wordsIndex + "_" + this.wordsK + "_" + this.wordsG
            )[0].innerHTML +
            "<span class='confirm_content' style='color: #ffffff;background:#409EFF;border-radius: 50%;padding: 4px;margin-left: 10px;'>" +
            this.dataForm.accessField +
            "</span>";
        }
      }
    },
    getTableData() {
      // debugger
      console.log("ssssssss");
      var tableInfo = "";
      var tableObj = document.getElementById("idTable");
      // console.log(tableObj.rows);
      for (var i = 0; i < tableObj.rows.length; i++) {
        //遍历Table的所有Row
        for (var j = 0; j < tableObj.rows[i].cells.length; j++) {
          //遍历Row中的每一列
          tableInfo += tableObj.rows[i].cells[j].innerText; //获取Table中单元格的内容
          tableInfo += "   ";
          console.log(tableInfo);
        }
        tableInfo += "\n";
      }
      // console.log(tableInfo);
      return tableInfo;
    },
    clickDiv(val, type, index, i) {
      this.dataIndex = index;
      this.dataI = i;
      this.dataForm.labelValue = val;
      this.wordsType = type;
      this.dialogVisible = true;
    },
    clickTd(val, type, index, k, g) {
      this.wordsIndex = index;
      this.wordsK = k;
      this.wordsG = g;
      this.dataForm.labelValue = val;
      this.wordsType = type;

      this.dialogVisible = true;
    },
    clickIdentifyCategories(id, val) {
      if (id == "2") {
        this.accessFieldShow = true;
      }
      if (id == "1") {
        this.accessFieldShow = false;
      }
      this.identifyCategoriesId = id;
    },
    clickAccessMethod(val) {
      this.separatorLabel = val;
      this.separatorShow = true;
    },
    clickSeparator(val, id) {
      if (id == "1") {
        this.splitAccessList = this.dataForm.labelValue.split(" ");
      }
      if (id == "2") {
        this.splitAccessList = this.dataForm.labelValue.split("/n");
      }
      if (id == "3") {
        this.splitAccessList = this.dataForm.labelValue.split("/");
      }
      if (id == "4") {
        this.splitAccessList = this.dataForm.labelValue.split(",");
      }
      if (id == "5") {
        this.splitAccessList = this.dataForm.labelValue.split("|");
      }
      if (id == "6") {
        this.splitAccessList = this.dataForm.labelValue.split("@");
      }
      if (id == "7") {
        this.splitAccessList = this.dataForm.labelValue.split(":");
      }
      if (id == "8") {
        this.splitAccessList = this.dataForm.labelValue.split("");
      }

      this.splitAccessLabel = val;
      this.splitAccessShow = true;
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
  /* display: inline-block; */
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
</style>