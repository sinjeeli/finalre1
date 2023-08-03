import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Courses from './Courses';
import CourseDetail from './CourseDetail';
import CreateCourse from './CreateCourse';
import UserSignIn from './UserSignIn';
import UpdateCourse from './UpdateCourse';
import Header from './Header'; // Import the Header component

import './App.css';

function App() {
  
  const user = null; // Replace null with the authenticated user object or null if not authenticated


  return (
    <Router>
      <div>
        <header>
        <Header user={user} /> {/* Pass the user prop to the Header component */}
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/create" element={<CreateCourse />} />
            <Route path="/sign-in" element={<UserSignIn />} />
            <Route path="/courses/:id/update" element={<UpdateCourse />} />
            {/* Other routes... */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
