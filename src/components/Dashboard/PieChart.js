import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { PieChart, Pie } from "recharts";
import { getSchemaOptions } from "../../api/general";
import { groupBy } from "lodash";
const PieChartProvider = ({ config, apiHook }) => {
  const [tableState, setTableState] = React.useState({});

  const [queryData, setQueryData] = React.useState(() => ({
    query: {
      isActive: true,
      isDeleted: false,
      ...(config?.filter ?? {})
    },
    options: {
      pagination: false,
      ...getSchemaOptions({ attributes: config?.attributes ?? [] }, tableState)
    }
  }));
  const { error, data, isLoading } = apiHook(
    {
      ...queryData
    },
    config?.id
  );
  const [processedData, setProcessedData] = React.useState([]);
  useEffect(() => {
    const group = groupBy(data?.data ?? [], config.nameKey);
    const finalData = Object.keys(group).map(key => {
      return { [config.nameKey]: key, total: group[key].length };
    });
    setProcessedData(finalData);
  }, [data]);
  const renderCustomizedLabel = ({ x, y, name, value }) => {
    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor="end"
        dominantBaseline="central"
      >
        {`${name}(${value})`}
      </text>
    );
  };
  return (
    <PieChartCustomized
      nameKey={config.nameKey}
      data={processedData}
      renderCustomizedLabel={renderCustomizedLabel}
      title={config.formatedModelName}
    />
  );
};

const PieChartCustomized = ({
  nameKey,
  data,
  renderCustomizedLabel,
  title
}) => {
  return (
    <>
      <div className="pichartTitle">{title}</div>
      {data?.length ? (
        <PieChart width={482} height={260}>
          <Pie
            data={data}
            dataKey="total"
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#3380ef"
            stroke="#fff"
            isAnimationActive={false}
            label={renderCustomizedLabel}
          />
        </PieChart>
      ) : (
        <div className="noDataOption">
          <span>No Data Found</span>
        </div>
      )}
    </>
  );
};
export default PieChartProvider;
