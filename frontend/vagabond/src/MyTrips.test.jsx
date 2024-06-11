// import React from 'react';
// import { prettyDOM } from '@testing-library/react';
// import { render, screen , waitFor, fireEvent } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { MemoryRouter } from 'react-router-dom';
// import MyTrips from './pages/myTrips/MyTrips';
// import { LanguageContextProvider } from './context/languageContext';
// import { getUserTrips } from './utils/connections';
// //import i18n from './i18n';

// jest.mock('./context/authContext', () => ({
//     useAuth: () => ({
//       user: {
//         accessToken: 'fakeAccessToken',
//         uid: 'fakeUid',
//       },
//     }),
//   }));
  
// jest.mock('./utils/connections', () => ({
//     getUserTrips: jest.fn(() => Promise.resolve({ travels: [], currentTravel: null })),
//   }));

// describe('Register Component', () => {
//   beforeEach(() => {
//     render(
//       <LanguageContextProvider>
//         <MemoryRouter>
//         <MyTrips />
//         </MemoryRouter>
//       </LanguageContextProvider>
//     );
//   });

  

//   it('should render current trip correctly', async () => {
    
//     await waitFor(() => expect(screen.getByText(/currentTrip/i)).toBeInTheDocument());
//     expect(screen.getByRole('button', { name: /myTrips.button/i })).toBeInTheDocument();
//   });

//   it('should render trips correctly', async () => {
//     // await waitFor(() => expect(getUserTrips).toHaveBeenCalledTimes(1));
//     expect(screen.getByText(/yourTrips/i)).toBeInTheDocument();

//     expect(screen.getByText(/currentTrip/i)).toBeInTheDocument();
//   });

//   it('should navigate to new_trip page when clicking on "Create a new trip" button', async () => {

//     const myTripsButton = screen.getByRole('button', { name: /myTrips.button/i });

//     expect(myTripsButton).toBeInTheDocument();

//     fireEvent.click(myTripsButton);

//   });
// });