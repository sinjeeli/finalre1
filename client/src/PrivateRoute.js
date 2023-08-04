import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useUserContext } from './UserContext';

function PrivateRoute({ element: Element, ...rest }) {
  const { user } = useUserContext();

  return (
    <Route
      {...rest}
      element={
        user ? (
          <Element />
        ) : (
          <Navigate to="/sign-in" replace state={{ from: rest.location.pathname }} />
        )
      }
    />
  );
}

export default PrivateRoute;
