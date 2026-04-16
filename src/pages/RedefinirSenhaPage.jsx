import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, KeyRound, LockKeyhole, Mail } from 'lucide-react'
import backgroundLogin from '../assets/background-login.png'
import logoHorizontal from '../assets/logo-horizontal.png'
import { api } from '../services/api'

export function RedefinirSenhaPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState(location.state?.email || '')
  const [codigo, setCodigo] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setErro('')
      setSucesso('')
      setCarregando(true)

      await api.post('/usuarios/redefinir-senha', {
        email,
        codigo,
        novaSenha,
      })

      setSucesso('Senha redefinida com sucesso.')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error) {
      setErro(
        error?.response?.data?.message ||
          'Não foi possível redefinir a senha.',
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundLogin})` }}
      />
      <div className="absolute inset-0 bg-slate-950/55" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl rounded-3xl bg-white/90 p-8 shadow-2xl">
          <div className="mb-8 flex justify-center">
            <img
              src={logoHorizontal}
              alt="Secretaria Municipal de Educação de Bayeux - PB"
              className="h-auto w-[260px] max-w-full"
            />
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Redefinir senha
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Informe o código recebido e crie uma nova senha.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email institucional
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Código
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <KeyRound size={18} className="text-slate-400" />
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Digite o código recebido"
                  className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nova senha
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Digite a nova senha"
                  className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((prev) => !prev)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {erro && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {sucesso}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
            >
              {carregando ? 'Salvando...' : 'Redefinir senha'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Voltar para{' '}
            <Link
              to="/login"
              className="font-semibold text-slate-800 hover:text-slate-950"
            >
              login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}