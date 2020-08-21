<template>
  <div class="home">
    <div v-for="(items,index) in dataList.result.words_region_list" :key="index">
      <div v-if="items.type == 'text'" class="text">
        <div>
          <div
            class="col-xs-6 col-sm-4 col-md-3 col-lg-2 text_name"
            v-for="(item,i) in items.words_block_list"
            :key="i"
          >{{item.words}}</div>
        </div>
      </div>
      <div v-if="items.type == 'table'" class="ttable">
        <table>
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
                <div class="itd">{{data.words}}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "home",
  components: {},
  data() {
    return {
      list: [],
      columnsLength: [],
      dataList: {
        result: {
          words_region_count: 4,
          words_region_list: [
            {
              type: "table",
              words_block_count: 1,
              words_block_list: [
                {
                  words: "",
                  rows: [0],
                  columns: [0],
                },
              ],
            },
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
    };
  },
  mounted() {
    this.getData();
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

      console.log(listData);
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
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}

.ttable {
  width: 1200px;
  overflow-x: auto;
  margin-left: 30px;
  margin-bottom: 50px;
}
</style>