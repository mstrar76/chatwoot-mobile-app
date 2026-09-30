// Brand palettes layered over the Radix colors, picked by EXPO_PUBLIC_BRAND_PALETTE.
// `blue` is the app's primary scale (buttons, links, own message bubbles);
// `accent` fills the unread counter, with `accent-contrast` for its text.
const palettes: Record<string, Record<string, Record<string | number, string>>> = {
  default: {
    accent: { DEFAULT: 'hsl(206, 100%, 50.0%)', contrast: '#FFFFFF' },
  },
  // Tokens from branding/tendeo/tendeo-tokens.json (light mode).
  tendeo: {
    blue: {
      50: '#F5F4FD',
      100: '#ECEAFB',
      200: '#E2DFF9',
      300: '#D2CDF6',
      400: '#BDB6F1',
      500: '#A197EA',
      600: '#7F72DC',
      700: '#4A3AC7',
      800: '#4A3AC7',
      900: '#3629A0',
      950: '#241A73',
    },
    accent: { DEFAULT: '#F4B63F', contrast: '#1A1830' },
  },
};

function getBrandColors(name?: string) {
  return (name && palettes[name]) || palettes.default;
}

module.exports = { getBrandColors };
