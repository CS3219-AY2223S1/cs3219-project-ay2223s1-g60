import React from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const user = useUser();
  const navigate = useNavigate();

  return (
    <div>
      <p>SUCCESSFULLY LOGGED {user.username} IN</p>
      <button onClick={() => navigate('/match')}>Find Match</button>
    </div>
  );
}

export default HomePage;
