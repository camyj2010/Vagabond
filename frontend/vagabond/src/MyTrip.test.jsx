import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MyTrip from './pages/myTrips/myTrip/MyTrip';
import { LanguageContextProvider } from './context/languageContext';

jest.mock('./context/authContext', () => ({
  useAuth: () => ({
    user: {
      accessToken: 'fakeAccessToken',
      uid: 'fakeUid',
    },
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'fakeTripId',
  }),
}));

jest.mock('./utils/connections', () => ({
  getTrip: jest.fn(),
}));

describe('MyTrip Component', () => {
  it('should render trip suggestions if trip data is available', async () => {
    const { getTrip } = require('./utils/connections'); 
    const mockTrip = {
      country: 'Fake Country',
      country_cod: 'FC',
      city: 'Fake City',
      init_date: '2023-01-01',
      finish_date: '2023-01-10',
      suggestions: [
        { location: 'Suggestion 1', description: 'Description 1' },
        { location: 'Suggestion 2', description: 'Description 2' },
      ],
    };

    getTrip.mockResolvedValueOnce({ travel: mockTrip });

    render(
      <MemoryRouter>
        <LanguageContextProvider>
          <MyTrip />
        </LanguageContextProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Suggestion 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Suggestion 2')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });
  });

  // it('should render "No hay nada" if trip data is not available', async () => {
  //   const { getTrip } = require('./utils/connections'); 

  //   getTrip.mockResolvedValueOnce(null);

  //   render(
  //     <MemoryRouter>
  //       <LanguageContextProvider>
  //         <MyTrip />
  //       </LanguageContextProvider>
  //     </MemoryRouter>
  //   );

  //   await waitFor(() => {
  //     expect(screen.getByText('No hay nada')).toBeInTheDocument();
  //   });
  // });
});