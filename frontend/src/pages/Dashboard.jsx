import Card from "../components/Card";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-center">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Total Courses" value="12" />
          <Card title="Total Students" value="400" />
          <Card title="Available Rooms" value="8" />
          <Card title="Upcoming Classes" value="5" />
        </div>
      </div>
    </div>
  );
}
