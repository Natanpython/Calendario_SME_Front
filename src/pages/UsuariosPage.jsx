import { useEffect, useState } from 'react'
import { Search, UserCog } from 'lucide-react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { api } from '../services/api'

function getPerfilStyle(perfil) {
  switch (perfil) {
    case 'ADMIN':
      return 'bg-purple-100 text-purple-700 border-purple-200'
    case 'COORDENADOR':
      return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'GESTOR':
      return 'bg-slate-100 text-slate-700 border-slate-200'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}

export function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarUsuarios()
  }, [])

  async function carregarUsuarios() {
    try {
      const response = await api.get('/usuarios')
      setUsuarios(response.data)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setCarregando(false)
    }
  }

  async function alterarStatus(id, ativo) {
    try {
      await api.patch(`/usuarios/${id}/status`, { ativo })
      carregarUsuarios()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  async function alterarPerfil(id, perfil) {
    try {
      await api.patch(`/usuarios/${id}/perfil`, { perfil })
      carregarUsuarios()
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
    }
  }

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nome.toLowerCase().includes(busca.toLowerCase()),
  )

  return (
    <DashboardLayout titulo="Gestão de Usuários">
      <div className="space-y-6">
       

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Buscar usuário pelo nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="mt-6">
            {carregando ? (
              <Estado texto="Carregando usuários..." />
            ) : usuariosFiltrados.length === 0 ? (
              <Estado texto="Nenhum usuário encontrado." />
            ) : (
              <div className="grid gap-4">
                {usuariosFiltrados.map((usuario) => (
                  <UsuarioCard
                    key={usuario.id}
                    usuario={usuario}
                    onStatusChange={alterarStatus}
                    onPerfilChange={alterarPerfil}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

function UsuarioCard({ usuario, onStatusChange, onPerfilChange }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-[#fbfcfe] p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h4 className="font-bold text-slate-900">{usuario.nome}</h4>
          <p className="text-sm text-slate-500">{usuario.email}</p>

          <div className="mt-2 flex items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPerfilStyle(
                usuario.perfil,
              )}`}
            >
              {usuario.perfil}
            </span>

            <span
              className={`text-xs font-semibold ${
                usuario.ativo ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {usuario.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={usuario.perfil}
            onChange={(e) => onPerfilChange(usuario.id, e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="ADMIN">Admin</option>
            <option value="COORDENADOR">Coordenador</option>
            <option value="GESTOR">Gestor</option>
          </select>

          <button
            onClick={() => onStatusChange(usuario.id, !usuario.ativo)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              usuario.ativo
                ? 'bg-red-100 text-red-600'
                : 'bg-green-100 text-green-600'
            }`}
          >
            {usuario.ativo ? 'Desativar' : 'Ativar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Estado({ texto }) {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
      {texto}
    </div>
  )
}