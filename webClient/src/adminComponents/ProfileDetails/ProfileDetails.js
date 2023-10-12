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
                        <div><span className="fw-bold">First name:</span> {clickedProfile.firstName}</div>
                        <div><span className="fw-bold">Last name:</span> {clickedProfile.lastName}</div>
                        <div><span className="fw-bold">Email:</span> {clickedProfile.email}</div>
                        <div><span className="fw-bold">Age:</span> {clickedProfile.age}</div>
                        <div><span className="fw-bold">Social profile link:</span> {clickedProfile.socialProfileLink}</div>
                        <div><span className="fw-bold">Phone number:</span> {clickedProfile.phoneNumber}</div>
                        <div className="text-break">
                            <span className="fw-bold">About me:</span>
                            <br/>
                            <p className="text-end text-black">
                                {clickedProfile.aboutMe}
                            </p>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success" data-bs-dismiss="modal"
                                onClick={() => setApproval(clickedProfile.email, true)}>
                            Approve
                        </button>
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal"
                                onClick={() => setApproval(clickedProfile.email, false)}>
                            Disapprove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileDetails;