import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { useUserContext } from './UserContext';
import Courses from './Courses';
import CourseDetail from './CourseDetail';
import CreateCourse from './CreateCourse';
import UserSignIn from './UserSignIn';
import UpdateCourse from './UpdateCourse';
import UserSignOut from './UserSignOut';
import UserSignUp from './UserSignUp';
import { UserProvider } from './UserContext';
import NotFound from './NotFound'; 
import UnhandledError from './UnhandledError'; 
import Header from './Header';
import Forbidden from './Forbidden'; 
import React, { useEffect } from 'react';


import './App.css';
//
console.log("App rendered");
//

function ProtectedRoutes() {
  const { user, isLoading } = useUserContext();
  //
  useEffect(() => {
    console.log("User updated:", user);
  }, [user]);

  //
  if (isLoading) {
    return <div>Loading...</div>;  // 
  }
  //


  console.log("User in ProtectedRoutes:", user);

  return (
    <Routes>
      <Route path="/" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/create-course" element={user ? <CreateCourse /> : <Navigate to="/sign-in" state={{ from: '/create-course' }} />} />
      <Route path="/sign-in" element={<UserSignIn />} />
      <Route path="/courses/:id/update" element={user ? <UpdateCourse /> : <Navigate to="/sign-in" state={{ from: '/courses/:id/update' }} />} />
      <Route path="/sign-up" element={<UserSignUp />} />
      <Route path="/sign-out" element={<UserSignOut />} />
      <Route path="/notfound" element={<NotFound />} /> 
      <Route path="/error" element={<UnhandledError />} /> 
      <Route path="/forbidden" element={<Forbidden />} /> 
      <Route path="*" element={<Navigate to="/notfound" />} /> 
    </Routes>
  );
}
function App() {
  return (
    <Router>
      <UserProvider>
        <div>
          <header>
            <Header />
          </header>
          <main>
            <ProtectedRoutes />
          </main>
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;

