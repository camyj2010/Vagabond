import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Checklist from './pages/myTrips/MyTrip/Checklist';
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
  useLocation: () => ({
    state: {
      _id: 'fakeTripId',
      country: 'Fake Country',
      country_cod: 'FC',
      city: 'Fake City',
      init_date: '2023-01-01',
      finish_date: '2023-01-10',
    },
  }),
}));

jest.mock('./utils/connections', () => ({
  addCheckListItem: jest.fn(),
  deleteChecklistItem: jest.fn(),
  getChecklist: jest.fn(),
  toggleChecklistItem: jest.fn(),
}));

describe('Checklist Component', () => {
  beforeEach(async () => {
    const mockItems = [
      { _id: '1', element: 'Item 1', checked: false },
      { _id: '2', element: 'Item 2', checked: true },
    ];

    const { getChecklist } = require('./utils/connections');
    getChecklist.mockResolvedValueOnce({ elements: mockItems });

    render(
      <MemoryRouter initialEntries={['/checklist']}>
        <LanguageContextProvider>
          <Checklist />
        </LanguageContextProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Item 2/i)).toBeInTheDocument();
    });
  });

  it('should render Checklist component', async () => {
    expect(screen.getByText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('should render checklist items', async () => {
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Item 2/i)).toBeInTheDocument();
  });

  it('should add new item to checklist', async () => {
    const { addCheckListItem } = require('./utils/connections');
    addCheckListItem.mockResolvedValueOnce({ elements: [{ _id: '3', element: 'New Item', checked: false }] });

    fireEvent.change(screen.getByLabelText(/newItem/i), { target: { value: 'New Item' } });
    fireEvent.click(screen.getByRole('button', { name: /button/i }));

    await waitFor(() => {
      expect(screen.getByText(/New Item/i)).toBeInTheDocument();
    });
  });

  it('should toggle checklist item', async () => {
    const { toggleChecklistItem } = require('./utils/connections');
    const mockUpdatedItems = [
      { _id: '1', element: 'Item 1', checked: true },
      { _id: '2', element: 'Item 2', checked: true },
    ];
    toggleChecklistItem.mockResolvedValueOnce({ elements: mockUpdatedItems });

    await waitFor(() => {
      expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
    });

    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(toggleChecklistItem).toHaveBeenCalledWith('fakeAccessToken', 'fakeTripId', '1', true);
      expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
    });
  });

  it('should delete checklist item', async () => {
    const { deleteChecklistItem } = require('./utils/connections');
    const mockUpdatedItems = [
      { _id: '2', element: 'Item 2', checked: true },
    ];
    deleteChecklistItem.mockResolvedValueOnce({ elements: mockUpdatedItems });

    await waitFor(() => {
      expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
    });

    
    const deleteButtons = screen.getAllByRole('button', { hidden: true });
    fireEvent.click(deleteButtons[1]); 

    await waitFor(() => {
      expect(deleteChecklistItem).toHaveBeenCalledWith('fakeAccessToken', 'fakeTripId', '2');
      expect(screen.queryByText(/Item 1/i)).not.toBeInTheDocument();
    });
  });
});