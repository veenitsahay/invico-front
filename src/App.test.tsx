import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

test('renders app root routes', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  expect(screen.getByText(/login \/ sign up/i)).toBeInTheDocument();
});
