// app/mi-calendario/page.jsx
'use client'

import Sidebar from "../componentes/dashboard/sidebar-admin"
import AdministracionRoles from "../componentes/roles/roles"

export default function RolesPagina() {
  return (
    <div className="flex">
      <Sidebar/>
      <AdministracionRoles/>
    </div>
  )
} 
