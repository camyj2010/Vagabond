// import React from 'react';
// import { prettyDOM } from '@testing-library/react';
// import { render, screen } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import Register from './pages/register/Register';
// import { LanguageContextProvider } from './context/languageContext';
// //import i18n from './i18n';

// jest.mock('firebase/auth', () => ({
//     getAuth: jest.fn(() => ({
//       createUserWithEmailAndPassword: jest.fn(() => Promise.resolve()),
//     })),
//   }));

// describe('Register Component', () => {
//   beforeEach(() => {
//     render(
//       <LanguageContextProvider>
//         <MemoryRouter>
//         <Register />
//         </MemoryRouter>
//       </LanguageContextProvider>
//     );
//   });

  

//   it('renders Register form with required fields', () => {
//     expect(screen.getByRole('textbox', { name: /register.fullName/i })).toBeInTheDocument();
//     expect(screen.getByRole('textbox', { name: /register.email/i })).toBeInTheDocument();
//     expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
//   });

//   it('renders Register button', () => {
//     expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
//   });

//   it('renders already have account message with sign in link', () => {
//     expect(screen.getByText(/alreadyAccount/i)).toBeInTheDocument();
//   });

//   it('renders terms and privacy message with links', () => {
//     expect(screen.getByText(/accepts/i)).toBeInTheDocument();
//     expect(screen.getByText(/terms/i).closest('span')).toHaveStyle({ fontWeight: 'bold' });
//     expect(screen.getByText(/privacy/i).closest('span')).toHaveStyle({ fontWeight: 'bold' });
//   });
// });