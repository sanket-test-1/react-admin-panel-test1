import React from "react";
import { getSchemaOptions } from "../../api/general";
import SchemaTable from "../Table/SchemaTable";
const Table = ({ modelJsonSchema, data, config }) => {
  return (
    <SchemaTable
      // initialState={tableState}
      data={data}
      schema={modelJsonSchema}
      noAdd
      noEdit
      noDelete
      noView
      noPaginate
      noFilter
      attributes={config?.attributes ?? []}
    />
  );
};
const TableProvider = ({ apiHook, config }) => {
  const [tableState, setTableState] = React.useState({});

  const [queryData, setQueryData] = React.useState(() => ({
    query: {
      isActive: true,
      isDeleted: false,
      ...(config?.filter ?? {})
    },
    options: {
      limit: config.limit ?? 10,
      page: 1,
      ...getSchemaOptions({ attributes: config?.attributes ?? [] }, tableState),
      ...(config?.options ?? {})
    }
  }));
  const { error, data, isLoading } = apiHook(
    {
      ...queryData
    },
    config?.id
  );
  return (
    <Table
      config={config}
      modelJsonSchema={{
        displayModelName: config?.model,
        name: config?.model,
        attributes: config?.attributes ?? []
      }}
      data={data}
    />
  );
};
export default TableProvider;
