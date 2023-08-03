//              import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserSignOut() {
  const navigate = useNavigate();

  // Perform user sign-out logic here...

  // Redirect the user to the default route (list of courses)
  navigate('/');

  // The UserSignOut component doesn't render any visual elements
  return null;
}

export default UserSignOut;
