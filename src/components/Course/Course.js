import React from 'react';
import 'rbx/index.css';
import {Button} from 'rbx';
import {    timeParts,
    getCourseNumber,
    getCourseTerm,
    timeConflict } from './times.js';

import firebase from 'firebase/app';
import 'firebase/database';

// FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyA-7gXzjv_oGigWlktbxcoa9lSp-VOAkQY",
    authDomain: "scheduler-6d62f.firebaseapp.com",
    databaseURL: "https://scheduler-6d62f.firebaseio.com",
    projectId: "scheduler-6d62f",
    storageBucket: "scheduler-6d62f.appspot.com",
    messagingSenderId: "30709770306",
    appId: "1:30709770306:web:551a1773ad9790a0e1e5db",
    measurementId: "G-4TG81VMZW2"
};
  
firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const hasConflict = (course, selected) => (
  selected.some(selection => courseConflict(course, selection))
);

const moveCourse = course => {
    const meets = prompt('Enter new meeting data, in this format:', course.meets);
    if (!meets) return;
    const {days} = timeParts(meets);
    if (days) saveCourse(course, meets); 
    else moveCourse(course);
  };
  
const saveCourse = (course, meets) => {
    db.child('courses').child(course.id).update({meets})
    .catch(error => alert(error));
};

const courseConflict = (course1, course2) => (
    course1 !== course2
    && getCourseTerm(course1) === getCourseTerm(course2)
    && timeConflict(course1, course2)
);

const Course = ({ course, state, user }) => (
    <Button color={ buttonColor(state.selected.includes(course)) }
      onClick={ () => state.toggle(course) }
      onDoubleClick={ user ? () => moveCourse(course) : null }
      disabled={ hasConflict(course, state.selected) }
      >
      { getCourseTerm(course) } CS { getCourseNumber(course) }: { course.title }
    </Button>
);

const buttonColor = selected => (
  selected ? 'success' : null
);

export default Course;