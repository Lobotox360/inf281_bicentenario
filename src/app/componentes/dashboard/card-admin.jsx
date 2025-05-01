// /components/Card.js

export default function Card({ title, value }) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between items-center">
        <h4 className="text-xl font-semibold text-gray-800 mb-2">{title}</h4>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    );
  }
  