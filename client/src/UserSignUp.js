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
  
    const errors = [];
    if (!formData.firstName) errors.push('First name is required.');
    if (!formData.lastName) errors.push('Last name is required.');
    if (!formData.emailAddress) {
      errors.push('Email address is required.');
    } else if (!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(formData.emailAddress)) {
      errors.push('Email address is not valid.');
    }
    if (!formData.password) errors.push('Password is required.');
    
    if (errors.length > 0) {
      setValidationErrors(errors);
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
        />

        <label htmlFor="lastName">Last Name</label>
        <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
        />

        <label htmlFor="emailAddress">Email Address</label>
        <input
            id="emailAddress"
            name="emailAddress"
            type="email"
            value={formData.emailAddress}
            onChange={handleChange}
        />

        <label htmlFor="password">Password</label>
        <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
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
