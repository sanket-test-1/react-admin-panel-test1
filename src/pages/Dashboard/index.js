import * as React from "react";
import Content from "./content";
import DashBoardConfig from "./dashboard.config.json";

const Dashboard = () => {
  return Object.keys(DashBoardConfig ?? {}).length ? (
    <div className="overflow-auto d-flex flex-column h-full dashboardWrap">
      <Content DashBoardConfig={DashBoardConfig} />
    </div>
  ) : (
    <div className="dashboardNoData">
      <span>Dashboard is not configured.</span>
    </div>
  );
};

export default Dashboard;
