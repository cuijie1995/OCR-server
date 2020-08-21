<template>
  <div class="preview">
    <div class="preview_header">
      <el-row>
        <el-col :span="8">
          <el-button icon="iconfont icon-zhedie" title="Toggle Sidebar" @click="clickZhedie()"></el-button>

          <el-popover placement="bottom" trigger="click" popper-class="header_left">
            <el-input />
            <el-button icon="iconfont icon-jiantouarrow506" style="color: #ffffff;" />
            <span>|</span>
            <el-button icon="iconfont icon-jiantouarrow484" style="color: #ffffff;" />
            <el-checkbox-group size="small" v-model="checkData" style="display: inline;">
              <el-checkbox
                v-for="item in checkList"
                :key="item.id"
                :label="item.name"
                name="checkPro"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
            <el-button
              icon="iconfont icon-sousuo"
              title="Find in Document"
              slot="reference"
              style="margin-left: 30px;"
            ></el-button>
          </el-popover>
          <el-button
            icon="iconfont icon-shangyi"
            :disabled="disabledPreviousPage"
            title="Previous Page"
            @click="previousPage()"
          ></el-button>
          <span>|</span>
          <el-button
            icon="iconfont icon-xiayi"
            title="Next Page"
            :disabled="disabledNextPage"
            @click="nextPage()"
          ></el-button>
          <el-input title="Page" v-model="pageNum" type="number" @change="changeInput(pageNum)" />
          <span class="page_size">of {{pageList}}</span>

          <el-button
            icon="el-icon-refresh"
            title="转换数据"
            style="margin-left: 20px;"
            @click="clickRefresh()"
          ></el-button>
        </el-col>
        <el-col :span="8" style="text-align: center;">
          <el-button icon="iconfont icon-jian" title="Zoom Out" @click="clickReduce()"></el-button>
          <span>|</span>
          <el-button icon="iconfont icon-jia" title="Zoom In" @click="clickPlus()"></el-button>
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
              <div @click="clickZoom(item.id,item.name)">{{item.name}}</div>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8" style="text-align: right;">
          <el-button icon="iconfont icon-quanping" title="全屏" @click="clickEsc()"></el-button>
          <!-- <el-button icon="iconfont icon-shangchuan" title="Open File" @click="uploadPdf()"></el-button> -->

          <el-upload
            class="upload-demo"
            action="2222"
            :multiple="true"
            :auto-upload="false"
            :before-upload="doUploads"
            :on-change="handleChange"
            :file-list="fileList"
            name="file"
            :show-file-list="false"
            title="Open File"
          >
            <div class="plus">
              <i class="iconfont icon-shangchuan"></i>
            </div>
          </el-upload>
          <el-button icon="iconfont icon-xiazai" title="Download"></el-button>
          <span>|</span>

          <el-popover placement="bottom" trigger="click" popper-class="header_right">
            <ul>
              <li title="Go to First Page" @click="goFirst()">
                <i class="iconfont icon-shangyi" />
                <span class="li_content">Go to First Page</span>
              </li>
              <li title="Go to Last Page" @click="goLast()">
                <i class="iconfont icon-xiayi" />
                <span class="li_content">Go to Last Page</span>
              </li>
              <li title="Rotate Clockwise" @click="goRotate()">
                <i class="iconfont icon-shuaxin" />
                <span class="li_content">Rotate Clockwise</span>
              </li>
              <li title="Rotate Counterclockwise">
                <i class="iconfont icon-shuaxin2" />
                <span class="li_content">Rotate Counterclockwise</span>
              </li>
              <li title="Enable Text Selection Tool">
                <i class="iconfont icon-shubiaojiantou" />
                <span class="li_content">Text Selection Tool</span>
              </li>
              <li title="Enable Hand Tool">
                <i class="iconfont icon-shou" />
                <span class="li_content">Hand Tool</span>
              </li>

              <li title="Do not join page spreads">
                <i class="icon-fangkuang" />
                <span class="li_content">No Spreads</span>
              </li>
            </ul>
            <el-button icon="iconfont icon-jiantouyou" title="Tools" slot="reference"></el-button>
          </el-popover>
        </el-col>
      </el-row>
    </div>
    <div class="preview_ccontent">
      <el-container>
        <el-aside id="content_side" width="195px">
          <div class="content_img">
            <div class="small_image">
              <div class="pdfList_small" @click="clickSmall"></div>
            </div>
          </div>
        </el-aside>
        <el-main id="content_main">
          <div id="img_big">
            <div class="pdfList"></div>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
 <script>
let self;
import { UploadIForma, GetEnclosure, GetOcrResult } from "../api/preview";
import pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default {
  data() {
    return {
      options: [
        // {
        //   id: "1",
        //   name: "Automatic Zoom",
        // },
        // {
        //   id: "2",
        //   name: "Actual Size",
        // },
        // {
        //   id: "3",
        //   name: "Page Fit",
        // },
        // {
        //   id: "4",
        //   name: "Page Width",
        // },
        {
          id: "5",
          name: "50%",
        },
        {
          id: "6",
          name: "75%",
        },
        {
          id: "7",
          name: "100%",
        },
        {
          id: "8",
          name: "125%",
        },
        {
          id: "9",
          name: "150%",
        },
        {
          id: "10",
          name: "200%",
        },
        {
          id: "11",
          name: "300%",
        },
        {
          id: "12",
          name: "400%",
        },
      ],
      value: "7",
      checkList: [
        {
          id: "1",
          name: "Highlight all",
        },
        {
          id: "2",
          name: "Match case",
        },
        {
          id: "3",
          name: "Whole words",
        },
      ],
      checkData: [],
      imgList: [],
      imgBig: [],
      pageList: "",
      active: 0,
      pageNum: "0",
      isFullScren: false,
      disabledPreviousPage: false,
      disabledNextPage: false,

      pdfUrl: "", // 这里是pdf文件地址，后台给的流文件请求地址也是可以的
      pdfDoc: null, // pdfjs 生成的对象
      pageNum: 0, //
      fileList: [],
      pdfId: "",
      rd1: "",
    };
  },
  mounted() {
    self = this;
    self.pageList = self.imgList.length;

    self.getUrl();

    let isFullscreen =
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.fullScreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen;
    isFullscreen = !!isFullscreen;
    let that = this;
    document.addEventListener("fullscreenchange", () => {
      that.isFullScren = !that.isFullScren;
    });
    document.addEventListener("mozfullscreenchange", () => {
      that.isFullScren = !that.isFullScren;
    });
    document.addEventListener("webkitfullscreenchange", () => {
      that.isFullScren = !that.isFullScren;
    });
    document.addEventListener("msfullscreenchange", () => {
      that.isFullScren = !that.isFullScren;
    });

    $("#content_main").scroll(function () {
      //页面加载时，获取滚动条初始高度
      var distance = $("#content_main").scrollTop(); //获取滚动条初始高度的值 ：0

      var str = distance / 788;

      var target = document.getElementById("content_side");

      self.active = Math.trunc(str);
      self.pageNum = Math.trunc(str) + 1;

      target.scrollTop = self.active * 140 + self.active * 16;
    });
  },
  methods: {
    getUrl() {
      self.pdfUrl = localStorage.getItem("pdfUrl");

      var i = 1;
      self.pageNum = i;
      localStorage.setItem("page", i);

      self.showPdf();
    },
    clickZhedie() {
      // var side = document.getElementById("content_side");
      // if (side.offsetWidth == 1) {
      //   side.setAttribute("style", "width: 200px !important");
      // } else {
      //   side.setAttribute("style", "width: 1px !important");
      // }
    },
    clickImg(index) {
      self.active = index;
      self.pageNum = index + 1;

      var target = document.getElementById("content_main");
      target.scrollTop = self.active * 788 + self.active * 40;
    },
    clickSmall() {},
    // 缩小
    clickReduce() {
      var width = $(".canvas").css("width");
      width = parseInt(width);
      var percentage = 0.8;
      var breadth = width * percentage;
      breadth = breadth + "px";
      $(".canvas").css("width", breadth);
    },
    // 放大
    clickPlus() {
      var width = $(".canvas").css("width");
      width = parseInt(width);
      var percentage = 1.2;
      var breadth = width * percentage;
      breadth = breadth + "px";
      $(".canvas").css("width", breadth);
    },
    // 选择框倍数
    clickZoom(id, name) {
      var width = "609px";
      width = parseInt(width);
      var percentage;
      if (id == 5) {
        percentage = 0.5;
      }
      if (id == 6) {
        percentage = 0.75;
      }
      if (id == 7) {
        percentage = 1;
      }
      if (id == 8) {
        percentage = 1.25;
      }
      if (id == 9) {
        percentage = 1.5;
      }
      if (id == 10) {
        percentage = 2;
      }
      if (id == 11) {
        percentage = 3;
      }
      if (id == 12) {
        percentage = 4;
      }

      var breadth = width * percentage;
      breadth = breadth + "px";
      $(".canvas").css("width", breadth);
    },
    // 输入框选择第几页
    changeInput(value) {
      self.active = value - 1;
      var side = document.getElementsByClassName("active_item");

      var target = document.getElementById("content_side");
      target.scrollTop = self.active * 140 + self.active * 16;

      var el = document.getElementById("content_main");
      el.scrollTop = self.active * 788 + self.active * 40;
    },
    // 全屏
    clickEsc() {
      // let el = document.documentElement;
      let el = document.getElementById("img_big");
      if (self.isFullScren) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (el.requestFullscreen) {
          el.requestFullscreen();
        } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen();
        } else if (el.webkitRequestFullScreen) {
          el.webkitRequestFullScreen();
        } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen();
        }
      }
    },
    // 上一页
    previousPage() {
      if (self.pageNum == 1) {
        alert("已经是第一张了哦");
        self.disabledPreviousPage = true;
      } else {
        self.active = self.pageNum--;
      }
    },
    // 下一页
    nextPage() {
      if (self.pageNum == self.pageList) {
        alert("已经是最后一张了哦");
        self.disabledNextPage = true;
      } else {
        self.active = self.pageNum++;
      }
    },
    clickRefresh() {
      // localStorage.setItem("pdfOcrId", this.pdfId);
      self.$router.push("/TableIndex");
    },
    // 跳转到第一页
    goFirst() {
      self.active = 0;
      self.pageNum = 1;

      var target = document.getElementById("content_side");

      var el = document.getElementById("content_main");
      target.scrollTop = self.active * 140 + self.active * 16;
      el.scrollTop = self.active * 788 + self.active * 40;
    },
    //跳转到最后一页
    goLast() {
      self.active = self.pageList - 1;
      self.pageNum = self.pageList;

      var target = document.getElementById("content_side");

      var el = document.getElementById("content_main");
      target.scrollTop = self.active * 140 + self.active * 16;
      el.scrollTop = self.active * 788 + self.active * 40;
    },
    goRotate() {
      console.log("11111111111111");
      // debugger;
      var num = 90;
      // num++;
      // // content_main
      // $("#content_main").rotate(90 * num);
      // // $(".small_image").rotate(90 * num);

      // // $(".small_image").rotate(90 * num);

      // // big_item

      // r += 90;

      $(".small_image").css("transform", "rotate(" + num + "deg)");
      $(".big_item").css("transform", "rotate(" + num + "deg)");
      num = num + 90;
      console.log(num);
    },
    doUploads(files) {},
    handleChange(file, fileList) {
      const formData = new FormData();
      formData.append("files", file.raw);

      UploadIForma(formData).then((res) => {
        this.pdfId = res.result.enclosures[0].id;
        localStorage.setItem("pdfOcrId", res.result.enclosures[0].id);

        var canvasSmall = document.getElementsByTagName("canvas");
        // var input = document.getElementsByClassName("inputClass");
        // console.log(input);
        canvasSmall.forEach((element) => {
          element.setAttribute("style", " display: none;");
        });
        // input.forEach((element) => {
        //   element.setAttribute("style", " display: none;");
        // });

        localStorage.removeItem("pdfUrl");
        GetEnclosure({
          id: res.result.enclosures[0].id,
        }).then((response) => {
          // this.pdfUrl = "data:application/pdf;base64," + response.result;

          this.pdfUrl = response.result;

          localStorage.setItem("pdfUrl", response.result);

          this.showPdf();
        });
      });
    },
    clickName() {
      alert("111111111111111");
    },
    showPdf() {
      let pdfList = document.querySelector(".pdfList");
      let pdfListSmall = document.querySelector(".pdfList_small");

      let base64 = this.pdfUrl; //获得bas464编码
      let decodedBase64 = window.atob(base64); //使用浏览器自带的方法解码

      pdfjs.getDocument({ data: decodedBase64 }).promise.then(function (pdf) {
        let pages = pdf.numPages; //声明一个pages变量等于当前pdf文件的页数
        self.pageList = pdf.numPages;

        for (let i = 1; i <= pages; i++) {
          let canvas = document.createElement("canvas");
          let canvasSmall = document.createElement("canvas");

          // let input = document.createElement("input");
          // input.setAttribute("type", "radio");
          // echkbox.setAttribute("checked", "checked");

          // let input = document.createElement(
          //   "<input type=''radio' name='rd1' @change='clickName()'/>"
          // );

          pdf.getPage(i).then(function (page) {
            let scale = 1; //缩放倍数，1表示原始大小
            let viewport = page.getViewport({
              scale: scale,
              cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.2.228/cmaps/",
              cMapPacked: true,
            });
            let scaleSmall = 1;
            let viewportSmall = page.getViewport({
              scale: scaleSmall,
              cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.2.228/cmaps/",
              cMapPacked: true,
            });
            let context = canvas.getContext("2d"); //创建绘制canvas的对象
            let contextSmall = canvasSmall.getContext("2d"); //创建绘制canvas的对象

            canvas.height = viewport.height; //定义canvas高和宽
            canvas.width = viewport.width;

            canvasSmall.height = viewportSmall.height; //定义canvas高和宽
            canvasSmall.width = viewportSmall.width;
            let renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            let renderContextSamall = {
              canvasContext: contextSmall,
              viewport: viewportSmall,
            };
            page.render(renderContext);
            page.render(renderContextSamall);

            canvas.className = "canvas";
            canvasSmall.className = "canvasSmall";
            // input.className = "inputClass";

            // input.value = i;

            pdfList.appendChild(canvas);

            pdfListSmall.appendChild(canvasSmall);

            canvasSmall.onclick = function () {
              self.pageNum = i;
              localStorage.setItem("page", i);

              // self.active = index;
              // self.pageNum = index + 1;
              var j = i - 1;

              var target = document.getElementById("content_main");
              target.scrollTop = j * 788 + j * 40;

              // console.log(canvasSmall);
              var smallCanvas = document.getElementsByTagName("canvas");
              // var input = document.getElementsByClassName("inputClass");
              // console.log(input);
              smallCanvas.forEach((element, index) => {
                if (index + 1 == i) {
                  element.setAttribute("class", "canvasSmall active_item");
                }
              });
              // .active_item
            };

            // pdfListSmall.appendChild(input);
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.preview {
  background: rgba(64, 64, 64, 1);
  width: 100%;
  height: 100%;
}
.preview_header {
  width: 100%;
  height: 32px;
  background: rgba(71, 71, 71, 1);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.15),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05), 0 1px 0 rgba(0, 0, 0, 0.15),
    0 1px 1px rgba(0, 0, 0, 0.1);
}
.el-col-8 {
  height: 32px;
  line-height: 32px;
}
.el-button {
  padding: 2px 10px;
  background: transparent;
  border: none;
}
.el-button + .el-button {
  margin-left: 0;
}
.el-input {
  width: 100px;
}
.page_size {
  color: #ffffff;
}

.preview_ccontent {
  width: 100%;
  height: calc(100% - 32px);
}
.el-container {
  width: 100%;
  height: 100%;
}
.el-aside {
  height: 100%;
  // width: 0 !important;
  border-right: 1px solid rgba(51, 51, 51, 1);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.25),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05), 0 1px 0 rgba(0, 0, 0, 0.15),
    0 0 1px rgba(0, 0, 0, 0.1);
  padding-top: 20px;
}
.el-main {
  height: 100%;
  padding: 0;
}

.img_item {
  width: 110px;
  height: 140px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  margin-left: 48px;
  margin-bottom: 10px;
  padding-top: 6px;
}
.img_item:hover {
  background-color: rgba(255, 255, 255, 0.3);
  background-image: linear-gradient(
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0)
  );
  background-clip: padding-box;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.05) inset,
    0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 1px rgba(0, 0, 0, 0.2);
}
</style>

<style lang="scss" scoped>
.img_big {
  width: 100%;
  text-align: center;
  padding: 20px;

  // div {
  // }
}
#img_big {
  overflow-y: auto;
}
</style>
<style lang="scss">
/* // 处理input type = number的上下箭头 */
.preview_header {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
}
// ::-webkit-scrollbar {
//   display: none;
// }

i.el-icon-refresh {
  color: #ffffff;
  font-size: 16px;
}
</style>





<style lang="scss">
.preview {
  .canvasSmall {
    width: 98px !important;
    height: 126px !important;
    cursor: pointer;
  }
  .active_item {
    border: rgba(255, 255, 255, 0.3) 4px solid;
    // background-image: linear-gradient(
    //   rgba(255, 255, 255, 0.05),
    //   rgba(255, 255, 255, 0)
    // );
    // background-clip: padding-box;
    // box-shadow: 0 1px 0 rgba(255, 255, 255, 0.05) inset,
    //   0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 1px rgba(0, 0, 0, 0.2);
  }
  .pdfList_small {
    text-align: center;
  }
  .iconfont {
    color: #ffffff;
  }
  input.el-input__inner {
    height: 30px;
    line-height: 30px;
    background: rgba(255, 255, 255, 0.09);
    border: rgba(0, 0, 0, 0.32) 1px solid;
    color: #ffffff;
  }
  .el-select-dropdown {
    background: rgba(61, 61, 61, 1) !important;
    color: #ffffff !important;
  }

  .upload-demo {
    display: inline;
  }
  .el-upload__input {
    display: none;
  }
}

.header_left {
  background-color: rgba(71, 71, 71, 1);
  color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);

  .el-input {
    width: 150px !important;
  }
  input.el-input__inner {
    height: 30px;
    line-height: 30px;
    background-color: rgba(255, 255, 255, 0.09);
    background-clip: padding-box;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.32) rgba(0, 0, 0, 0.38) rgba(0, 0, 0, 0.42);
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05) inset,
      0 1px 0 rgba(255, 255, 255, 0.05);
    color: rgba(242, 242, 242, 1);
    font-size: 12px;
  }
  .el-checkbox__label {
    color: #ffffff;
  }
}

.header_right {
  background: rgba(71, 71, 71, 1) !important;
  border: rgba(0, 0, 0, 0.32) 1px solid;
  height: 300px;
  overflow-y: auto;
  ul {
    padding: 0;
    color: #ffffff;
  }
  ul li {
    list-style: none;
    cursor: pointer;
    padding: 6px 0 1px 5px;

    i {
      margin-right: 10px;
    }
  }

  ul li:hover {
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }
}

.pdfList {
  text-align: center;
}

canvas {
  // transform: rotate(180deg);
  // -o-transform: rotate(180deg);
  // -webkit-transform: rotate(180deg);
  // -moz-transform: rotate(180deg);
  // filter: progid:DXImageTransform.Microsoft.BasicImage(Rotation=2);
  // transform: rotateX(180deg);
  /* -webkit-transform: rotateX(120deg); */
}

.pdfList_small {
  input {
    width: 30px;
    margin-right: 20px;
    position: relative;
    top: -60px;
  }
}
</style>