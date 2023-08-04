import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserSignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState([]);

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
    if (!formData.firstName || !formData.lastName || !formData.emailAddress || !formData.password) {
      setValidationErrors(['All fields are required']);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        navigate('/');
      } else {
        const data = await response.json();
        if (data.errors) {
          setValidationErrors(data.errors);
        }
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };
  
  return (
    <div className="form--centered">
      <h2>Sign Up</h2>
      {validationErrors.length > 0 ? (
        <div className="validation--errors">
          <h3>Validation Errors</h3>
          <ul>
            {validationErrors.map((error, index) => <li key={index}>{error}</li>)}
          </ul>
        </div>
      ) : null}
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            required
        />

        <label htmlFor="lastName">Last Name</label>
        <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            required
        />

        <label htmlFor="emailAddress">Email Address</label>
        <input
            id="emailAddress"
            name="emailAddress"
            type="email"
            value={formData.emailAddress}
            onChange={handleChange}
            required
        />

        <label htmlFor="password">Password</label>
        <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
        />

        <button className="button" type="submit">
            Sign Up
        </button>
        <button
            className="button button-secondary"
            onClick={() => navigate('/')}
        >
            Cancel
        </button>        
      </form>
      <p>
        Already have a user account? Click here to <a href="/sign-in">sign in</a>!
      </p>
    </div>
  );
}

export default UserSignUp;
