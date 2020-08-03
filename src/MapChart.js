import React, { memo } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { Bar } from "react-chartjs-2";

import arrangeCountryInfo from "./services/MapData";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const rounded = (num) => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "Bn";
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else {
    return Math.round(num / 100) / 10 + "K";
  }
};

const MapChart = ({ setTooltipContent }) => {
  const countryData = arrangeCountryInfo();
  return (
    <>
      <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const { ISO_A2, NAME } = geo.properties;
                    console.log(geo.properties);
                    if (countryData[ISO_A2]) {
                      const source = countryData[ISO_A2].sources[0];
                      const dates = [];
                      const datas = [];
                      countryData[ISO_A2].sources.map((source) => {
                        dates.push(source.Date);
                        datas.push(source.Perc_lt_30ms);
                      });
                      const graphState = {
                        labels: dates,
                        datasets: [
                          {
                            label: "Perc_lt_30ms",
                            backgroundColor: "rgba(75,192,192,1)",
                            borderColor: "rgba(0,0,0,1)",
                            borderWidth: 2,
                            data: datas,
                          },
                        ],
                      };

                      setTooltipContent(
                        <div style={{ width: "600px" }}>
                          <Bar
                            data={graphState}
                            options={{
                              title: {
                                display: true,
                                text: NAME,
                                fontSize: 20,
                              },
                              legend: {
                                display: true,
                                position: "right",
                              },
                            }}
                          />
                          <p>"Total Count": {source.TotalCount}</p>
                          <p>"Date": {source.Date}</p>
                          <p>"Perc_lt_30ms": {source.Perc_lt_30ms}</p>
                          <p>"Perc_30ms_60ms": {source.Perc_30ms_60ms}</p>
                          <p>"Perc_60ms_90ms": {source.Perc_60ms_90ms}</p>
                          <p>"Perc_90ms_150ms": {source.Perc_90ms_150ms}</p>
                          <p>"Perc_gt_150ms": {source.Perc_gt_150ms}</p>
                        </div>
                      );
                    }
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  style={{
                    default: {
                      fill: "#D6D6DA",
                      outline: "none",
                    },
                    hover: {
                      fill: "#F53",
                      outline: "none",
                    },
                    pressed: {
                      fill: "#E42",
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </>
  );
};

export default memo(MapChart);
