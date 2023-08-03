import React from 'react';
import { Link } from 'react-router-dom';

function Header({ user }) {
  return (
    <header>
      <div className="wrap header--flex">
        <h1 className="header--logo">
          <Link to="/">Courses</Link>
        </h1>
        <nav>
          <ul className="header--signedin">
            {user ? (
              <>
                <li>Welcome, {user.name}!</li>
                <li>
                  <Link to="/sign-out">Sign Out</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/sign-up">Sign Up</Link>
                </li>
                <li>
                  <Link to="/sign-in">Sign In</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
