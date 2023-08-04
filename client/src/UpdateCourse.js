import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserContext } from './UserContext';

function UpdateCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseTitle: '',
    courseDescription: '',
    estimatedTime: '',
    materialsNeeded: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const { credentials } = useUserContext(); // <-- Added this line

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFormData({
            courseTitle: data.title || '',
            courseDescription: data.description || '',
            estimatedTime: data.estimatedTime || '',
            materialsNeeded: data.materialsNeeded || '',
        });
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };
    fetchCourseDetails(); // Call the fetchCourseDetails function here
  }, [id]); // Add id as a dependency to the useEffect hook

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const credentialsBase64 = btoa(`${credentials.emailAddress}:${credentials.password}`);
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${credentialsBase64}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.errors) {
          setValidationErrors(data.errors);
        }
      } else {
        // Assuming you want to navigate back to the course detail after successful update
        navigate(`/courses/${id}`);
      }
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  return (
    <div className="wrap">
      <h2>Update Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="main--flex">
          <div>
            <label htmlFor="courseTitle">Course Title</label>
            <input
              id="courseTitle"
              name="courseTitle"
              type="text"
              value={formData.courseTitle}
              onChange={handleChange}
              required
            />
            {validationErrors.title && (
              <p className="validation--errors">{validationErrors.title}</p>
            )}

            {/* Display the course owner (e.g., "By Joe Smith") */}
            <p>By Joe Smith</p>

            <label htmlFor="courseDescription">Course Description</label>
            <textarea
              id="courseDescription"
              name="courseDescription"
              value={formData.courseDescription}
              onChange={handleChange}
              required
            />
            {validationErrors.description && (
              <p className="validation--errors">{validationErrors.description}</p>
            )}
          </div>
          <div>
            <label htmlFor="estimatedTime">Estimated Time</label>
            <input
              id="estimatedTime"
              name="estimatedTime"
              type="text"
              value={formData.estimatedTime}
              onChange={handleChange}
            />

            <label htmlFor="materialsNeeded">Materials Needed</label>
            <textarea
              id="materialsNeeded"
              name="materialsNeeded"
              value={formData.materialsNeeded}
              onChange={handleChange}
            />
          </div>
        </div>
        <button className="button" type="submit">
          Update Course
        </button>
        <button
          className="button button-secondary"
          onClick={() => navigate(`/courses/${id}`)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default UpdateCourse;
