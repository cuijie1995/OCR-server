<template>
  <div>
    <el-dialog
      :title="dialogVisible.title"
      :visible.sync="dialogVisible.show"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-form ref="dataForm" :model="dataForm" label-width="120px">
        <el-form-item size="small" label="文本内容：" prop="value">
          <el-input v-model="dataForm.value" placeholder="文本内容" disabled style="width: 57%;"></el-input>
        </el-form-item>

        <el-form-item size="small" label="识别类别：" prop="identifyCategories">
          <el-select v-model="dataForm.distinguishType" placeholder="请选择">
            <el-option
              v-for="item in identifyCategoriesList"
              :key="item.keyId"
              :label="item.text"
              :value="item.keyId"
            >
              <div @click="clickIdentifyCategories(item.keyId,item.text)">{{item.text}}</div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="accessFieldShow" size="small" label="取数字段：" prop="accessField">
          <el-select v-model="dataForm.correspondingField" placeholder="请选择">
            <el-option
              v-for="item in accessFieldList"
              :key="item.keyId"
              :label="item.text"
              :value="item.keyId"
            >
              <div @click="clickAccess(item.keyId,item.text)">{{item.text}}</div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item size="small" label="数据分割方式：" prop="separator">
          <el-select v-model="dataForm.accessMethod" placeholder="请选择">
            <el-option
              v-for="item in separatorList"
              :key="item.keyId"
              :label="item.text"
              :value="item.keyId"
            >
              <div @click="clickSeparator(item.text,item.keyId)">{{item.text}}</div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          size="small"
          :label="splitAccessLabel + '：'"
          prop="splitAccess"
          v-if="dialogVisible.radioShow"
        >
          <el-radio-group size="small" v-model="dataForm.splitAccess" @change="clickSplit">
            <el-radio
              v-for="(item,index) in splitAccessList"
              :key="index"
              :label="item"
              name="checkPro"
              @change="clickRadio(item,index)"
            >
              <span @click="clickItem(item,index)">{{item}}</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 取数显示 -->
        <el-form-item
          size="small"
          label="是否识别表头："
          prop="isCheckHead"
          v-if="dialogVisible.tableShow"
        >
          <el-radio-group v-model="dataForm.isCheckHead">
            <el-radio v-model="radio" :label="true">是</el-radio>
            <el-radio v-model="radio" :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.show = false">取 消</el-button>
        <el-button type="primary" @click="confirmDialog">确 定</el-button>
      </span>
    </el-dialog>
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

export default {
  props: {
    dialogVisible: Object,
    dataForm: Object,
  },
  data() {
    return {
      radio: true,
      accessFieldShow: false,
      separatorLabel: "",
      separatorShow: false,
      splitAccessShow: false,
      splitAccessLabel: "不分割",
      splitAccessList: "",
      identifyCategoriesList: [
        // {
        //   keyId: 1,
        //   text: "模板识别",
        // },
        // {
        //   keyId: 2,
        //   text: "取数识别",
        // },
      ],
      accessFieldList: [
        // {
        //   text: "品名",
        //   keyId: 1,
        // },
        // {
        //   text: "型号",
        //   keyId: 2,
        // },
        // {
        //   text: "产地",
        //   keyId: 3,
        // },
        // {
        //   text: "品牌",
        //   keyId: 4,
        // },
        // {
        //   text: "数量",
        //   keyId: 5,
        // },
        // {
        //   text: "单价",
        //   id: 6,
        // },
        // {
        //   text: "金额",
        //   keyId: 7,
        // },
        // {
        //   text: "净重",
        //   keyId: 8,
        // },
        // {
        //   text: "毛重",
        //   keyId: 9,
        // },
        // {
        //   text: "箱重",
        //   keyId: 10,
        // },
        // {
        //   text: "客户料号",
        //   keyId: 11,
        // },
      ],
      separatorList: [
        // {
        //   keyId: 1,
        //   text: "空格",
        // },
        // {
        //   keyId: 2,
        //   text: "换行",
        // },
        // {
        //   keyId: 3,
        //   text: "/",
        // },
        // {
        //   keyId: 4,
        //   text: "，",
        // },
        // {
        //   keyId: 5,
        //   text: "|",
        // },
        // {
        //   keyId: 6,
        //   text: "@",
        // },
        // {
        //   keyId: 7,
        //   text: "：",
        // },
        // {
        //   keyId: 8,
        //   text: "不分割",
        // },
      ],
      splitAccess: [],
    };
  },
  mounted() {},
  methods: {
    getEnumDictionary() {
      // this.dataForm.accessValue = this.dataForm.value;
      // this.splitAccessList = this.dataForm.accessValue.split(",");
      this.accessFieldShow = false;

      getDistinguishTypeEnum().then((res) => {
        this.identifyCategoriesList = res.result;
      });
      getAccessMethodEnum().then((res) => {
        this.separatorList = res.result;
      });
      getCorrespondingFieldEnum().then((res) => {
        this.accessFieldList = res.result;
      });
    },
    clickIdentifyCategories(id, val) {
      if (id == 2) {
        this.accessFieldShow = true;
        this.dialogVisible.tableShow = true;
      }
      if (id == 1) {
        this.accessFieldShow = false;
        this.dialogVisible.tableShow = false;
      }
    },
    clickAccessMethod(val) {
      this.separatorLabel = val;
      this.separatorShow = true;
    },
    clickSeparator(val, id) {
      this.dialogVisible.radioShow = true;
      if (id == 1) {
        this.dataForm.accessValue = this.dataForm.value;
      }
      if (id == 2) {
        this.splitAccessList = this.dataForm.value.split(" ");
      }
      if (id == 3) {
        this.splitAccessList = this.dataForm.value.split("\n");
      }
      if (id == 4) {
        this.splitAccessList = this.dataForm.value.split("/");
      }
      if (id == 5) {
        this.splitAccessList = this.dataForm.value.split(",");
      }
      if (id == 6) {
        this.splitAccessList = this.dataForm.value.split("|");
      }
      if (id == 7) {
        this.splitAccessList = this.dataForm.value.split("@");
      }
      if (id == 8) {
        this.splitAccessList = this.dataForm.value.split(":");
      }

      this.splitAccessLabel = val;

      this.splitAccessShow = true;
    },
    clickItem(val, index) {
      this.dataForm.accessValue = val;
      this.dataForm.accessParagraph = index;
    },
    clickAccess(id, val) {
      this.dataForm.correspondingValue = val;
    },
    confirmDialog() {
      if (this.dataForm.accessMethod == 1) {
        this.dataForm.accessValue = this.dataForm.value;
      } else {
        this.dataForm.accessValue = this.dataForm.splitAccess;
      }
      // this.dataForm.accessValue = this.dataForm.splitAccess;
      console.log(this.dataForm);
      this.$emit("confirmDialog", this.dataForm);

      this.dialogVisible.show = false;
    },
    clickSplit(val) {
      // console.log(val);
    },
    clickRadio(val, index) {
      this.dataForm.accessValue = val;
      this.dataForm.accessParagraph = index;
    },
  },
};
</script>
