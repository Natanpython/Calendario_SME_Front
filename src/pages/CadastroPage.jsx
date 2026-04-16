import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LockKeyhole, Mail, User } from 'lucide-react'
import backgroundLogin from '../assets/background-login.png'
import logoHorizontal from '../assets/logo-horizontal.png'
import { api } from '../services/api'

export function CadastroPage() {
  const navigate = useNavigate()

  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  })

  function handleChange(e) {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setErro('')

      if (!form.email.endsWith('@edu.bayeux.pb.gov.br')) {
        setErro('Use um email institucional @edu.bayeux.pb.gov.br.')
        return
      }

      if (form.senha.length < 6) {
        setErro('A senha deve ter no mínimo 6 caracteres.')
        return
      }

      if (form.senha !== form.confirmarSenha) {
        setErro('A confirmação de senha não confere.')
        return
      }

      setCarregando(true)

      await api.post('/usuarios/cadastro', {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
      })

      navigate('/verificar-codigo', {
        state: {
          email: form.email,
        },
      })
    } catch (error) {
      setErro(
        error?.response?.data?.message || 'Não foi possível realizar o cadastro.',
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
        <div className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl bg-white/10 shadow-2xl backdrop-blur-md lg:grid-cols-2">
          <div className="hidden flex-col justify-between bg-slate-950/35 p-10 text-white lg:flex">
            <div>
              <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium">
                Agenda Educação 2026
              </span>

              <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight">
                Cadastro de acesso ao sistema da Secretaria Municipal de
                Educação de Bayeux - PB
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-200">
                Solicite seu acesso com email institucional para acompanhar o
                calendário, criar eventos e utilizar os recursos do sistema de
                forma segura e organizada.
              </p>
            </div>

            <div className="mt-10 text-sm text-slate-300">
              Secretaria Municipal de Educação de Bayeux - PB
            </div>
          </div>

          <div className="flex items-center justify-center bg-white/90 px-6 py-10 sm:px-10 lg:px-14">
            <div className="w-full max-w-md">
              <div className="mb-8 flex justify-center">
                <img
                  src={logoHorizontal}
                  alt="Secretaria Municipal de Educação de Bayeux - PB"
                  className="h-auto w-[260px] max-w-full"
                />
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Criar acesso</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Preencha os dados para solicitar seu cadastro.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Nome completo
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <User size={18} className="text-slate-400" />
                    <input
                      type="text"
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                      className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email institucional
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <Mail size={18} className="text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="seuemail@edu.bayeux.pb.gov.br"
                      className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Senha
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <LockKeyhole size={18} className="text-slate-400" />
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      name="senha"
                      value={form.senha}
                      onChange={handleChange}
                      placeholder="Crie uma senha"
                      className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
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

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Confirmar senha
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <LockKeyhole size={18} className="text-slate-400" />
                    <input
                      type={mostrarConfirmacao ? 'text' : 'password'}
                      name="confirmarSenha"
                      value={form.confirmarSenha}
                      onChange={handleChange}
                      placeholder="Repita a senha"
                      className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarConfirmacao((prev) => !prev)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      {mostrarConfirmacao ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
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
                  className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 disabled:opacity-70"
                >
                  {carregando ? 'Enviando...' : 'Solicitar cadastro'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Já possui acesso?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-slate-800 hover:text-slate-950"
                >
                  Entrar no sistema
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}