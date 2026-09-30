import { create } from 'twrnc';

import { twConfig } from '../tailwind.config';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getBrandColors } = require('../colors/brand');

describe('brand palette', () => {
  it('keeps the upstream colors when no palette is set', () => {
    expect(getBrandColors(undefined)).toEqual(getBrandColors('unknown'));
    expect(getBrandColors(undefined).blue).toBeUndefined();
  });

  it('maps the Tendeo tokens onto the primary scale and accent', () => {
    const colors = { ...twConfig.theme.extend.colors, ...getBrandColors('tendeo') };
    const tw = create({ ...twConfig, theme: { ...twConfig.theme, extend: { colors } } });
    expect(tw.color('bg-blue-800')).toBe('#4A3AC7');
    expect(tw.color('bg-accent')).toBe('#F4B63F');
    expect(tw.color('text-accent-contrast')).toBe('#1A1830');
  });

  it('resolves the accent classes in the default build', () => {
    const tw = create(twConfig);
    expect(tw.color('bg-accent')).toBe(tw.color('bg-blue-700'));
    expect(tw.color('text-accent-contrast')).toBe('#FFFFFF');
  });
});
