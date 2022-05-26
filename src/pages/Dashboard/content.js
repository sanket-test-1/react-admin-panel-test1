import React, { useState } from "react";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import { withSize } from "react-sizeme";
import Widget from "./Widget";
import PieChart from "../../components/Dashboard/PieChart";
import Table from "../../components/Dashboard/Table";
import Count from "../../components/Dashboard/Count";
import { useHistory } from "react-router";
import { MAPPER, COMPONENT_NAME, DASHBOARD_CLASS } from "../../constant/common";

const getFunctionName = (model, componentType) =>
  MAPPER[componentType].replace("ModelName", model);

const initialLayouts = {
  lg: [
    { w: 6, h: 6, x: 0, y: 0, i: "a", moved: false, static: false },
    { w: 3, h: 6, x: 9, y: 0, i: "b", moved: false, static: false },
    { w: 3, h: 6, x: 6, y: 0, i: "c", moved: false, static: false },
    { w: 12, h: 4, x: 0, y: 6, i: "d", moved: false, static: false }
  ]
};

const componentList = {
  PieChart,
  Table,
  Count
};

const mapper = {};

function Content({ size: { width }, DashBoardConfig }) {
  const history = useHistory();
  const [items, setItems] = useState();
  const [layouts, setLayouts] = useState(
    getFromLS("layouts") || initialLayouts
  );

  const onLayoutChange = (_, allLayouts) => {
    setLayouts(allLayouts);
  };
  const onLayoutSave = () => {
    saveToLS("layouts", layouts);
  };
  const onRemoveItem = itemId => {
    setItems(items.filter(i => i !== itemId));
  };
  const onAddItem = itemId => {
    setItems([...items, itemId]);
  };
  const validate = config => {
    if (config.name === COMPONENT_NAME.Count) {
      if (!config?.model) return false;
    } else if (config.name === COMPONENT_NAME.PieChart) {
      if (!config?.model || !config?.nameKey) return false;
    } else if (config.name === COMPONENT_NAME.Table) {
      if (!config?.model || !config?.attributes?.length) return false;
    }
    return true;
  };
  return (
    <>
      <ResponsiveGridLayout
        className="layout d-flex flex-wrap"
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        width={width}
        onLayoutChange={onLayoutChange}
      >
        {Object.values(DashBoardConfig?.dashboard ?? {}).map(
          (dashboard, index) => {
            return (
              <div
                key={`dashRow${index}`}
                className="d-flex flex-wrap dashboardRow"
              >
                {dashboard.map((config, configIndex) =>
                  validate(config) ? (
                    <div
                      onClick={e => {
                        config.redirectedModel &&
                          history.push(`/${config.redirectedModel}`);
                      }}
                      key={index}
                      className={`widget dashboardTable w-${
                        config.width
                          ? config.width
                          : DASHBOARD_CLASS[config.name]
                      }-12`}
                      data-grid={{ w: 3, h: 2, x: 0, y: Infinity }}
                    >
                      <Widget
                        apiHook={
                          mapper[
                            getFunctionName(
                              config.formatedModelName,
                              config.name
                            )
                          ]
                        }
                        id={config.name}
                        onRemoveItem={onRemoveItem}
                        component={componentList[config.name]}
                        config={config}
                      />
                    </div>
                  ) : (
                    ""
                  )
                )}
              </div>
            );
          }
        )}
      </ResponsiveGridLayout>
    </>
  );
}

export default withSize({ refreshMode: "debounce", refreshRate: 60 })(Content);

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
    } catch (e) {}
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-8",
      JSON.stringify({
        [key]: value
      })
    );
  }
}
