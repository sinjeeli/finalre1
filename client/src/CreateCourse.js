import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './UserContext';

function CreateCourse() {
  const navigate = useNavigate();
  const { user, credentials } = useUserContext();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    userId: user.id,
  });

  const [validationErrors, setValidationErrors] = useState({});

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
    if (!formData.title || !formData.description) {
      setValidationErrors(['Please provide a value for "Title"', 'Please provide a value for "Description"']);
      return;
    }
  
    const credentialsBase64 = btoa(`${credentials.emailAddress}:${credentials.password}`);
  
    try {
      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentialsBase64}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        navigate('/');
      } else {
        const text = await response.text();
        if (text) {
          const errorData = JSON.parse(text);
          if (errorData.errors) {
            
            setValidationErrors(errorData.errors);
          }
        }
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };
  
  
  return (
    <div className="wrap">
      <h2>Create Course</h2>
      {
  validationErrors.length > 0 ? (
    <div className="validation--errors">
      <h3>Validation Errors</h3>
      <ul>
        {validationErrors.map((error, index) => <li key={index}>{error}</li>)}
      </ul>
    </div>
  ) : null
}

      <form onSubmit={handleSubmit}>
        <div className="main--flex">
          <div>
            <label htmlFor="courseTitle">Course Title</label>
            <input
              id="courseTitle"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
            />
            <p>By {user.firstName} {user.lastName}</p>
            <label htmlFor="courseDescription">Course Description</label>
            <textarea
              id="courseDescription"
              name="description"
              onChange={handleChange}
              value={formData.description}
            ></textarea>
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
              onChange={handleChange}
              value={formData.materialsNeeded}
            ></textarea>
          </div>
        </div>
        <button className="button" type="submit">Create Course</button>
        <button className="button button-secondary" onClick={() => navigate('/')}>Cancel</button>
      </form>
    </div>
  );
}

export default CreateCourse;
