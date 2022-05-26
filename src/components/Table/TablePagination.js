import React from "react";
import ReactPaginate from "react-paginate";
import { useDebouncedCallback } from "use-debounce";

function TablePagination({
  pageCount,
  gotoPage,
  pageIndex,
  pageOptions,
  pageSize,
  pageLimitProp,
  setPageSize,
  updateTablePageIndex,
  dataLength,
  isMocking
}) {
  const paginationArray = React.useMemo(
    () =>
      Array(5)
        .fill("")
        .map((_, i) => 10 ** (`${pageLimitProp}`.length - 1) * (i + 1)),
    [pageLimitProp]
  );

  const [pageNumber, setPageNumber] = React.useState(pageIndex + 1);

  React.useEffect(() => {
    if (!dataLength && pageIndex >= 1) {
      gotoPage(pageIndex - 1);
      if (!isMocking) {
        updateTablePageIndex(pageIndex - 1);
      }
    }

    setPageNumber(pageIndex + 1);
  }, [dataLength, pageIndex, isMocking]);

  const onPageChange = React.useCallback(
    ({ selected }) => {
      gotoPage(selected);
    },
    [gotoPage]
  );

  const debouncedPageChange = useDebouncedCallback(
    page => {
      if (page >= 0 && page < pageCount) {
        gotoPage(page);
      } else if (page >= pageCount) {
        gotoPage(pageCount - 1);
      }
    },
    1000,
    []
  );

  return (
    <div className="card paginationFooter">
      {/* pagination */}
      <nav aria-label="Page navigation example">
        {dataLength > 0 && (
          <ReactPaginate
            initialPage={pageIndex}
            forcePage={pageIndex}
            previousLabel={<i className="fa fa-chevron-left"></i>}
            containerClassName="pagination"
            pageClassName="page-item"
            previousClassName="page-item"
            nextClassName="page-item"
            pageLinkClassName="page-link"
            previousLinkClassName="page-link"
            nextLinkClassName="page-link"
            activeClassName="active"
            nextLabel={<i className="fa fa-chevron-right"></i>}
            breakLabel="..."
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={onPageChange}
          />
        )}
      </nav>
      {/* pagination */}
      <div className="tablePaginationRight">
        <span className="tablePagePosition">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <span className="gotoPage">
          | Go to page:
          <input
            className="form-control"
            type="number"
            defaultValue={pageNumber}
            value={pageNumber}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : NaN;
              if (page === 0) {
                setPageNumber(1);
              } else {
                if (page > 0) {
                  setPageNumber(page + 1);
                }
              }
              debouncedPageChange(page);
            }}
            style={{ width: "130px" }}
          />
        </span>{" "}
        <select
          style={{ width: "130px" }}
          className="form-control digits"
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {paginationArray.map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
export default React.memo(TablePagination);
