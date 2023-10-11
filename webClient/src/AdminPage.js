import React from "react"
import Checkbox from "./adminComponents/Checkbox/Checkbox";
import ProfilesList from "./adminComponents/ProfilesList/ProfilesList";
import ProfileDetails from "./adminComponents/ProfileDetails/ProfileDetails";
import {useState} from "react";

function AdminPage() {
    const [approvedChecked, setApprovedChecked] = useState(true);
    const [pendingChecked, setPendingChecked] = useState(true);
    const [disapprovedChecked, setDisapprovedChecked] = useState(true);
    const [clickedProfile, setClickedProfile] = useState({});
    const [profiles, setProfiles] = useState([
            {
                "id": "1",
                "full_name": "John Doe",
                "authenticated": null
            },
            {
                "id": "2",
                "full_name": "Jane Smith",
                "authenticated": null
            },
            {
                "id": "3",
                "full_name": "Michael Johnson",
                "authenticated": null
            },
            {
                "id": "4",
                "full_name": "Emily Davis",
                "authenticated": null
            },
            {
                "id": "5",
                "full_name": "William Wilson",
                "authenticated": null
            },
            {
                "id": "6",
                "full_name": "Olivia Martinez",
                "authenticated": null
            },
            {
                "id": "7",
                "full_name": "James Brown",
                "authenticated": null
            },
            {
                "id": "8",
                "full_name": "Sophia Lee",
                "authenticated": null
            },
            {
                "id": "9",
                "full_name": "Robert Taylor",
                "authenticated": null
            },
            {
                "id": "10",
                "full_name": "Isabella Jackson",
                "authenticated": null
            },
            {
                "id": "11",
                "full_name": "David Harris",
                "authenticated": null
            },
            {
                "id": "12",
                "full_name": "Mia Clark",
                "authenticated": null
            },
            {
                "id": "13",
                "full_name": "John Wilson",
                "authenticated": null
            },
            {
                "id": "14",
                "full_name": "Elizabeth White",
                "authenticated": null
            },
            {
                "id": "15",
                "full_name": "Michael Thomas",
                "authenticated": null
            },
            {
                "id": "16",
                "full_name": "Sophia Adams",
                "authenticated": null
            },
            {
                "id": "17",
                "full_name": "Daniel Hall",
                "authenticated": null
            },
            {
                "id": "18",
                "full_name": "Ava Anderson",
                "authenticated": null
            },
            {
                "id": "19",
                "full_name": "Joseph Lewis",
                "authenticated": null
            },
            {
                "id": "20",
                "full_name": "Grace Turner",
                "authenticated": null
            },
            {
                "id": "21",
                "full_name": "William Moore",
                "authenticated": null
            },
            {
                "id": "22",
                "full_name": "Lily Harris",
                "authenticated": null
            },
            {
                "id": "23",
                "full_name": "Charles Martin",
                "authenticated": null
            },
            {
                "id": "24",
                "full_name": "Sophia Walker",
                "authenticated": null
            },
            {
                "id": "25",
                "full_name": "Thomas Johnson",
                "authenticated": null
            },
            {
                "id": "26",
                "full_name": "Ava Adams",
                "authenticated": null
            },
            {
                "id": "27",
                "full_name": "Matthew Davis",
                "authenticated": null
            },
            {
                "id": "28",
                "full_name": "Olivia Smith",
                "authenticated": null
            },
            {
                "id": "29",
                "full_name": "James Wilson",
                "authenticated": null
            },
            {
                "id": "30",
                "full_name": "Charlotte Taylor",
                "authenticated": null
            }
        ]
    );

    function setApproval(id, state) {
        const personIndex = profiles.findIndex((person) => person.id === id);
        if (personIndex !== -1) {
            const updatedProfiles = [...profiles];
            updatedProfiles[personIndex].authenticated = state;
            setProfiles(updatedProfiles);
        }
    }


    return (
        <div className="container h-100">
            <div className="row h-100 d-flex p-0 m-0 justify-content-center">
                <div className="h1 d-flex justify-content-center m-0 p-0 align-items-center">
                    Admin Panel
                </div>
                <Checkbox approvedChecked={approvedChecked} setApprovedChecked={setApprovedChecked}
                pendingChecked={pendingChecked} setPendingChecked={setPendingChecked}
                disapprovedChecked={disapprovedChecked} setDisapprovedChecked={setDisapprovedChecked}/>
                <ProfilesList approvedChecked={approvedChecked} pendingChecked={pendingChecked}
                              disapprovedChecked={disapprovedChecked} profiles={profiles} setProfiles={setProfiles}
                                setClickedProfile={setClickedProfile}/>
            </div>
            <ProfileDetails clickedProfile={clickedProfile} setApproval={setApproval}/>
        </div>
    );
}

export default AdminPage;