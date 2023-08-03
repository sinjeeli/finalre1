import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Courses from './Courses';
import CourseDetail from './CourseDetail';
import CreateCourse from './CreateCourse';
import UserSignIn from './UserSignIn';

import './App.css';

function App() {
  return (
    <Router>
      <div>
        <header>
          {/* Header content... */}
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/create" element={<CreateCourse />} />
            <Route path="/sign-in" element={<UserSignIn />} />
            {/* Other routes... */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
