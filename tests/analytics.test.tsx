// Checks the address that analytics receives: campaign parameters only, no fragment.
import { describe, expect, it } from 'vitest';
import { sendableUrl } from '../site/src/lib/analytics';

describe('sendableUrl', () => {
  it('keeps utm_* parameters and drops the rest of the query', () => {
    expect(sendableUrl('https://icons.kubai.design/?q=arrow&utm_source=x&cat=media&utm_campaign=launch'))
      .toBe('https://icons.kubai.design/?utm_source=x&utm_campaign=launch');
  });

  it('drops the query and fragment when there is no campaign', () => {
    expect(sendableUrl('https://icons.kubai.design/zh/?q=%E7%AE%AD%E5%A4%B4&icon=bell#c=bell,mail'))
      .toBe('https://icons.kubai.design/zh/');
  });

  it('leaves a value that is not a full address unchanged', () => {
    expect(sendableUrl('')).toBe('');
    expect(sendableUrl('not a url')).toBe('not a url');
  });
});
