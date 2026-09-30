# Tendeo brand

Source: Claude Design project "Tendeo" (`252e05e8-ee47-44bf-a85a-9f959f23af8c`), final package
delivered 2026-09-29. Specs, contrast checks and decisions: `PACOTE-APP.md`; tokens:
`tendeo-tokens.json`. PNGs regenerate with `python3 gerar_pacote_app.py` (writes next to itself),
signatures with `python3 gerar_assinatura.py` (needs fonttools and the Manrope font, kept outside the repo).

- Display name: Tendeo — "Atenda os clientes de todas as suas empresas em um só app."
- Primary #4A3AC7, accent #F4B63F (always with #1A1830 text), font Manrope.

## Where each file goes in the app

| Package file | App path | Config |
|---|---|---|
| `ios-icon-1024.png` | `assets/icon.png` | `icon`, `ios.icon.light` |
| `ios-icon-dark-1024.png` | `assets/icon-dark.png` | `ios.icon.dark` |
| `ios-icon-tinted-1024.png` | `assets/icon-tinted.png` | `ios.icon.tinted` |
| `android-adaptive-foreground-1024.png` | `assets/adaptive-icon.png` | `android.adaptiveIcon.foregroundImage` |
| `android-adaptive-monochrome-1024.png` | `assets/adaptive-icon-monochrome.png` | `android.adaptiveIcon.monochromeImage` |
| `splash-1284x2778.png` | `assets/splash.png` | `expo-splash-screen` |
| `login-logo-{144,288,432}.png` | `src/assets/images/logo{,@2x,@3x}.png` | login screen |
| `android-notification-96.png` | — | pending (Android push) |

Favicons, `apple-touch-icon-180.png` and the SVG signatures are for the Chatwoot panel (Super Admin).

Build env: `EXPO_PUBLIC_APP_NAME=Tendeo`, `EXPO_PUBLIC_BRAND_COLOR=#4A3AC7` (splash and adaptive
icon background), `EXPO_PUBLIC_BRAND_PALETTE=tendeo` (UI colors). After swapping icons or splash run
`npx expo prebuild --clean`.
