import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './UserContext'; // make sure the path is correct

function CreateCourse() {
  const navigate = useNavigate();
  const { user, credentials } = useUserContext(); // <-- Call the hook here, at the top level of your component

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    userId: user.id, // Assuming the 'user' object contains an 'id' property
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
  
    const credentialsBase64 = btoa(`${credentials.emailAddress}:${credentials.password}`); // <-- Use 'user' from the top-level context
  
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
        if (text) { // Only parse the response text as JSON if there is any text
          const errorData = JSON.parse(text);
          if (errorData.errors) {
            setValidationErrors(errorData.errors);
          }
        }
      } // This closing bracket was missing
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
