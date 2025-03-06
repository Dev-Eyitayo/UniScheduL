export default function Card({ title, value }) {
    return (
      <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-gray-600">{value}</p>
      </div>
    );
  }
  