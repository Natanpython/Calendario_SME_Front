import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import backgroundLogin from '../assets/background-login.png'
import logoHorizontal from '../assets/logo-horizontal.png'
import { api } from '../services/api'

export function EsqueciSenhaPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setErro('')
      setCarregando(true)

      await api.post('/usuarios/solicitar-recuperacao-senha', {
        email,
      })

      navigate('/redefinir-senha', {
        state: { email },
      })
    } catch (error) {
      setErro(
        error?.response?.data?.message ||
          'Não foi possível solicitar a recuperação de senha.',
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
              Recuperar acesso
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Informe seu email institucional para receber o código.
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

            {erro && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
            >
              {carregando ? 'Enviando...' : 'Enviar código'}
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