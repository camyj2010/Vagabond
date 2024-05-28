// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import { LanguageContextProvider } from './context/languageContext';
// import Login from './pages/login/Login';

// jest.mock('./context/authContext', () => ({
//     useAuth: () => ({
//       login: jest.fn(),
//       loginWithGoogle: jest.fn()
//     })
//   }));

// describe('Login component', () => {
//   test('renders login form correctly', async () => {
//     const { getByLabelText, getByText } = render(
//       <LanguageContextProvider>
//         <MemoryRouter>
//           <Login />
//         </MemoryRouter>
//       </LanguageContextProvider>
//     );
  
//     const emailInput = getByLabelText(/Email/i);
//     const passwordInput = getByLabelText(/Password/i);
//     const loginButton = getByText(/Sign in/i);
//     const googleSignInButton = getByText(/Sign in with Google/i);
//     const signUpLink = getByText(/Sign up right now/i);

//     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
//     fireEvent.change(passwordInput, { target: { value: 'password123' } });

//     fireEvent.click(loginButton);

//   });
// });