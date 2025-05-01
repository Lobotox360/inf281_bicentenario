// /components/PercentageCircle.js

export default function PercentageCircle({ percentage }) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-2xl font-semibold">{percentage}%</p>
          </div>
          <svg className="w-full h-full transform rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-300"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              strokeDasharray="100, 100"
              d="M18 2 a16 16 0 1 1 0 32 a16 16 0 1 1 0 -32"
            />
            <path
              className="text-blue-500"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              strokeDasharray={`${percentage}, 100`}
              d="M18 2 a16 16 0 1 1 0 32 a16 16 0 1 1 0 -32"
            />
          </svg>
        </div>
      </div>
    );
  }
  