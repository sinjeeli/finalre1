import { Link } from 'react-router-dom';

function UnhandledError() {
  return (
    <div className="wrap">
      <h2>Error</h2>
      <p>Sorry! We just encountered an unexpected error.</p>
      <Link to="/">Return to Course List</Link>
    </div>
  );
}

export default UnhandledError;
