
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './floating.css'

function FloatingButton() {
  const navigate = useNavigate()
  const location = useLocation()
  const handleClick = () => {
    navigate('/doctor/prescription')
  }
  const isButtonActive = location.pathname !== '/doctor/prescription'

  return (
    <div
      className={`floating-button ${isButtonActive ? '' : 'inactive'}`}
      onClick={isButtonActive ? handleClick : null} // Disable click if inactive
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        aria-hidden='true'
        role='img'
        className='MuiBox-root css-1t9pz9x iconify iconify--mdi'
        width='2em'
        height='2em'
        viewBox='0 0 24 24'
      >
        <path
          fill='currentColor'
          d='M4 4v10h2v-4h2l5.41 5.41L9.83 19l1.41 1.41l3.59-3.58l3.58 3.58L19.82 19l-3.58-3.59l3.58-3.58l-1.41-1.42L14.83 14l-4-4H11a3 3 0 0 0 3-3a3 3 0 0 0-3-3zm2 2h5a1 1 0 0 1 1 1a1 1 0 0 1-1 1H6z'
        />
      </svg>
    </div>
  )
}

export default FloatingButton
