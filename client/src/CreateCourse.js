import React from 'react';
import { useNavigate } from 'react-router-dom';

function CreateCourse() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit form...
    navigate('/');
  };

  return (
    <div className="wrap">
      <h2>Create Course</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields... */}
        <button type="submit">Create Course</button>
      </form>
    </div>
  );
}

export default CreateCourse;
