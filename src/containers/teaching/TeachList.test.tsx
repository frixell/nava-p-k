import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

import TeachList from './TeachList';
import type { TeachItem } from './types';


jest.mock('@mui/material/Tooltip', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <>{children}</>
}));

const baseTeach: TeachItem = {
  id: 'teach-1',
  details: '<p>Detail</p>',
  description: '<p>Description</p>',
  order: 1,
  visible: true
};

describe('TeachList', () => {
  it('renders teaching items and triggers callbacks when authenticated', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn((_teach: TeachItem) => undefined);
    const onDelete = jest.fn((_id: string) => undefined);
    const onToggleVisibility = jest.fn((_id: string, _visible: boolean) => undefined);
    const onOrderChange = jest.fn((_id: string, _order: number) => undefined);
    const onOrderCommit = jest.fn(async (_id: string, _order: number) => undefined);

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
