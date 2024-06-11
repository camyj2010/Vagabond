// import React from 'react';
// import { render, screen, fireEvent, waitFor, within  } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import Profile from './pages/profile/Profile';
// import { LanguageContextProvider } from './context/languageContext';
// import { AuthContext } from './context/authContext';

// const mockNavigate = jest.fn();
// const mockLogout = jest.fn();

// jest.mock('./context/authContext', () => ({
//   useAuth: () => ({
//     user: {
//       displayName: 'John Doe',
//       photoURL: 'https://example.com/photo.jpg',
//       email: 'john.doe@example.com',
//       accessToken: 'fakeAccessToken',
//       uid: 'fakeUid',
//     },
//     logout: mockLogout,
//   }),
// }));



// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useNavigate: () => mockNavigate,
// }));


// describe('Profile Component', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should render user information correctly', () => {
//     render(
//       <MemoryRouter>
//         <LanguageContextProvider>
//           <Profile />
//         </LanguageContextProvider>
//       </MemoryRouter>
//     );

//     expect(screen.getByText('John Doe')).toBeInTheDocument();
//     expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
//     expect(screen.getByAltText('Profile Picture').src).toBe('https://example.com/photo.jpg');
//   });

//   it('should navigate to /my_trips on back button click', () => {
//     render(
//       <MemoryRouter>
//         <LanguageContextProvider>
//           <Profile />
//         </LanguageContextProvider>
//       </MemoryRouter>
//     );

//     const backButton = screen.getByTestId('back-button');
//     fireEvent.click(backButton);
//     expect(mockNavigate).toHaveBeenCalledWith('/my_trips');
//   });

//   it('should navigate to edit_profile on edit button click', () => {
//     render(
//       <MemoryRouter>
//         <LanguageContextProvider>
//           <Profile />
//         </LanguageContextProvider>
//       </MemoryRouter>
//     );

//     const editButton = screen.getByTestId('edit-button');
//     fireEvent.click(editButton);
//     expect(mockNavigate).toHaveBeenCalledWith('edit_profile');
//   });

//   it('should call logout and navigate to /login on logout button click', async () => {
//     render(
//       <MemoryRouter>
//         <LanguageContextProvider>
//           <Profile />
//         </LanguageContextProvider>
//       </MemoryRouter>
//     );

//     const logoutButton = screen.getByRole('button', { name: /profile.logout/i }); 
//     fireEvent.click(logoutButton);

//     await waitFor(() => {
//       expect(mockLogout).toHaveBeenCalled();
//       expect(mockNavigate).toHaveBeenCalledWith('/login');
//     });
//   });

//   it('should update language on select change', () => {
//     render(
//       <MemoryRouter>
//         <LanguageContextProvider>
//           <Profile />
//         </LanguageContextProvider>
//       </MemoryRouter>
//     );


//   //const select = screen.getByRole('combobox', {id: 'demo-simple-select'});
//   const select = screen.getByTestId('language-select')
//   fireEvent.click(select)
//   const combobox = screen.getByRole('combobox', {id: 'demo-simple-select'});

//     });
// });