import React from "react"

function ProfileDetails({clickedProfile, setApproval}) {
    return (
        <div className="modal fade" id="infoModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                            Details
                        </h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
                    </div>
                    <div className="modal-body">
                        <div>First name: {clickedProfile.full_name}</div>
                        <div>Last name: {clickedProfile.full_name}</div>
                        <div>Email: {clickedProfile.id}</div>
                        <div>Age:</div>
                        <div>Social profile link:</div>
                        <div>Phone number:</div>
                        <div className="text-break">
                            About me:
                            <br/>
                            <p className="text-end">
                            </p>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success" data-bs-dismiss="modal"
                                onClick={() => setApproval(clickedProfile.id, true)}>
                            Approve
                        </button>
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal"
                                onClick={() => setApproval(clickedProfile.id, false)}>
                            Disapprove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileDetails;