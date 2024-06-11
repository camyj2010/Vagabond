import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditProfile from './pages/profile/EditProfile';
import { LanguageContextProvider } from './context/languageContext';
import { AuthContext } from './context/authContext';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from './context/authContext';

const mockUpdate = jest.fn()
// Mock del contexto de autenticación
jest.mock('./context/authContext', () => ({
    useAuth: () => ({
      user: {
        displayName: 'John Doe',
        photoURL: 'https://example.com/photo.jpg',
        email: 'john.doe@example.com',
        accessToken: 'fakeAccessToken',
        uid: 'fakeUid',
      },
       updateProfileData: mockUpdate,
    }),
  }));
  

describe('EditProfile Component', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <LanguageContextProvider>
          <EditProfile />
        </LanguageContextProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/editProfile.title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/editProfile.name/i)).toBeInTheDocument();
    expect(screen.getByText(/editProfile.email/i)).toBeInTheDocument();
    expect(screen.getByText(/editProfile.image/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /editProfile.button/i })).toBeInTheDocument();
  });

  it('updates profile data correctly', async () => {
    render(
        <MemoryRouter>
        <LanguageContextProvider>
          <EditProfile />
        </LanguageContextProvider>
      </MemoryRouter>
    );

    // Simular cambios en el nombre y hacer clic en el botón de guardar
    fireEvent.change(screen.getByRole('textbox', { value: 'John Doe' }), { target: { value: 'New Name' } });
    fireEvent.click(screen.getByRole('button', { name: /editProfile.button/i }));

  });

  it('allows changing the profile picture', () => {
    render(
      <MemoryRouter>
    <LanguageContextProvider>
    <EditProfile />
  </LanguageContextProvider>
    </MemoryRouter>
    );

    // Simular clic en el enlace para editar la foto
    fireEvent.click(screen.getByText(/editProfile.image/i));

    // Simular la selección de un archivo de imagen
    const file = new File(['(⌐□_□)'], 'test.jpg', { type: 'image/jpg' });
    const input = screen.getByTestId('image-edit-input');
    fireEvent.change(input, { target: { files: [file] } });

    // Verificar que se haya actualizado la URL de la foto
    //expect(screen.getByAltText('Profile Picture')).toHaveAttribute('src', 'test.jpg');
  });
});