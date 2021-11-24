import { render, screen } from '@testing-library/react';
import App from './App';

test('renders backend says', () => {
  render(<App />);
  const linkElement = screen.getByText(/Backend says:/i);
  expect(linkElement).toBeInTheDocument();
});
