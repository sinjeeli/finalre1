import { Route, Navigate, useLocation } from 'react-router-dom';
import { useUserContext } from './UserContext';

function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useUserContext();
  const location = useLocation();

  return (
    <Route 
      {...rest} 
      element={
        user 
          ? <Component /> 
          : <Navigate to="/sign-in" state={{ from: location }} replace />
      } 
    />
  );
}

export default PrivateRoute;
