// /components/Card.js

export default function Card({ titulo, valor }) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between items-center">
        <h4 className="text-xl font-semibold text-gray-800 mb-2">{titulo}</h4>
        <p className="text-3xl font-bold text-gray-800">{valor}</p>
      </div>
    );
  }
  