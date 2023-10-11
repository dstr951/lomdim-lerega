import React from "react"

function ListItem({id, full_name, authenticated, onProfileClick}) {
    function getAuthenticationClass() {
        if (authenticated === true) {
            return 'list-group-item-success';
        } else if (authenticated === false) {
            return 'list-group-item-danger';
        }
        return 'list-group-item-primary';
    }


    return (
        <li onClick={() => onProfileClick(id, full_name, authenticated)} data-bs-toggle="modal" data-bs-target="#infoModal"
            className={`rounded-0 btn d-flex justify-content-center list-group-item-action list-group-item ${getAuthenticationClass()}`}>
            {full_name}
        </li>
    );
}

export default ListItem;
