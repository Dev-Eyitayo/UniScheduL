export default function InputField({ label, value, onChange, type = "text", placeholder = "" }) {
    return (
      <div className="flex flex-col w-full">
        <label className="text-sm font-semibold mb-1">{label}</label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border p-2 rounded-md outline-none focus:border-blue-500"
        />
      </div>
    );
  }
  