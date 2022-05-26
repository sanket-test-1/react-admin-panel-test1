import React from "react";
import { schemaToColumn } from "../../utils/schemaToColumn";
import Table from "./Table";
import { formatLabel } from "../../utils/utils";

const isMocking = process.env.REACT_APP_IS_MOCKING === "true";
const defaultDataValue = { data: [], paginator: {} };
const SchemaTable = ({
  applyFilters,
  appliedFilters,
  data = defaultDataValue,
  initialState = {},
  setFilter = () => {},
  mockData = [],
  schema,
  onAdd = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onMultiDelete = () => {},
  onView = () => {},
  onPageChange = () => {},
  onLimitChange = () => {},
  onAssignRole,
  noAdd,
  noEdit,
  noDelete,
  noView,
  noPaginate,
  noFilter,
  attributes
}) => {
  if (!data.paginator) {
    data["paginator"] = {};
  }
  if (!data.data) {
    data["data"] = [];
  }

  const listingConfig = noPaginate ?? schema?.screenLayout?.listing?.config;

  const generatedColumns = React.useMemo(
    () =>
      schemaToColumn({
        name: schema.name,
        screenLayout: schema.screenLayout,
        attributes:
          attributes ??
          schema.actions.find(action => action.category === "listing")
            .attributes
      }),
    [schema]
  );

  const tableConfig = React.useMemo(
    () => ({ name: formatLabel(schema?.displayModelName) }),
    [schema]
  );

  const paginationProps = React.useMemo(
    () => ({
      pageIndex: data?.paginator?.currentPage - 1 || 0,
      pageSize: data?.paginator?.perPage,
      totalCount: data?.paginator?.itemCount,
      pageCount: data?.paginator?.pageCount
    }),
    [data]
  );

  const canAdd = schema?.allowAdd;
  const canEdit = schema?.allowEdit;
  const canDelete = schema?.allowDelete;
  const canView = schema?.allowView;
  const canMultiDelete = schema?.allowDelete;

  return (
    <Table
      appliedFilters={appliedFilters}
      applyFilters={applyFilters}
      initialState={initialState}
      setAPIFilter={setFilter}
      config={tableConfig}
      columns={generatedColumns}
      data={isMocking ? mockData : data?.data}
      allowRowSelection={listingConfig?.rowSelection}
      allowTotalCount={listingConfig?.dataCount}
      globalSearch={listingConfig?.search}
      paginate={listingConfig?.paginate}
      pageLimit={
        isMocking ? listingConfig?.limitSetup || 10 : data?.paginator?.perPage
      }
      allowSorting={listingConfig?.sorting}
      allowColResize
      allowColVisibility={listingConfig?.optionToEnable}
      onAdd={canAdd && onAdd}
      onView={canView && onView}
      onEdit={canEdit && onEdit}
      onDelete={canDelete && onDelete}
      onMultiDelete={canMultiDelete && onMultiDelete}
      onAssignRole={onAssignRole}
      isMocking={isMocking}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      paginationProps={paginationProps}
      noFilter={noFilter}
    />
  );
};

export default React.memo(SchemaTable);
