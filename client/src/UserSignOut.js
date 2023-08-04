import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './UserContext';

function UserSignOut() {
  const navigate = useNavigate();
  const { signOut } = useUserContext();

  useEffect(() => {
    signOut();
    navigate('/');
  }, [signOut, navigate]);

  return null;
}

export default UserSignOut;
