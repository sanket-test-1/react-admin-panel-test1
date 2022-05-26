import React from "react";
import Drawer from "rc-drawer";
import ThemedForm from "@dhiwise/core-ui";
import Button from "../Button";

import { API_URLS, UPLOAD_URL } from "../../../api/config";
import { apiClient } from "../../../api/client";
import { handleUpload, loadOptions } from "../../../api/general";

export const EditDrawer = ({
  open,
  onClose,
  schema,
  currentData,
  onSubmit,
  discardAttributes = []
}) => {
  const formRef = React.createRef();

  const handleDrawerClose = () => {
    formRef.current.resetForm();
    onClose();
  };

  const themeMode =
    localStorage.getItem("layout_version") === "dark-only" ? "dark" : "light";

  return (
    <Drawer
      open={open}
      onClose={handleDrawerClose}
      ease
      level={null}
      handler={false}
      placement="right"
      wrapperClassName=""
    >
      <div className="page-body m-0 p-0 d-flex flex-column h-full">
        <div className="py-3 px-4 drawerHead flex-shrink-0">
          <h4 className="mb-0">Edit</h4>
          <div className="drawerClose" onClick={handleDrawerClose}>
            <i className="icofont icofont-close-line"></i>
          </div>
        </div>
        <div className="py-3 px-4 drawerBody overflow-auto flex-grow h-full">
          <ThemedForm
            handleUpload={handleUpload}
            themeMode={themeMode}
            formRef={formRef}
            onSubmit={onSubmit}
            defaultValues={currentData}
            schema={{
              attributes: schema.attributes.filter(
                attr => !discardAttributes.includes(attr.attrName)
              ),
              screenLayout: schema.screenLayout,
              databaseType: process.env.REACT_APP_DATABASE_TYPE
            }}
            loadOptions={loadOptions}
          />
        </div>
        <div className="py-3 px-4 drawerFooter flex-shrink-0">
          <button
            className="btn btn-light"
            onClick={handleDrawerClose}
            type="button"
          >
            Cancel
          </button>
          {/* <button className="btn btn-primary ml-2" onClick={() => formRef.current.submit()} type="button">Submit</button> */}
          <Button
            className="ml-2"
            onClick={() => formRef.current.submit()}
            type="button"
          >
            Submit
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
