// src/components/Matrix.tsx
import React from 'react';
import './Matrix.css';
import Box1 from './boxes/Box1';
import Box2 from './boxes/Box2';
import Box3 from './boxes/Box3';
import Box4 from './boxes/Box4';
import Box5 from './boxes/Box5';
import Box6 from './boxes/Box6';
import Box7 from './boxes/Box7';
import Box8 from './boxes/Box8';
import Box9 from './boxes/Box9';


const Matrix: React.FC = () => {
    return (
      <div className="matrix">
        <div className="matrix-row">
          <Box1 />
          <Box2 />
          <Box3 />
        </div>
        <div className="matrix-row">
          <Box4 />
          <Box5 />
          <Box6 />
        </div>
        <div className="matrix-row">
          <Box7 />
          <Box8 />
          <Box9 />
        </div>
      </div>
    );
  };
  
export {Matrix};
