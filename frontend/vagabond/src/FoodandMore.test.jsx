import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import FoodandMore from './pages/myTrips/myTrip/FoodandMore';
import { LanguageContextProvider } from './context/languageContext';





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
        jest.mock('./context/languageContext', () => ({
          useLanguageContext: () => ({
            t: (key) => key,
          }),
        }));
      });

      afterEach(() => {
        jest.resetModules();  
      })

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
    expect(screen.getByText('Restaurant 1')).toBeInTheDocument();
    expect(screen.getByText('Restaurant 2')).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.includes('Fake City'))).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.includes('Fake Country'))).toBeInTheDocument();
  });

});
