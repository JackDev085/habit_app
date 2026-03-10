import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from './Home';

describe('Home Component', () => {
  it('renders the Home page correctly', () => {
    render(<Home />);
    
    // Check if the headings are present
    expect(screen.getByText(/Hoje é dia/i)).toBeInTheDocument();
    expect(screen.getByText(/Avaliação Pré-Treino/i)).toBeInTheDocument();
    expect(screen.getByText(/Avaliação Pós-Treino/i)).toBeInTheDocument();
  });

  it('opens the pre-training modal when clicking the button', () => {
    render(<Home />);
    
    // Get the button
    const preTreinoBtn = screen.getByText(/Avaliação Pré-Treino/i);
    
    // Click it
    fireEvent.click(preTreinoBtn);
    
    // Verify modal content is shown
    // ModalAvaliacao renders an h2 with the title
    const modalTitle = screen.getByRole('heading', { name: "Avaliação Pré-Treino" });
    expect(modalTitle).toBeInTheDocument();
  });

  it('opens the post-training modal when clicking the button', () => {
    render(<Home />);
    
    // Get the button
    const posTreinoBtn = screen.getByText(/Avaliação Pós-Treino/i);
    
    // Click it
    fireEvent.click(posTreinoBtn);
    
    // Verify modal content is shown
    const modalTitle = screen.getByRole('heading', { name: "Avaliação Pós-Treino" });
    expect(modalTitle).toBeInTheDocument();
  });
});
