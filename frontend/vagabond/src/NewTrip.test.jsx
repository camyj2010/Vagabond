import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageContextProvider } from './context/languageContext';
import NewTrip from "./pages/newTrip/NewTrip";

jest.mock('./context/authContext', () => ({
  useAuth: () => ({
    user: {
      accessToken: 'fakeAccessToken',
      uid: 'fakeUid',
    },
  }),
}));

jest.mock('./utils/connections', () => ({
  createNewTrip: jest.fn(() => Promise.resolve({ data: 'success' })),
}));

describe('NewTrip component', () => {
  beforeEach(() => {
    render(
      <LanguageContextProvider>
        <MemoryRouter>
          <NewTrip />
        </MemoryRouter>
      </LanguageContextProvider>
    );
  });

  it('renders NewTrip form with required fields', () => {
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByText(/startDate/i)).toBeInTheDocument();
    expect(screen.getByText(/endDate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/describeTrip/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /newTrip.button/i })).toBeInTheDocument();
  });

});
