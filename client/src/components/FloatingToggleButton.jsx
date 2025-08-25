// FloatingToggleButton.jsx
import React from 'react';

export default function FloatingToggleButton({ onClick, showInfo }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        top: '50%',
        right: 0,
        transform: 'translateY(-50%)',
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '0px 10px 5px 5px',
        borderTopLeftRadius: '9999px',
        borderBottomLeftRadius: '9999px',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        fontWeight: 'bold',
        zIndex: 9999,
        cursor: 'pointer',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}
    >
      <span style={{ fontSize: '4rem' }}>
        {showInfo ? '👁️' : '🙈'}
      </span>
      {showInfo ? 'Hide Info' : 'Show Info'}
    </button>
  );
}
