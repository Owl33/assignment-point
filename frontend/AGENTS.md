# Repository Guidelines
가장먼저 모든 생각과 대답은 한글로 작성하여 사용자가 참고할 수 있도록 한다.

## Project Structure & Module Organization
The Expo Router tree lives in `app/`; route groups such as `app/(tabs)` keep tab navigation isolated, with nested stacks like `app/(tabs)/history` for feature-specific screens. Shared presentation logic is centralized in `components/ui` (design system wrappers) and `components/wrapper` (stateful helpers such as BottomSheet). Static assets (fonts, illustrations, icons) belong in `assets/`, while native overrides or Gradle tweaks stay under `android/`. Global styling is coordinated through `global.css`, `tailwind.config.js`, and the typed helpers in `nativewind-env.d.ts`.

## Build, Test, and Development Commands
- `npm install` – install Expo + NativeWind dependencies defined in `package.json`.
- `npm run start` – launch Metro via `expo start` for local development, web preview available with `w`.
- `npm run android` / `npm run ios` – create a development build on the respective platform simulators.
- `npm run web` – serve the app in a browser when debugging layout-only changes.

## Coding Style & Naming Conventions
Use TypeScript, functional components, and React hooks. Prefer 2-space indentation (Expo + Prettier default) and PascalCase for component files (`BottomSheet.tsx`), kebab-case for directories only when Expo route conventions require it (e.g., `(tabs)`). Co-locate styles using NativeWind utility classes; when advanced styling is required, add tokens to `tailwind.config.js` rather than inline hex values. Keep imports path-based via `babel-plugin-module-resolver` aliases instead of long relative chains.

## Testing Guidelines
The project ships with `react-test-renderer`; place component tests next to the UI they cover (`components/ui/Button.test.tsx`). Snapshot key visual states, and add interaction tests for hooks that manage gestures (bottom sheets, navigation). Before opening a PR, run `npm run test` (add the script if missing) and ensure coverage includes every new screen or reusable component.

## Commit & Pull Request Guidelines
Recent history (`git log`) shows short, imperative summaries, occasionally localized (e.g., “Home View”, “bottom sheet 동작 확인”). Keep commits scoped to one concern and explain user-facing behavior rather than refactor mechanics. PRs must describe the change, list testing evidence (device + platform), and attach screenshots for UI updates. Link any related issue IDs and call out follow-up work so reviewers can triage scope creep early.
