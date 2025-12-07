

export default function RegisterInput({ label, type, id, placeholder, value, onChange, error }) {
  return (
    <div className="input-wrapper">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type={type}
        id={id}
        className="input-field"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

