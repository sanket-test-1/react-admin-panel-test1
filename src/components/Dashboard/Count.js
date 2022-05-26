import React from "react";
const Count = ({ count, name }) => {
  return (
    <div className="countBox">
      <div className="countName">{count ?? 0}</div>
      <div className="countLable">{name}</div>
    </div>
  );
};
const CountProvider = ({ config, apiHook }) => {
  const [queryData, setQueryData] = React.useState(() => ({
    query: {
      isActive: true,
      isDeleted: false,
      ...(config?.filter ?? {})
    },
    options: {},
    isCountOnly: true
  }));
  const { error, data, isLoading } = apiHook(
    {
      ...queryData
    },
    config?.id
  );
  return <Count count={data?.totalRecords} name={config.formatedModelName} />;
};
export default CountProvider;
