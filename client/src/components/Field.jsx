import { Icon } from "./Icons";

// One form field: a label, the input, an optional hint and an optional error message.
// Used by the login, register and job forms (and the profile form next),
// so they all look and behave the same.
// - id: also used as the input's name (the id matches the key in the form's errors object)
// - as: "input" (default), "select" or "textarea". <select> options go in as children.
// - error: text shown under the field (the field also gets a red border)
// - hint: muted help text under the field
// - every other prop (type, value, onChange, maxLength...) goes straight to the input
export default function Field({ id, label, error, hint, required, as: Control = "input", children, ...inputProps }) {
  // The error replaces the hint (both usually say the same thing).
  // Screen readers read whichever one shows together with the field.
  const showHint = hint && !error;
  const describedBy = showHint ? `${id}-hint` : error ? `${id}-error` : undefined;

  return (
    <div className={error ? "field field-invalid" : "field"}>
      <label htmlFor={id}>
        {label}
        {required && <span className="field-required" aria-hidden="true"> *</span>}
      </label>
      <Control
        id={id}
        name={id}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
        {...inputProps}
      >
        {children}
      </Control>
      {showHint && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          <Icon name="alert" size={16} />
          {error}
        </p>
      )}
    </div>
  );
}
