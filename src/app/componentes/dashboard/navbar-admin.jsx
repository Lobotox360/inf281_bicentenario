// /components/Navbar.js

export default function Navbar() {
    return (
      <div className="flex justify-between items-center bg-yellow-600 p-4 text-white rounded-lg mb-6">
        <div className="flex items-center space-x-4">
          <img src="/assets/simon.jpg" alt="User Avatar" className="mx-5 w-12 h-12 rounded-full" />
          <div>
            <h3 className="text-lg font-semibold">Bievenido Fabian Lobo</h3>
            <p className="text-sm">Administrador de general del sistema</p>
          </div>
        </div>
      </div>
    );
  }
  