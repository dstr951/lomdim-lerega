import React from "react"
import ListItem from "../ListItem/ListItem";

function ProfilesList({approvedChecked, pendingChecked, disapprovedChecked, profiles, setClickedProfile}) {

    const filteredProfiles = profiles.filter((profile) => {
        if (approvedChecked && profile.authenticated === true) {
            return true;
        }
        if (pendingChecked && profile.authenticated === null) {
            return true;
        }
        if (disapprovedChecked && profile.authenticated === false) {
            return true;
        }
        return false;
    });


    function handleClick(id, full_name, authenticated){
        setClickedProfile({id: id, full_name: full_name, authenticated: authenticated})
    }

    const profilesArray = filteredProfiles.map((profile, key) => {
        return <ListItem onProfileClick={handleClick} {...profile} key={key}/>
    });

    return(
        <ul className="list-group h-75 w-25 mt-1 m-0 p-0 overflow-auto rounded-0">
            {profilesArray}
        </ul>
    );
}

export default ProfilesList;