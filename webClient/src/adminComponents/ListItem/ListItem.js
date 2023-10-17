import React from "react"

function ListItem({_id, firstName, lastName, age, email, phoneNumber, socialProfileLink, aboutMe, role, parent, student,
                      authenticated, onProfileClick}) {
    function getAuthenticationClass() {
        if (authenticated === true) {
            return 'list-group-item-success';
        } else if (authenticated === false) {
            return 'list-group-item-danger';
        }
        return 'list-group-item-primary';
    }



    return (
        <li onClick={() => onProfileClick(_id, firstName, lastName, age, email, phoneNumber, socialProfileLink, aboutMe,
            authenticated, role, parent, student)}
            data-bs-toggle="modal" data-bs-target="#infoModal"
            className={`rounded-0 btn d-flex justify-content-center list-group-item-action list-group-item ${getAuthenticationClass()}`}>
            {role === "teacher" ? firstName + " " + lastName : student.firstName + " " + student.lastName}
        </li>
    );
}

export default ListItem;
