import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CourseDetail({ match }) {
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${match.params.id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course detail:', error);
      }
    };

    fetchCourseDetail(); // Fetch the course detail when the component mounts

    // Clean up the state when the component unmounts
    return () => setCourse(null);
  }, [match.params.id]); // Include match.params.id in the dependency array

  const handleDeleteCourse = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${match.params.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Navigate back to the course list after successful deletion
      navigate('/courses');
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="wrap">
      <h2>Course Detail</h2>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <button onClick={handleDeleteCourse}>Delete Course</button>
      <button onClick={() => navigate(`/update-course/${match.params.id}`)}>Update Course</button>
    </div>
  );
}

export default CourseDetail;
