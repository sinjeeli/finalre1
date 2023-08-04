import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Courses from './Courses';
import CourseDetail from './CourseDetail';
import CreateCourse from './CreateCourse';
import UserSignIn from './UserSignIn';
import UpdateCourse from './UpdateCourse';
import UserSignOut from './UserSignOut';
import UserSignUp from './UserSignUp';
import { UserProvider } from './UserContext'; // Import the UserProvider
import PrivateRoute from './PrivateRoute';



import Header from './Header';

import './App.css';

function App() {
  const user = null; // Replace null with the authenticated user object or null if not authenticated

  return (
    <Router>
      <UserProvider>
        <div>
          <header>
            <Header user={user} /> {/* Pass the user prop to the Header component */}
          </header>
          <main>
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/create">Create Course</Link>
                </li>
                {/* Add other navigation links as needed */}
              </ul>
            </nav>
            <Routes>
              <Route path="/" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <PrivateRoute path="/create" element={<CreateCourse />} />
              <Route path="/sign-in" element={<UserSignIn />} />
              <PrivateRoute path="/courses/:id/update" element={<UpdateCourse />} />
              <Route path="/sign-up" element={<UserSignUp />} />
              <Route path="/sign-out" element={<UserSignOut />} />

              {/* Other routes... */}
            </Routes>
          </main>
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
