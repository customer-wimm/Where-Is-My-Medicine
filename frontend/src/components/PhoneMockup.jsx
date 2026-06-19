import { SCREENS } from "./PhoneScreens.jsx";

// A phone frame. `screen` selects which app screen renders inside it.
export function PhoneMockup({ screen = "home", className = "" }) {
  const Screen = SCREENS[screen] ?? SCREENS.home;
  return (
    <div className={`phone ${className}`}>
      <div className="phone__notch" />
      <div className="phone__glass">
        <Screen />
      </div>
    </div>
  );
}
