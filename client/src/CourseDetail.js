import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    fetchCourse();
  }, [id]); // the dependency array should contain id instead of fetchCourse

  return course ? (
    <div className="wrap">
      <h2>Course Detail</h2>
      {/* Display course details... */}
      <p>{course.title}</p>
      {/* Other details... */}
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default CourseDetail;
