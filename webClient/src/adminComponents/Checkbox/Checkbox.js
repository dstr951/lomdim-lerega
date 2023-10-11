import React from "react"

function Checkbox({approvedChecked, setApprovedChecked, pendingChecked,setPendingChecked,
                      disapprovedChecked, setDisapprovedChecked}) {

    return (
        <div className="d-flex m-0 p-0 justify-content-center align-items-center">
          <span className="form-check m-0 p-0">
            <input type="checkbox" className="btn-check" id="approved_checkbox" autoComplete="off" defaultChecked=""
                   checked={approvedChecked} onClick={() => setApprovedChecked(!approvedChecked)}/>
            <label className="btn btn-outline-success" htmlFor="approved_checkbox">
              Approved
            </label>
          </span>
          <span className="form-check m-0 p-0 me-3 ms-3">
            <input type="checkbox" className="btn-check" id="pending_checkbox" autoComplete="off" defaultChecked=""
                   checked={pendingChecked} onClick={() => setPendingChecked(!pendingChecked)}/>
            <label className="btn btn-outline-primary" htmlFor="pending_checkbox">
              Pending
            </label>
          </span>
          <span className="form-check m-0 p-0">
            <input type="checkbox" className="btn-check" id="disapproved_checkbox" autoComplete="off" defaultChecked=""
                   checked={disapprovedChecked} onClick={() => setDisapprovedChecked(!disapprovedChecked)}/>

            <label className="btn btn-outline-danger" htmlFor="disapproved_checkbox">
                Disapproved
            </label>
          </span>
        </div>
    );
}

export default Checkbox;