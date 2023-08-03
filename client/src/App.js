import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses'); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  return (
    <div>
      <header>
        <div className="wrap header--flex">
          <h1 className="header--logo"><a href="index.html">Courses</a></h1>
          <nav>
            <ul className="header--signedin">
              <li>Welcome, Joe Smith!</li>
              <li><a href="sign-out.html">Sign Out</a></li>
            </ul>
          </nav>
        </div>
      </header>
      <main>
        <div className="wrap">
          <h2>Course List</h2>
          <ul>
            {courses.map((course) => (
              <li key={course.id}>{course.title}</li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
