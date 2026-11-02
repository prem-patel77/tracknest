import { Icon } from "./Icons";

// Friendly box shown when a list has nothing to show.
// - icon: name of an <Icon>; title/text: the message; children: optional button(s)
export default function EmptyState({ icon = "briefcase", title, text, children }) {
  return (
    <div className="empty-state card">
      <span className="empty-state-icon"><Icon name={icon} size={26} /></span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}
