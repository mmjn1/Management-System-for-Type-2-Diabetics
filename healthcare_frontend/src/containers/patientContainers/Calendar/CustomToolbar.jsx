import React from 'react';
import { Button } from 'react-bootstrap'; 

const CustomToolbar = ({ onAddClick }) => {
  return (
    <div>
      <Button onClick={onAddClick} variant="primary"> Add Event</Button>
    </div>
  );
};

export default CustomToolbar;