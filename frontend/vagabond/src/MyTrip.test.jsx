import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
  uploadAudio: jest.fn(),
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


  it('should update textfield, dropdowns and handle recording button click', async () => {
    const { getTrip, uploadAudio } = require('./utils/connections'); 
    const mockTrip = {
      country: 'Fake Country',
      country_cod: 'FC',
      city: 'Fake City',
      init_date: '2023-01-01',
      finish_date: '2023-01-10',
      suggestions: [],
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
      expect(screen.getByText('Fake Country')).toBeInTheDocument();
      //fireEvent.change(screen.getByLabelText('From'), { target: { value: mockLanguageAudio } });
      //fireEvent.change(screen.getByLabelText('To'), { target: { value: mockLanguageObjective } });
    });

    const mockGetUserMedia = jest.fn().mockResolvedValue({
      getTracks: () => [{ stop: jest.fn() }]
    });
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: mockGetUserMedia
      }
    });

        const mockMediaRecorder = {
          start: jest.fn(),
          stop: jest.fn(),
          addEventListener: jest.fn((event, callback) => {
            if (event === 'dataavailable') {
              callback({ data: new Blob([], { type: 'audio/webm' }) });
            }
            if (event === 'stop') {
              callback();
            }
          })
        };
    window.MediaRecorder = jest.fn().mockImplementation(() => mockMediaRecorder);

    

    const recordButton = screen.getByRole('button', { name: '' })

    fireEvent.mouseDown(screen.getByLabelText(/from/i));
    const englishMenuItem = screen.getByRole('option', { name: 'English' });
    fireEvent.click(englishMenuItem);


    fireEvent.mouseDown(screen.getByLabelText(/to/i));

    const spanishMenuItem = screen.getByRole('option', { name: 'Spanish' });
    fireEvent.click(spanishMenuItem);

    const textField = screen.getByLabelText(/text/i);
    fireEvent.change(textField, { target: { value: 'Test input' } });
    expect(textField.value).toBe('Test input');

    fireEvent.click(recordButton);
    //expect(mockMediaRecorder.start).toHaveBeenCalled();

    fireEvent.click(recordButton);
    //expect(mockMediaRecorder.stop).toHaveBeenCalled();
  });


});