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

  const [validationErrors, setValidationErrors] = useState([]);
  const { credentials } = useUserContext();

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
    fetchCourseDetails();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Client-side validation
    if (!formData.courseTitle || !formData.courseDescription) {
      setValidationErrors(['Please provide a value for "Title"', 'Please provide a value for "Description"']);
      return;
    }

    const credentialsBase64 = btoa(`${credentials.emailAddress}:${credentials.password}`);
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${credentialsBase64}`,
        },
        body: JSON.stringify({
        title: formData.courseTitle,
        description: formData.courseDescription,
        }),
      });

      if (response.ok) {
        navigate(`/courses/${id}`);
      } else {
        const data = await response.json();
        if (data.errors) {
          setValidationErrors(data.errors);
        }
      }
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  return (
    <div className="wrap">
      <h2>Update Course</h2>
      {validationErrors.length > 0 ? (
        <div className="validation--errors">
          <h3>Validation Errors</h3>
          <ul>
            {validationErrors.map((error, index) => <li key={index}>{error}</li>)}
          </ul>
        </div>
      ) : null}
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
            />

            <p>By Joe Smith</p>

            <label htmlFor="courseDescription">Course Description</label>
            <textarea
              id="courseDescription"
              name="courseDescription"
              value={formData.courseDescription}
              onChange={handleChange}
            />
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
