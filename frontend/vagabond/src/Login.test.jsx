import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageContextProvider } from './context/languageContext';
import Login from './pages/login/Login';

jest.mock('./context/authContext', () => ({
    useAuth: () => ({
      login: jest.fn(),
      loginWithGoogle: jest.fn()
    })
  }));

describe('Login component', () => {
  test('renders login form correctly', async () => {
    const { getByLabelText, getByText } = render(
      <LanguageContextProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </LanguageContextProvider>
    );
  
    const emailInput = getByLabelText(/email/i);
    const passwordInput = getByLabelText(/password/i);
    const loginButton = getByText(/signIn/i);
    const googleSignInButton = getByText(/signInGoogle/i);
    const signUpLink = getByText(/signUp/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(loginButton);

  });
});