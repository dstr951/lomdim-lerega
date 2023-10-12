// Important! - This is just a naive implementation for example. You can modify all of the implementation in this file.

const Teachers = [
  {
    id: "1",
    firstName: "מיכאל",
    lastName: "לוינוב",
    aboutMe: "מורה לפיזיקה מדעי המחשב וכו'",
    phoneNumber: "050-1234567",
    socialProfileLink: "www.example.com",
    canTeach: [
      { subject: 1, lowerGrade: 1, higherGrade: 12 },
      { subject: 4, lowerGrade: 3, higherGrade: 7 },
    ],
  },
  {
    id: "2",
    firstName: "משה",
    lastName: "פרץ ",
    aboutMe: "מורה מגה טוב וכו'",
    phoneNumber: "050-1234567",
    socialProfileLink: "www.example.com",
    canTeach: [
      { subject: "מתמטיקה", lowerGrade: "א'", higherGrade: "ז'" },
      { subject: "פיזיקה", lowerGrade: "ג'", higherGrade: 'י"ב' },
    ],
  },
];
export default Teachers;
