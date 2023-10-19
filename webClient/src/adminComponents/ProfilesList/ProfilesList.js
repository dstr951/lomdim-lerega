import ListItem from "../ListItem/ListItem";
import React from "react";

function ProfilesList({
  approvedChecked,
  pendingChecked,
  disapprovedChecked,
  profiles,
  setClickedProfile,
}) {
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

  function handleClick(
    _id,
    firstName,
    lastName,
    age,
    email,
    phoneNumber,
    socialProfileLink,
    aboutMe,
    authenticated,
    role,
    parent,
    student
  ) {
    setClickedProfile({
      id: _id,
      firstName: firstName,
      lastName: lastName,
      authenticated: authenticated,
      age: age,
      email: email,
      phoneNumber: phoneNumber,
      socialProfileLink: socialProfileLink,
      aboutMe: aboutMe,
      role: role,
      parent: parent,
      student: student,
    });
  }

  const profilesArray = filteredProfiles.map((profile, key) => {
    return <ListItem onProfileClick={handleClick} {...profile} key={key} />;
  });

  return (
    <ul className="list-group h-75 w-50 mt-1 m-0 p-0 overflow-auto rounded-0">
      {profilesArray}
    </ul>
  );
}

export default ProfilesList;
