
    import * as React from "react";
    import ModelJsonSchema from "./User.schema.json";
    import mockData from "./data.json";
    import { useBoolean } from './../../hooks';
    import { AddDrawer } from "../../components/common/AddDrawer";
    import { EditDrawer } from "../../components/common/EditDrawer";
    import { Confirmation } from "../../components/common/Confirmation";
    import { errorToast,successToast } from "../../utils/notifications";
    import UserTable from "./UserTable";
    import { ACTION_TYPE } from "../../constant/common";
    import { isMocking } from "../../utils/utils";
  
    const formSchema = {
      databaseType: process.env.REACT_APP_DATABASE_TYPE,
      screenLayout:ModelJsonSchema.screenLayout,
      attributes:ModelJsonSchema.actions.find(action => action.category === 'addEdit')?.attributes || []
    }
  
    const User = ({
      addRecord,
      editRecord,
      deleteRecord,
      deleteRecords
    }) => {
        
        const [addModal,showAddModal,hideAddModal] = useBoolean(false);
        const [editModal,showEditModal,hideEditModal] = useBoolean(false);
        const [deleteModal,showDeleteModal,hideDeleteModal] = useBoolean(false);
        const [actionType, setActionType] = React.useState(null);
        
        const currentRecord = React.useRef({});
        const selectedRows = React.useRef({});
        
        const onViewRecord = React.useCallback((record)=>{
          record.id && window.open(`user/${record.id}`, "_blank");
        },[]);
      
        const onDelete = React.useCallback((record) => {
          setActionType(ACTION_TYPE.DELETE)
          currentRecord.current = record;
          showDeleteModal();
        },[]);
  
        const onMultiDelete = React.useCallback((selectedIds) => {
          setActionType(ACTION_TYPE.MULTIDELETE)
          selectedRows.current = selectedIds;
          showDeleteModal();
        },[]);
      
        const onEdit = React.useCallback((record) => {
          currentRecord.current = record;
          showEditModal();
        },[])
      
        return (
          <React.Fragment>
          
            <UserTable
              mockData={mockData.data}
              onAdd={showAddModal}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onViewRecord}
              onMultiDelete={onMultiDelete}
            />
  
            <AddDrawer
              onSubmit={record => {
                addRecord(record)
                .then(successToast)
                .catch(errorToast)
                .finally(hideAddModal)
              }}
              schema={formSchema}
              open={addModal}
              onClose={hideAddModal}
            />
            <EditDrawer
              schema={formSchema}
              currentData={currentRecord.current}
              open={editModal}
              onClose={hideEditModal}
              onSubmit={record => {
                editRecord({ ...record, id: currentRecord.current.id })
                  .then(successToast)
                  .catch(errorToast)
                  .finally(hideEditModal);
              }}
            />
            <Confirmation
          handleSubmit={() => {
            actionType===ACTION_TYPE.DELETE && 
            currentRecord.current.id &&
              deleteRecord({ id: currentRecord?.current?.id })
              .then(successToast)
              .catch(errorToast)
              .finally(hideDeleteModal);
            actionType===ACTION_TYPE.MULTIDELETE &&
            selectedRows.current && 
              deleteRecords({ ids: selectedRows.current })
                .then(successToast)
                .catch(errorToast)
                .finally(hideDeleteModal);
          }}
          handleCancel={hideDeleteModal}
          isOpen={deleteModal}
          OkText="Delete"
        />
  
          </React.Fragment>
        );
      };
      
      export default User;
    