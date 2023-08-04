import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserContext } from './UserContext'; // Import the useUserContext hook
import ReactMarkdown from 'react-markdown'; // Import the ReactMarkdown component

function CourseDetail() {
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();
  const { user, credentials } = useUserContext();  // Use the useUserContext hook to get the authenticated user

  // Use the useParams hook to get the route parameters
  const { id } = useParams();

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
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
  }, [id]); // Include id in the dependency array

  const handleDeleteCourse = async () => {
    const credentialsBase64 = btoa(`${credentials.emailAddress}:${credentials.password}`);
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${credentialsBase64}`,
        },
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
      <ReactMarkdown>{course.description}</ReactMarkdown>
      {user && user.id === course.userId && ( // Check if the authenticated user's ID matches the course owner's ID
        <>
          {/* Only show the "Update Course" and "Delete Course" buttons if the authenticated user's ID matches that of the course owner */}
          <button onClick={handleDeleteCourse}>Delete Course</button>
          <button onClick={() => navigate(`/courses/${id}/update`)}>Update Course</button>        </>
      )}
    </div>
  );
}

export default CourseDetail;
