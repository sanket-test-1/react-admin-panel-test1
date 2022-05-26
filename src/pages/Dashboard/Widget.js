import React from "react";

export default function Widget({
  apiHook,
  id,
  onRemoveItem,
  component: Item,
  config,
  modelJsonSchema
}) {
  return (
    <div className="dashboard-Card">
      <Item
        apiHook={apiHook}
        config={config}
        modelJsonSchema={modelJsonSchema}
      />
    </div>
  );
}
