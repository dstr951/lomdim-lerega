import React from "react";

function Checkbox({
  approvedChecked,
  setApprovedChecked,
  pendingChecked,
  setPendingChecked,
  disapprovedChecked,
  setDisapprovedChecked,
}) {
  return (
    <div className="d-flex m-0 p-0 justify-content-center align-items-center">
      <span className="form-check m-0 p-0">
        <input
          type="checkbox"
          className="btn-check"
          id="approved_checkbox_teacher"
          autoComplete="off"
          defaultChecked=""
          checked={approvedChecked}
          onClick={() => setApprovedChecked(!approvedChecked)}
        />
        <label
          className="btn btn-outline-success"
          htmlFor="approved_checkbox_teacher"
        >
          Approved
        </label>
      </span>
      <span className="form-check m-0 p-0 me-3 ms-3">
        <input
          type="checkbox"
          className="btn-check"
          id="pending_checkbox_teacher"
          autoComplete="off"
          defaultChecked=""
          checked={pendingChecked}
          onClick={() => setPendingChecked(!pendingChecked)}
        />
        <label
          className="btn btn-outline-primary"
          htmlFor="pending_checkbox_teacher"
        >
          Pending
        </label>
      </span>
      <span className="form-check m-0 p-0">
        <input
          type="checkbox"
          className="btn-check"
          id="disapproved_checkbox_teacher"
          autoComplete="off"
          defaultChecked=""
          checked={disapprovedChecked}
          onClick={() => setDisapprovedChecked(!disapprovedChecked)}
        />

        <label
          className="btn btn-outline-danger"
          htmlFor="disapproved_checkbox_teacher"
        >
          Disapproved
        </label>
      </span>
    </div>
  );
}

export default Checkbox;
