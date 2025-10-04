import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState, type ReactElement, type ReactNode } from 'react';

import TeachList from './TeachList';
import type { TeachItem } from './types';

jest.mock('@mui/material/Tooltip', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }): ReactElement | null =>
    (children as ReactElement) ?? null
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
    const onEdit = jest.fn<(teach: TeachItem) => void>();
    const onDelete = jest.fn<(id: string) => void>();
    const onToggleVisibility = jest.fn<(id: string, visible: boolean) => void>();
    const onOrderChange = jest.fn<(id: string, order: number) => void>();
    const onOrderCommit = jest
      .fn<(id: string, order: number) => Promise<void>>()
      .mockResolvedValue(undefined);

    const Wrapper: React.FC = () => {
      const [teachings, setTeachings] = useState([baseTeach]);
      return (
        <TeachList
          teachings={teachings}
          language="en"
          isAuthenticated
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleVisibility={onToggleVisibility}
          onOrderChange={(id, order) => {
            onOrderChange(id, order);
            setTeachings((prev) =>
              prev.map((teach) => (teach.id === id ? { ...teach, order } : teach))
            );
          }}
          onOrderCommit={async (id, order) => {
            await onOrderCommit(id, order);
            setTeachings((prev) =>
              prev.map((teach) => (teach.id === id ? { ...teach, order } : teach))
            );
          }}
        />
      );
    };

    render(<Wrapper />);

    const card = screen.getByTestId('teach-card-teach-1');
    fireEvent.mouseEnter(card);

    const hideButton = await screen.findByRole('button', { name: /hide teaching item/i });
    await user.click(hideButton);
    expect(onToggleVisibility).toHaveBeenCalledWith('teach-1', false);

    fireEvent.mouseEnter(card);
    const editButton = await screen.findByRole('button', { name: /edit teaching item/i });
    fireEvent.click(editButton);
    expect(onEdit).toHaveBeenCalledWith(baseTeach);

    fireEvent.mouseEnter(card);
    const deleteButton = await screen.findByRole('button', { name: /delete teaching item/i });
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith('teach-1');

    const orderInput = await screen.findByLabelText(/order/i);
    fireEvent.change(orderInput, { target: { value: '3' } });
    await waitFor(() => expect(onOrderChange).toHaveBeenCalledWith('teach-1', 3));

    fireEvent.blur(orderInput);
    await waitFor(() => expect(onOrderCommit).toHaveBeenCalledWith('teach-1', 3));
  });
});
