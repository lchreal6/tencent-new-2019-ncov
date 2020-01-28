import React, { useState, useEffect } from "react";
import "./styles.scss";
import ReactEcharts from "echarts-for-react";
import jsonp from "jsonp";
import "echarts/map/js/china.js";

export default function App() {
  const [provinceArr, setProvinceArr] = useState([]);
  const [overviewData, setOverviewData] = useState({});
  useEffect(() => {
    jsonp(
      "https://view.inews.qq.com/g2/getOnsInfo?name=wuwei_ww_global_vars",
      {},
      (err, res) => {
        const data = JSON.parse(res.data);
        setOverviewData(data[0]);
      }
    );

    jsonp(
      "https://view.inews.qq.com/g2/getOnsInfo?name=wuwei_ww_area_counts",
      {},
      (err, data) => {
        const provincesObj = {};
        const interfaceData = JSON.parse(data.data);
        interfaceData.map(item => {
          if (!provincesObj[item.area]) {
            provincesObj[item.area] = item.confirm;
          } else {
            provincesObj[item.area] = provincesObj[item.area] + item.confirm;
          }
          return null;
        });

        const arr = [];
        for (let k in provincesObj) {
          arr.push({
            name: k,
            value: provincesObj[k]
          });
        }
        setProvinceArr(arr);
      }
    );
  }, []);
  const echartOptions = {
    tooltip: {
      show: true,
      triggerOn: "click",
      alwaysShowContent: true
    },
    visualMap: {
      show: true,
      type: "piecewise",
      left: 0,
      bottom: "0",
      align: "left",
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        fontSize: 10
      },
      pieces: [
        { min: 1000, label: '1000人以上', color: '#ED514E' },
        { min: 100, max: 999, label: '100-999人', color: '#FF8F66' },
        { min: 10, max: 99, label: '10-99人', color: '#FFB769' },
        { min: 1, max: 9, label: '1-9人', color: '#FFE6BD' }
      ]
    },
    series: [
      {
        type: "map",
        name: "确诊人数",
        mapType: "china",
        label: {
          show: true,
          fontSize: 8
        },
        showLegendSymbol: false,
        zoom: 1.2,
        silent: false,
        data: provinceArr,
        tooltip: {
          show: true,
          position: "inside",
          textStyle: {
            fontSize: 8,
            lineHeight: 100
          }
        },
        selectedMode: "single"
      }
    ]
  };
  return (
    <div className="App">
      <div className="overview-cotainer">
        <div>
          <p className="number confirm">{overviewData.confirmCount}</p>
          <p className="text">全国确诊</p>
        </div>
        <div>
          <p className="number suspect">{overviewData.suspectCount}</p>
          <p className="text">疑似病例</p>
        </div>
        <div>
          <p className="number cure">{overviewData.cure}</p>
          <p className="text">治愈人数</p>
        </div>
        <div>
          <p className="number dead">{overviewData.deadCount}</p>
          <p className="text">死亡人数</p>
        </div>
      </div>
      <ReactEcharts option={echartOptions} />
    </div>
  );
}
