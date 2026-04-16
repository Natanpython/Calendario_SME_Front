import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { KeyRound, Mail } from 'lucide-react'
import backgroundLogin from '../assets/background-login.png'
import logoHorizontal from '../assets/logo-horizontal.png'
import { api } from '../services/api'

export function VerificarCodigoPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState(location.state?.email || '')
  const [codigo, setCodigo] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [reenviando, setReenviando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    if (!location.state?.email) {
      setSucesso('')
    }
  }, [location.state])

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setErro('')
      setSucesso('')
      setCarregando(true)

      await api.post('/usuarios/verificar-codigo', {
        email,
        codigo,
      })

      setSucesso('Código validado com sucesso. Agora você já pode entrar.')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error) {
      setErro(
        error?.response?.data?.message ||
          'Não foi possível validar o código.',
      )
    } finally {
      setCarregando(false)
    }
  }

  async function reenviarCodigo() {
    try {
      setErro('')
      setSucesso('')
      setReenviando(true)

      await api.post('/usuarios/reenviar-codigo', {
        email,
      })

      setSucesso('Um novo código foi enviado para seu email institucional.')
    } catch (error) {
      setErro(
        error?.response?.data?.message || 'Não foi possível reenviar o código.',
      )
    } finally {
      setReenviando(false)
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
        <div className="w-full max-w-xl rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-8 flex justify-center">
            <img
              src={logoHorizontal}
              alt="Secretaria Municipal de Educação de Bayeux - PB"
              className="h-auto w-[260px] max-w-full"
            />
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Validar cadastro
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Informe o código enviado ao seu email institucional.
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
                  placeholder="seuemail@edu.bayeux.pb.gov.br"
                  className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Código de verificação
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
              {carregando ? 'Validando...' : 'Validar código'}
            </button>

            <button
              type="button"
              onClick={reenviarCodigo}
              disabled={reenviando || !email}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-70"
            >
              {reenviando ? 'Reenviando...' : 'Reenviar código'}
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