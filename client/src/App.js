import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Courses from './Courses';
import CourseDetail from './CourseDetail';
import CreateCourse from './CreateCourse';
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
            {/* Other routes... */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
