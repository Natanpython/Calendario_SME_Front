import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  CalendarPlus,
  ClipboardCheck,
  BusFront,
  FileText,
  Menu,
  X,
  Users,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import logoPrincipal from '../assets/logo-principal.png'
import {
  isAdmin,
  isCoordenador,
  podeSolicitarTransporte,
} from '../utils/permissions'

export function DashboardLayout({ children, titulo = 'Painel' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAberto, setMenuAberto] = useState(false)

  const usuario = useMemo(() => {
    const usuarioSalvo = localStorage.getItem('usuario')
    return usuarioSalvo ? JSON.parse(usuarioSalvo) : null
  }, [])

  function sair() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  function fecharMenuMobile() {
    setMenuAberto(false)
  }

  function getNavClass(isActive) {
    return isActive
      ? 'flex w-full items-center gap-3 rounded-2xl bg-[#eaf2fb] px-4 py-3 text-sm font-semibold text-[#23415e] border border-[#d6e5f4]'
      : 'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100'
  }

  const SidebarNav = () => (
    <nav className="space-y-2">
      <NavLink
        to="/painel"
        className={({ isActive }) => getNavClass(isActive)}
        onClick={fecharMenuMobile}
      >
        <LayoutDashboard size={18} />
        Dashboard
      </NavLink>

      <NavLink
        to="/calendario"
        className={({ isActive }) => getNavClass(isActive)}
        onClick={fecharMenuMobile}
      >
        <CalendarDays size={18} />
        Calendário
      </NavLink>

      {(isAdmin() || isCoordenador()) && (
        <NavLink
          to="/eventos"
          className={({ isActive }) => getNavClass(isActive)}
          onClick={fecharMenuMobile}
        >
          <CalendarPlus size={18} />
          Eventos
        </NavLink>
      )}

      {podeSolicitarTransporte() && (
        <NavLink
          to="/transporte"
          className={({ isActive }) => getNavClass(isActive)}
          onClick={fecharMenuMobile}
        >
          <BusFront size={18} />
          Transporte
        </NavLink>
      )}

      {(isAdmin() || isCoordenador()) && (
        <NavLink
          to="/oficios"
          className={({ isActive }) => getNavClass(isActive)}
          onClick={fecharMenuMobile}
        >
          <FileText size={18} />
          Ofícios
        </NavLink>
      )}

      {isAdmin() && (
        <NavLink
          to="/eventos/pendentes"
          className={({ isActive }) => getNavClass(isActive)}
          onClick={fecharMenuMobile}
        >
          <ClipboardCheck size={18} />
          Aprovação de eventos
        </NavLink>
      )}

      {isAdmin() && (
        <NavLink
          to="/usuarios"
          className={({ isActive }) => getNavClass(isActive)}
          onClick={fecharMenuMobile}
        >
          <Users size={18} />
          Usuários
        </NavLink>
      )}
    </nav>
  )

  const SidebarContent = () => (
    <div className="flex h-full flex-col rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="rounded-[26px] bg-[#f8fafc] p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] bg-white shadow-sm ring-1 ring-slate-200">
            <img
              src={logoPrincipal}
              alt="Logo da Secretaria Municipal de Educação"
              className="h-100 w-100 object-contain"
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-base font-bold leading-5 text-slate-900">
              Secretaria Municipal de Educação
            </h1>
            <p className="mt-1 text-sm text-slate-500">Bayeux - PB</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex-1 overflow-y-auto">
        <div className="rounded-[26px] bg-white">
          <p className="px-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Navegação
          </p>

          <div className="mt-3">
            <SidebarNav />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[26px] bg-[#f8fafc] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          Sessão
        </p>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Usuário logado
          </p>
          <p className="mt-2 text-sm font-bold text-slate-900">
            {usuario?.nome || 'Usuário'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {usuario?.perfil || 'Perfil'}
          </p>
        </div>

        <button
          onClick={sair}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#23415e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1c344c]"
        >
          <LogOut size={18} />
          Sair do sistema
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[320px] shrink-0 p-4 xl:block">
          <div className="sticky top-4 h-[calc(100vh-2rem)]">
            <SidebarContent />
          </div>
        </aside>

        {menuAberto && (
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMenuAberto(false)}
            className="fixed inset-0 z-40 bg-slate-900/30 xl:hidden"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[320px] p-4 transition-transform duration-300 xl:hidden ${
            menuAberto ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="relative h-full">
            <button
              onClick={() => setMenuAberto(false)}
              className="absolute right-5 top-5 z-10 rounded-2xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm"
            >
              <X size={20} />
            </button>

            <SidebarContent />
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col p-3 sm:p-4">
          <header className="sticky top-0 z-30 rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-sm sm:px-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => setMenuAberto(true)}
                  className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-2 text-[#35506b] xl:hidden"
                >
                  <Menu size={20} />
                </button>

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Secretaria Municipal de Educação de Bayeux - PB
                  </p>
                  <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    {titulo}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {location.pathname === '/painel'
                      ? 'Visão geral do sistema'
                      : 'Ambiente institucional de gestão e acompanhamento'}
                  </p>
                </div>
              </div>

              <div className="hidden rounded-[24px] bg-[#eef4fb] px-5 py-4 lg:block">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5a738d]">
                  Usuário logado
                </p>
                <p className="mt-2 text-base font-bold text-slate-900">
                  {usuario?.nome || 'Usuário'}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {usuario?.perfil || 'Perfil'}
                </p>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 py-4">{children}</main>
        </div>
      </div>
    </div>
  )
}