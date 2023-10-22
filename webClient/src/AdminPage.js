import React, { useEffect } from "react";
import CheckboxTeacher from "./adminComponents/CheckboxTeacher/Checkbox";
import CheckboxStudent from "./adminComponents/CheckboxStudent/Checkbox";
import ProfilesList from "./adminComponents/ProfilesList/ProfilesList";
import ProfileDetails from "./adminComponents/ProfileDetails/ProfileDetails";
import { useLocation } from "react-router-dom";
import { useState } from "react";
const defaultClickedProfile = {
  aboutMe: "",
  age: "",
  authenticated: null,
  email: "",
  firstName: "",
  id: "",
  lastName: "",
  parent: {
    firstName: "",
    lastName: "",
    phoneNumber: "",
  },
  phoneNumber: "",
  role: "",
  socialProfileLink: "",
  student: { firstName: "", lastName: "", grade: 0 },
};

function AdminPage() {
  const SERVER_ADDRESS = process.env.SERVER_ADDRESS
    ? process.env.SERVER_ADDRESS
    : "http://localhost:3001";
  const [approvedCheckedTeacher, setApprovedCheckedTeacher] = useState(true);
  const [pendingCheckedTeacher, setPendingCheckedTeacher] = useState(true);
  const [disapprovedCheckedTeacher, setDisapprovedCheckedTeacher] =
    useState(true);
  const [approvedCheckedStudent, setApprovedCheckedStudent] = useState(true);
  const [pendingCheckedStudent, setPendingCheckedStudent] = useState(true);
  const [disapprovedCheckedStudent, setDisapprovedCheckedStudent] =
    useState(true);
  const [clickedProfile, setClickedProfile] = useState(defaultClickedProfile);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const location = useLocation();
  const token = location?.state?.token;

  const getAllTeachers = async () => {
    const res = await fetch(`${SERVER_ADDRESS}/api/Teachers/all/admin`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    if (res.ok) {
      return res.json();
    }
    return false;
  };

  const getAllStudents = async () => {
    const res = await fetch(`${SERVER_ADDRESS}/api/Students/all/admin`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    if (res.ok) {
      return res.json();
    }
    return false;
  };

  const acceptTeacher = async () => {
    const res = await fetch(
      `${SERVER_ADDRESS}/api/Teachers/${clickedProfile.email}/approve`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    return res.ok;
  };

  const rejectTeacher = async () => {
    const res = await fetch(
      `${SERVER_ADDRESS}/api/Teachers/${clickedProfile.email}/reject`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    return res.ok;
  };

  const acceptStudent = async () => {
    const res = await fetch(
      `${SERVER_ADDRESS}/api/Students/${clickedProfile.email}/approve`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    return res.ok;
  };

  const rejectStudent = async () => {
    const res = await fetch(
      `${SERVER_ADDRESS}/api/Students/${clickedProfile.email}/reject`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    return res.ok;
  };

  useEffect(() => {
    getAllTeachers().then((data) => {
      setTeachers(data);
    });
    getAllStudents().then((data) => {
      setStudents(data);
    });
  }, []);

  function changeTeacherAuthentication(email, state) {
    const personIndex = teachers.findIndex((person) => person.email === email);
    if (personIndex !== -1) {
      const updatedProfiles = [...teachers];
      updatedProfiles[personIndex].authenticated = state;
      setTeachers(updatedProfiles);
    }
  }

  function changeStudentAuthentication(email, state) {
    const personIndex = students.findIndex((person) => person.email === email);
    if (personIndex !== -1) {
      const updatedProfiles = [...students];
      updatedProfiles[personIndex].authenticated = state;
      setStudents(updatedProfiles);
    }
  }

  function setApproval(email, state, role) {
    if (role === "teacher") {
      if (state) {
        acceptTeacher().then((data) => {
          if (data) {
            changeTeacherAuthentication(email, state);
          }
        });
      } else {
        rejectTeacher().then((data) => {
          if (data) {
            changeTeacherAuthentication(email, state);
          }
        });
      }
    } else if (role === "student") {
      if (state) {
        acceptStudent().then((data) => {
          if (data) {
            changeStudentAuthentication(email, state);
          }
        });
      } else {
        rejectStudent().then((data) => {
          if (data) {
            changeStudentAuthentication(email, state);
          }
        });
      }
    }
  }

  return (
    <div className="container h-100">
      <div className="row h-100 d-flex p-0 m-0 justify-content-center">
        <div className="h1 d-flex justify-content-center m-0 p-0 align-items-center">
          Admin Panel
        </div>
        <div className="row h-100 d-flex p-0 m-0 justify-content-center">
          <div className="row col-6 d-flex m-0 p-0 justify-content-center">
            <div className="h2 d-flex justify-content-center m-0 p-0 align-items-center">
              Teachers
            </div>
            <CheckboxTeacher
              approvedChecked={approvedCheckedTeacher}
              setApprovedChecked={setApprovedCheckedTeacher}
              pendingChecked={pendingCheckedTeacher}
              setPendingChecked={setPendingCheckedTeacher}
              disapprovedChecked={disapprovedCheckedTeacher}
              setDisapprovedChecked={setDisapprovedCheckedTeacher}
            />
            {teachers ? (
              <ProfilesList
                approvedChecked={approvedCheckedTeacher}
                pendingChecked={pendingCheckedTeacher}
                disapprovedChecked={disapprovedCheckedTeacher}
                profiles={teachers}
                setProfiles={setTeachers}
                getAllProfiles={getAllTeachers}
                setClickedProfile={setClickedProfile}
              />
            ) : (
              <div>there was an error getting the teachers from the server</div>
            )}
          </div>
          <div className="row col-6 d-flex m-0 p-0 justify-content-center">
            <div className="h2 d-flex justify-content-center m-0 p-0 align-items-center">
              Students
            </div>
            <CheckboxStudent
              approvedChecked={approvedCheckedStudent}
              setApprovedChecked={setApprovedCheckedStudent}
              pendingChecked={pendingCheckedStudent}
              setPendingChecked={setPendingCheckedStudent}
              disapprovedChecked={disapprovedCheckedStudent}
              setDisapprovedChecked={setDisapprovedCheckedStudent}
            />
            {teachers ? (
              <ProfilesList
                approvedChecked={approvedCheckedStudent}
                pendingChecked={pendingCheckedStudent}
                disapprovedChecked={disapprovedCheckedStudent}
                profiles={students}
                setProfiles={setStudents}
                getAllProfiles={getAllStudents}
                setClickedProfile={setClickedProfile}
              />
            ) : (
              <div>there was an error getting the teachers from the server</div>
            )}
          </div>
          <ProfileDetails
            clickedProfile={clickedProfile}
            setApproval={setApproval}
            token={token}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
