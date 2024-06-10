import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FoodandMore from './pages/myTrips/myTrip/FoodandMore';
import { LanguageContextProvider } from './context/languageContext';
import { useAuth } from './context/authContext';
import { foodDescription } from './utils/connections';

jest.mock('./context/authContext', () => ({
  useAuth: () => ({
    user: {
      accessToken: 'fakeAccessToken',
      uid: 'fakeUid',
    },
  }),
}));
jest.mock('./utils/connections');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: {
      country: 'Fake Country',
      country_cod: 'FC',
      city: 'Fake City',
      init_date: '2023-01-01',
      finish_date: '2023-01-10',
      restaurant_recomendations: ['Restaurant 1', 'Restaurant 2'],
    },
  }),
}));

describe('FoodandMore component', () => {
  beforeEach(() => {

    foodDescription.mockResolvedValue({
      ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3']
    });
  });

  it('should render with provided state data', () => {
    render(
      <MemoryRouter>
        <LanguageContextProvider>
          <FoodandMore />
        </LanguageContextProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('foodandMore.title')).toBeInTheDocument();
    expect(screen.getByText('foodandMore.discover')).toBeInTheDocument();
    expect(screen.getByText('Restaurant 1', { container: document.querySelector('.restaurant-container') })).toBeInTheDocument();
    expect(screen.getByText('Restaurant 2', { container: document.querySelector('.restaurant-container') })).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.includes('Fake City'))).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.includes('Fake Country'))).toBeInTheDocument();
    
  });

  it('should display ingredients after form submission', async () => {
    render(
      <MemoryRouter>
        <LanguageContextProvider>
          <FoodandMore />
        </LanguageContextProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/textField/i), { target: { value: 'Test Food' } });
    fireEvent.click(screen.getByRole('button', { name: 'foodandMore.button' }));

    await waitFor(() => {
      expect(screen.getByText('Ingredient 1')).toBeInTheDocument();
      expect(screen.getByText('Ingredient 2')).toBeInTheDocument();
      // Add more expectations as needed
    });
  });
});