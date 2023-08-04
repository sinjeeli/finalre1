// App.js
import { BrowserRouter as Router, Route, Link, Navigate, Routes } from 'react-router-dom';
import { useUserContext } from './UserContext';
import Courses from './Courses';
import CourseDetail from './CourseDetail';
import CreateCourse from './CreateCourse';
import UserSignIn from './UserSignIn';
import UpdateCourse from './UpdateCourse';
import UserSignOut from './UserSignOut';
import UserSignUp from './UserSignUp';
import { UserProvider } from './UserContext';
import NotFound from './NotFound'; // <-- import NotFound component
import UnhandledError from './UnhandledError'; // <-- import UnhandledError component
import Header from './Header';


import './App.css';

function ProtectedRoutes() {
  const { user } = useUserContext();

  return (
    <Routes>
      <Route path="/" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/create-course" element={user ? <CreateCourse /> : <Navigate to="/sign-in" state={{ from: '/create-course' }} />} />
      <Route path="/sign-in" element={<UserSignIn />} />
      <Route path="/courses/:id/update" element={user ? <UpdateCourse /> : <Navigate to="/sign-in" state={{ from: '/courses/:id/update' }} />} />
      <Route path="/sign-up" element={<UserSignUp />} />
      <Route path="/sign-out" element={<UserSignOut />} />
      <Route path="/notfound" element={<NotFound />} /> {/* <-- add NotFound route */}
      <Route path="/error" element={<UnhandledError />} /> {/* <-- add UnhandledError route */}
      <Route path="*" element={<Navigate to="/notfound" />} /> {/* <-- catch-all route */}
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
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/create-course">Create Course</Link>
                </li>
                {/* Add other navigation links as needed */}
              </ul>
            </nav>
            <ProtectedRoutes />
          </main>
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
