import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeachList from './TeachList';

jest.mock('@mui/material/Tooltip', () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>
}));

const baseTeach = {
  id: 'teach-1',
  details: '<p>Detail</p>',
  description: '<p>Description</p>',
  order: 1,
  visible: true
};

describe('TeachList', () => {
  it('renders teaching items and triggers callbacks when authenticated', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onToggleVisibility = jest.fn();
    const onOrderChange = jest.fn();
    const onOrderCommit = jest.fn().mockResolvedValue(undefined);

    render(
      <TeachList
        teachings={[baseTeach]}
        language="en"
        isAuthenticated
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleVisibility={onToggleVisibility}
        onOrderChange={onOrderChange}
        onOrderCommit={onOrderCommit}
      />
    );

    const card = screen.getByTestId('teach-card-teach-1');
    fireEvent.mouseEnter(card);

    await user.click(screen.getByRole('button', { name: /hide teaching item/i }));
    expect(onToggleVisibility).toHaveBeenCalledWith('teach-1', false);

    await user.click(screen.getByRole('button', { name: /edit teaching item/i }));
    expect(onEdit).toHaveBeenCalledWith(baseTeach);

    await user.click(screen.getByRole('button', { name: /delete teaching item/i }));
    expect(onDelete).toHaveBeenCalledWith('teach-1');

    const orderInput = screen.getByLabelText(/order/i);
    await user.clear(orderInput);
    await user.type(orderInput, '3');
    expect(onOrderChange).toHaveBeenLastCalledWith('teach-1', 3);

    fireEvent.blur(orderInput);
    await waitFor(() => expect(onOrderCommit).toHaveBeenCalledWith('teach-1', 3));
  });
});
