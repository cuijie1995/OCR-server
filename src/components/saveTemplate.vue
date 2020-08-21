<template>
  <div class="table_template">
    <div class="menu_item" v-if="tableShow" style="text-align: center;">
      <el-row>
        <el-col :span="21">
          <el-table :data="templateList" border fit highlight-current-row>
            <el-table-column :label="'品牌'" align="center" fixed>
              <template slot-scope="scope">
                <span>{{scope.row.Brand}}</span>
              </template>
            </el-table-column>

            <el-table-column :label="'型号'" width="200px" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.Spec}}</span>
              </template>
            </el-table-column>

            <el-table-column :label="'毛重'" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.GrossWeight}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="'净重'" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.NetWeight }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="'箱数'" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.NumberOfCases}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="'产地'" width="150px" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.Origin}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="'客户料号'" width="200px" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.PartNo}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="'单价'" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.Price}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="'品名'" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.ProductName}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="'数量'" align="center" fixed="right">
              <template slot-scope="scope">
                <span>{{scope.row.Quantity}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="3" v-if="templateList.length > 0">
          <el-button type="primary" @click="exportData()">导出</el-button>
          <el-button type="success" @click="importSystem()" style="margin-top: 10px;">导入系统</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { ExportExcel, ConfirmImport } from "../api/preview";
export default {
  props: {
    templateList: Array,
    tableShow: Boolean,
    page: Number,
  },
  data() {
    return { u8arr: "" };
  },
  methods: {
    exportData() {
      console.log(this.templateList);
      if (this.templateList != null) {
        this.templateList.forEach((element) => {
          console.log(element);
          element.opId = localStorage.getItem("urlId");
        });

        ExportExcel(this.templateList).then((res) => {
          console.log(res);

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
      } else {
        alert("暂无可以导出的数据");
      }
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
    importSystem() {
      console.log(this.templateList)
      if (this.templateList != null) {
        this.templateList.forEach((element) => {
          console.log(element);
          element.opId = localStorage.getItem("urlId");
          element.page = this.page;
        });
        ConfirmImport(this.templateList).then((res) => {
          console.log(res);
          this.$message({
            message: "数据导入成功",
            type: "success",
          });
        });
      } else {
        alert("暂无可以导入的数据");
      }
    },
  },
};
</script>


<style>
.menu_item .el-table td,
.menu_item .el-table th {
  padding: 5px 0 !important;
}
.menu_item .el-row {
  padding: 50px 10px 50px 20px;
}
.menu_item .el-button {
  padding: 8px 15px;
}

.menu_item .el-table__empty-block {
  background: #404040;
}

.menu_item .el-table .el-table__body tr.current-row > td {
  background-color: #000000 !important;
  /* color: red; */
}
</style>