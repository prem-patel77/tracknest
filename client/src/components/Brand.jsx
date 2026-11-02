import { Icon } from "./Icons";

// The TrackNest logo: a teal square with an icon, followed by the app name
export default function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark"><Icon name="briefcase" size={18} /></span>
      <span className="brand-name">TrackNest</span>
    </div>
  );
}
