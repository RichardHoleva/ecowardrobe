export default function Input({ label, type = 'text', placeholder, value, onChange, id }) {
  return (
    <div className="input-wrapper">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-field"
      />
    </div>
  );
}
