import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateCourse() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    // Add other form fields here as needed
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
    try {
      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.errors) {
          setValidationErrors(data.errors);
        }
      } else {
        // Assuming you want to navigate back to the course list after successful creation
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  return (
    <div className="wrap">
      <h2>Create Course</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          {validationErrors.title && (
            <p className="validation--errors">{validationErrors.title}</p>
          )}
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          {validationErrors.description && (
            <p className="validation--errors">{validationErrors.description}</p>
          )}
        </div>
        {/* Add other form fields here as needed */}
        <button type="submit">Create Course</button>
      </form>
      <button onClick={() => navigate('/')}>Cancel</button>
    </div>
  );
}

export default CreateCourse;
