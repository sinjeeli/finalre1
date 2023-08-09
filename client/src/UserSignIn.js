import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';  
import { useUserContext } from './UserContext'; // Import the useUserContext hook

function UserSignIn() {
    const navigate = useNavigate();
    const location = useLocation();  
    const { signIn } = useUserContext(); 
    //
    
    const [formData, setFormData] = useState({
      emailAddress: '',
      password: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
        const { emailAddress, password } = formData;
        const success = await signIn(emailAddress, password);
        if (success) {
          navigate(location.state?.from || '/');  // <-- Change navigate here
        }
      };

  return (
    <div className="form--centered">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
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
          Sign In
        </button>
        <button
          className="button button-secondary"
          onClick={() => navigate('/')}
        >
          Cancel
        </button>
      </form>
      <p>
        Don't have a user account? Click here to <Link to="/sign-up">Sign Up</Link>
      </p>
    </div>
  );
}

export default UserSignIn;
