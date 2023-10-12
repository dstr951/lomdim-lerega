import React, {useEffect} from "react"
import Checkbox from "./adminComponents/Checkbox/Checkbox";
import ProfilesList from "./adminComponents/ProfilesList/ProfilesList";
import ProfileDetails from "./adminComponents/ProfileDetails/ProfileDetails";
import { useLocation } from "react-router-dom";
import {useState} from "react";

function AdminPage() {
    const SERVER_ADDRESS = process.env.SERVER_ADDRESS
    const [approvedChecked, setApprovedChecked] = useState(true);
    const [pendingChecked, setPendingChecked] = useState(true);
    const [disapprovedChecked, setDisapprovedChecked] = useState(true);
    const [clickedProfile, setClickedProfile] = useState({});
    const [profiles, setProfiles] = useState([]);
    const location = useLocation();
    const token = location?.state?.token


    const getAllProfiles = async () => {        
        const res = await fetch(`${SERVER_ADDRESS}/api/Teachers/all/admin`, {
            'method': 'get',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': token,
            }
        })
        if (res.ok) {
            return res.json();
        }
        return false;
    }

    const accept = async () => {
        const res = await fetch(`${SERVER_ADDRESS}/api/Teachers/${clickedProfile.email}/approve`, {
            'method': 'post',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        })
        if (res.ok) {
            console.log(res)
            return res.text();
        }
        return false;
    }


    const reject = async () => {
        const res = await fetch(`${SERVER_ADDRESS}/api/Teachers/${clickedProfile.email}/reject`, {
            'method': 'post',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        })
        if (res.ok) {
            console.log(res)
            return res.text();
        }
        return false;
    }


    useEffect(() => {
        getAllProfiles().then(data => {
            setProfiles(data)
        })
    }, [])


    function setApproval(id, state) {
        const personIndex = profiles.findIndex((person) => person._id === id);
        console.log(personIndex)
        if (personIndex !== -1) {
            const updatedProfiles = [...profiles];
            updatedProfiles[personIndex].authenticated = state;
            setProfiles(updatedProfiles);
            if (state) {
                accept().then();
            } else {
                reject().then();
            }
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
                {profiles ? <ProfilesList approvedChecked={approvedChecked} pendingChecked={pendingChecked}
                              disapprovedChecked={disapprovedChecked} profiles={profiles} setProfiles={setProfiles}
                              getAllProfiles={getAllProfiles} setClickedProfile={setClickedProfile}/>
                            : <div>there was an error getting the teachers from the server</div>}
            </div>
            <ProfileDetails clickedProfile={clickedProfile} setApproval={setApproval}/>
        </div>
    );
}

export default AdminPage;