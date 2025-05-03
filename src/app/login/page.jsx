'use client';

import { useState } from 'react';
import Login from '../componentes/login/login'
import Modal from '../componentes/login/modal';

export default function LoginPagina() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      {/* Página de login */}
      <Login openModal={() => setModalOpen(true)} />

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
