<template>
  <div class="content">
    <div class="two">
      <div style="  margin-bottom: 5px;">
        <el-row style="padding-left: 2%;">
          <el-col :span="1">
            <i class="el-icon-folder-opened"></i>
          </el-col>
          <el-col :span="3" style=" margin-top: 2px;">
            <p sort="title" class="title">订单详情</p>
          </el-col>
        </el-row>
      </div>
      <div class="showProduct">
        <el-checkbox v-model="checked"></el-checkbox>
        {{checked}}
        <el-row :gutter="20">
          <el-col :span="24">
            <el-table :data="orderDetails" border style="width: 100%" @cell-click="handle">
              <el-table-column fixed prop="spec" label="型号" width="160">
                <template slot-scope="{row,$index}">
                  <el-input
                    placeholder="请输入型号"
                    type="textarea"
                    slot="reference"
                    v-model="row.spec"
                    class="aaa"
                    @keydown.ctrl.86.native="stick"
                  ></el-input>
                  <!-- <el-input id="textarea" type="textarea" placeholder="请输入型号" v-model="value" @keydown.ctrl.86.native="paste">
                  </el-input>-->
                </template>
              </el-table-column>
              <el-table-column fixed prop="productName" label="品名" width="160">
                <template slot-scope="{row,$index}">
                  <el-input
                    placeholder="请输入名称"
                    type="textarea"
                    slot="reference"
                    v-model="row.productName"
                    class="input"
                    @keydown.ctrl.86.native="stick"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="brand" label="品牌" width="160">
                <template slot-scope="{row,$index}">
                  <el-input
                    placeholder="请输入品牌"
                    type="textarea"
                    slot="reference"
                    v-model="row.brand"
                    @keydown.ctrl.86.native="stick"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="origin" label="产地" width="160">
                <template slot-scope="{row}">
                  <el-input
                    placeholder="请输入产地"
                    type="textarea"
                    slot="reference"
                    v-model="row.origin"
                    @keydown.ctrl.86.native="stick"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop=" unit" label="单位" width="160">
                <template slot-scope="{row}">
                  <el-input
                    placeholder="请输入单位"
                    type="textarea"
                    slot="reference"
                    v-model="row.unit"
                    @keydown.ctrl.86.native="stick"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-button type="primary" style="margin-top: 15px;margin-left: 20px;" @click="addRow">增加一行</el-button>
      </div>
    </div>

    <el-input
      id="textarea"
      type="textarea"
      placeholder="请输入型号"
      v-model="value"
      @keydown.ctrl.86.native="paste"
    ></el-input>
  </div>
</template>
<script>
import $ from "jquery";

let self;
let that;

export default {
  data() {
    return {
      value: "",
      // 第一部分表单
      orderDetails: [
        {
          spec: "",
          productName: "",
          brand: "",
          origin: "",
          unit: ""
        }
      ],
      textarea: "",
      checked: true
    };
  },
  mounted() {
    self = this;
  },
  methods: {
    // 增加一行
    addRow() {
      self.orderDetails.push({
        spec: "",
        productName: "",
        brand: "",
        origin: "",
        unit: ""
      });
    },
    paste(obj) {
      // setTimeout(() => {
      $("#textarea").on("textInput", function(event) {
        // console.log($('.input').val())

        $("#textarea").bind("input propertychange", function() {
          var str1 = $(this).val();
          var rowList = str1.split("\n");
          console.log(str1);
          console.log(rowList);
          var trStr;

          //从excle表格中复制的数据，最后一行为空行，因此无需对len数组中最后的元素进行处理
          for (var i = 0; i < rowList.length - 1; i++) {
            //excel表格同一行的多个cell是以空格分割的，此处以空格为单位对字符串做拆分操作
            trStr = rowList[i].split(/\s+/);

            self.addRow();

            self.orderDetails[i].spec = trStr[0];
            self.orderDetails[i].productName = trStr[1];
            self.orderDetails[i].brand = trStr[2];
            self.orderDetails[i].origin = trStr[3];
            self.orderDetails[i].unit = trStr[4];
          }

          var order = self.orderDetails.pop();
          var row = rowList.pop();

          // $('#textarea').hide()
          // $(".input").show()
          return false;
        });
      });
      // }, 50)
    },
    stick(event) {
      that = this;
    },
    handle(row, column, event, cell) {
      setTimeout(() => {
        //   debugger

        var str1 = row.spec;
        var rowList1 = str1.split("\n");
        var str2 = row.productName;
        var rowList2 = str2.split("\n");
        var str3 = row.brand;
        var rowList3 = str3.split("\n");
        var str4 = row.origin;
        var rowList4 = str4.split("\n");
        var str5 = row.unit;
        var rowList5 = str5.split("\n");

        var trStr1, trStr2, trStr3, trStr4, trStr5;

        if (rowList1.length > 1) {
          for (var i = 0; i < rowList1.length - 1; i++) {
            trStr1 = rowList1[i].split(/\s+/);
            self.addRow();

            self.orderDetails[i].spec = trStr1[0];
            self.orderDetails[i].productName = trStr1[1];
            self.orderDetails[i].brand = trStr1[2];
            self.orderDetails[i].origin = trStr1[3];
            self.orderDetails[i].unit = trStr1[4];
          }

          var order = self.orderDetails.pop();
          var row1 = rowList1.pop();

          return false;
        }
        if (rowList2.length > 1) {
          for (var i = 0; i < rowList2.length - 1; i++) {
            trStr2 = rowList2[i].split(/\s+/);
            self.addRow();

            self.orderDetails[i].productName = trStr2[0];
            self.orderDetails[i].brand = trStr2[1];
            self.orderDetails[i].origin = trStr2[2];
            self.orderDetails[i].unit = trStr2[4];
          }

          var order = self.orderDetails.pop();
          var row2 = rowList2.pop();

          return false;
        }
        if (rowList3.length > 1) {
          for (var i = 0; i < rowList3.length - 1; i++) {
            trStr3 = rowList3[i].split(/\s+/);
            self.addRow();

            self.orderDetails[i].brand = trStr3[0];
            self.orderDetails[i].origin = trStr3[1];
            self.orderDetails[i].unit = trStr3[2];
          }

          var order = self.orderDetails.pop();
          var row3 = rowList3.pop();

          return false;
        }
        if (rowList4.length > 1) {
          for (var i = 0; i < rowList4.length - 1; i++) {
            trStr4 = rowList4[i].split(/\s+/);
            self.addRow();

            self.orderDetails[i].origin = trStr4[0];
            self.orderDetails[i].unit = trStr4[1];
          }

          var order = self.orderDetails.pop();
          var row4 = rowList4.pop();

          return false;
        }
        if (rowList5.length > 1) {
          for (var i = 0; i < rowList5.length - 1; i++) {
            trStr5 = rowList5[i].split(/\s+/);
            self.addRow();

            self.orderDetails[i].unit = trStr5[0];
          }

          var order = self.orderDetails.pop();
          var row5 = rowList5.pop();

          return false;
        }
      }, 700);
    }
  }
};
</script>
<style scoped>
.content {
  padding-top: 25px;
}

.content .title {
  color: #000000;
  font-weight: 800;
  font-size: 16px;
}

.two {
  margin-bottom: 50px;
}

.el-input {
  width: 60%;
}

.el-textarea {
  width: 100%;
  /* position: absolute;
        top: 21%;
        left: 1%;
        z-index: 100; */
}

.el-table .el-input {
  width: 100%;
}

.el-form-item {
  margin-bottom: 15px !important;
}

.el-input {
  height: 30px;
}

i {
  margin-top: 0 !important;
}
</style>
<style lang="scss">
.content {
  .el-form-item__content {
    margin-left: 0 !important;
    height: 30px;
    line-height: 30px;
  }

  .el-form-item__label {
    width: 120px !important;
    line-height: 30px;
    color: #495060;
  }

  input.el-input__inner {
    height: 30px;
    line-height: 30px;
  }

  .el-table td,
  .el-table th.is-leaf {
    text-align: center;
  }

  .el-textarea__inner {
    line-height: 20px;
    height: 20px;
  }

  textarea::-webkit-input-placeholder {
    font-size: 10px;
  }

  textarea::-moz-placeholder {
    font-size: 10px;
  }

  textarea:-moz-placeholder {
    font-size: 10px;
  }

  textarea:-ms-input-placeholder {
    font-size: 10px;
  }
}
</style>