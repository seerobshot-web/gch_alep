import { describe, it, expect } from 'vitest';
import { LoginInput, InlineRegisterInput } from '../src/schemas';

describe('LoginInput (bug #5)', () => {
  it('accepts email + password only', () => {
    const parsed = LoginInput.safeParse({ email: 'a@b.com', password: 'anything' });
    expect(parsed.success).toBe(true);
  });

  it('does not require first_name/last_name, unlike InlineRegisterInput', () => {
    const body = { email: 'a@b.com', password: 'anything' };
    expect(LoginInput.safeParse(body).success).toBe(true);
    // regression guard: this is the exact shape that used to 400 every
    // login attempt when the route validated against InlineRegisterInput
    expect(InlineRegisterInput.safeParse(body).success).toBe(false);
  });

  it('rejects a missing password', () => {
    expect(LoginInput.safeParse({ email: 'a@b.com', password: '' }).success).toBe(false);
  });

  it('rejects an invalid email', () => {
    expect(LoginInput.safeParse({ email: 'not-an-email', password: 'x' }).success).toBe(false);
  });
});
