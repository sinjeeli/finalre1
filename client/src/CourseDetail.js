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

    //
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
      // Navigate back to the course list
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
      <div className="actions--bar">
        <div className="wrap">
          {user && user.id === course.userId && ( 
            <>
              <button className="button" onClick={() => navigate(`/courses/${id}/update`)}>Update Course</button>
              <button className="button" onClick={handleDeleteCourse}>Delete Course</button>
            </>
          )}
          <button className="button button-secondary" onClick={() => navigate('/')}>Return to List</button>
        </div>
      </div>
      <div className="wrap">
        <h2>Course Detail</h2>
        <form>
          <div className="main--flex">
            <div>
              <h3 className="course--detail--title">Course</h3>
              <h4 className="course--name">{course.title}</h4>
              <p>By {course.User.firstName} {course.User.lastName}</p>
              <ReactMarkdown className="course--detail--title">{course.description}</ReactMarkdown>
            </div>
            <div>
              <h3 className="course--detail--title">Estimated Time</h3>
              <p>{course.estimatedTime}</p>
              <h3 className="course--detail--title">Materials Needed</h3>
              <ReactMarkdown>{course.materialsNeeded}</ReactMarkdown>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CourseDetail;