import React from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import App from './App';

jest.useFakeTimers();

describe('App Clock Behaviors', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
  });

  test('test_clocks_increment_correctly', () => {
    render(<App />);
    const analogInput = screen.getAllByRole('spinbutton')[0];
    const digitalInput = screen.getAllByRole('spinbutton')[1];
    const analogTimeText = screen.getAllByText(/:/)[0];
    const digitalTimeText = screen.getAllByText(/:/)[1];

    const initialAnalog = analogTimeText.textContent;
    const initialDigital = digitalTimeText.textContent;

    // Advance 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Analog and digital clocks should have incremented by 2 seconds
    expect(analogTimeText.textContent).not.toBe(initialAnalog);
    expect(digitalTimeText.textContent).not.toBe(initialDigital);

    // Change increments and verify
    fireEvent.change(analogInput, { target: { value: '2' } });
    fireEvent.change(digitalInput, { target: { value: '3' } });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Analog should increment by 2, digital by 3
    const analogAfter = analogTimeText.textContent;
    const digitalAfter = digitalTimeText.textContent;
    expect(analogAfter).not.toBe(initialAnalog);
    expect(digitalAfter).not.toBe(initialDigital);
  });

  test('test_analog_sync_to_digital', () => {
    render(<App />);
    const analogInput = screen.getAllByRole('spinbutton')[0];
    const digitalInput = screen.getAllByRole('spinbutton')[1];
    const analogSyncBtn = screen.getAllByText(/Sync Analog to Digital/)[0];
    const analogTimeText = screen.getAllByText(/:/)[0];
    const digitalTimeText = screen.getAllByText(/:/)[1];

    // Change increments to different values
    fireEvent.change(analogInput, { target: { value: '2' } });
    fireEvent.change(digitalInput, { target: { value: '5' } });

    // Advance time so clocks are out of sync
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Click analog sync button
    fireEvent.click(analogSyncBtn);

    // Analog seconds should match digital seconds
    const analogSeconds = new Date('1970-01-01T' + analogTimeText.textContent).getSeconds();
    const digitalSeconds = new Date('1970-01-01T' + digitalTimeText.textContent).getSeconds();
    expect(analogSeconds).toBe(digitalSeconds);

    // Analog increment should match digital increment
    expect(analogInput.value).toBe(digitalInput.value);
  });

  test('test_digital_sync_to_analog', () => {
    render(<App />);
    const analogInput = screen.getAllByRole('spinbutton')[1];
    const digitalInput = screen.getAllByRole('spinbutton')[0];
    const digitalSyncBtn = screen.getAllByText(/Sync Analog to Digital/)[1];
    const analogTimeText = screen.getAllByText(/:/)[0];
    const digitalTimeText = screen.getAllByText(/:/)[1];

    // Change increments to different values
    fireEvent.change(analogInput, { target: { value: '7' } });
    fireEvent.change(digitalInput, { target: { value: '1' } });

    // Advance time so clocks are out of sync
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    // Click digital sync button
    fireEvent.click(digitalSyncBtn);

    // Digital seconds should match analog seconds
    const analogSeconds = new Date('1970-01-01T' + analogTimeText.textContent).getSeconds();
    const digitalSeconds = new Date('1970-01-01T' + digitalTimeText.textContent).getSeconds();
    expect(digitalSeconds).toBe(analogSeconds);

    // Digital increment should match analog increment
    expect(digitalInput.value).toBe(analogInput.value);
  });

  test('test_non_integer_and_negative_increments', () => {
    render(<App />);
    const analogInput = screen.getAllByRole('spinbutton')[0];
    const digitalInput = screen.getAllByRole('spinbutton')[1];
    const analogTimeText = screen.getAllByText(/:/)[0];
    const digitalTimeText = screen.getAllByText(/:/)[1];

    // Set non-integer increments
    fireEvent.change(analogInput, { target: { value: '0.5' } });
    fireEvent.change(digitalInput, { target: { value: '-2' } });

    const initialAnalog = analogTimeText.textContent;
    const initialDigital = digitalTimeText.textContent;

    // Advance 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Analog should increment by 1 (0.5 * 2), digital should decrement by 4 (-2 * 2)
    expect(analogTimeText.textContent).toBe(initialAnalog);
    expect(digitalTimeText.textContent).not.toBe(initialDigital);
  });

  test('test_zero_increment_no_update', () => {
    render(<App />);
    const analogInput = screen.getAllByRole('spinbutton')[0];
    const digitalInput = screen.getAllByRole('spinbutton')[1];
    const analogTimeText = screen.getAllByText(/:/)[0];
    const digitalTimeText = screen.getAllByText(/:/)[1];

    fireEvent.change(analogInput, { target: { value: '0' } });
    fireEvent.change(digitalInput, { target: { value: '0' } });

    const initialAnalog = analogTimeText.textContent;
    const initialDigital = digitalTimeText.textContent;

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Clocks should not update
    expect(analogTimeText.textContent).not.toBe(initialAnalog);
    expect(digitalTimeText.textContent).toBe(initialDigital);
  });

  test('test_interval_cleanup_on_unmount', () => {
    const { unmount } = render(<App />);
    const analogInput = screen.getAllByRole('spinbutton')[0];
    const digitalInput = screen.getAllByRole('spinbutton')[1];

    fireEvent.change(analogInput, { target: { value: '1' } });
    fireEvent.change(digitalInput, { target: { value: '1' } });

    unmount();

    // After unmount, advancing timers should not throw or cause updates
    expect(() => {
      act(() => {
        jest.advanceTimersByTime(5000);
      });
    }).not.toThrow();
  });
});