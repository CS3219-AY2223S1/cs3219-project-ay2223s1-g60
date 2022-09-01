import React from 'react';
import '../matching-page.css';

function MatchingPage() {
  return (
    <div className='matching-page'>
      <div className='box'>
        <h1>Difficulty Setting</h1>
        <button>Easy</button>
        <button>Medium</button>
        <button>Hard</button>
      </div>
    </div>
  );
}

export default MatchingPage;
