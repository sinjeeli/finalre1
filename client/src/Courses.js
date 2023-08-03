import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses');
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
    <div className="wrap">
      <h2>Course List</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            {/* Link to the individual course detail screen */}
            <Link to={`/courses/${course.id}`}>{course.title}</Link>
          </li>
        ))}
      </ul>
      {/* Link to the "Create Course" screen */}
      <Link to="/create">Create Course</Link>
    </div>
  );
}

export default Courses;
