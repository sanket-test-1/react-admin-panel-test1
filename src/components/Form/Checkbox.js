import * as React from "react";

const Checkbox = ({ id, label, value, onClick }) => {
  return (
    <div className="checkbox p-0">
      <input onChange={onClick} id={id} checked={value} type="checkbox" />
      <label className="m-0">{label}</label>
    </div>
  );
};

export default Checkbox;
