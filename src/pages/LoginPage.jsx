import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import backgroundLogin from '../assets/background-login.png'
import logoHorizontal from '../assets/logo-horizontal.png'
import { api } from '../services/api'
import { Link } from 'react-router-dom'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'O email é obrigatório.')
    .email('Informe um email válido.'),
  senha: z
    .string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres.'),
})

export function LoginPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erroLogin, setErroLogin] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data) {
    try {
      setCarregando(true)
      setErroLogin('')

      const response = await api.post('/auth/login', data)

      localStorage.removeItem('token')
      localStorage.removeItem('usuario')

      localStorage.setItem('token', response.data.accessToken)
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario))

      window.location.href = '/painel'
    } catch (error) {
      setErroLogin(
        error?.response?.data?.message || 'Não foi possível realizar o login.',
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundLogin})` }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-slate-950/55" />

      {/* CONTEÚDO */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl bg-white/10 shadow-2xl backdrop-blur-md lg:grid-cols-2">

          {/* LADO ESQUERDO (INSTITUCIONAL) */}
          <div className="hidden flex-col justify-between bg-slate-950/35 p-10 text-white lg:flex">
            <div>
              <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium">
                Agenda Educação 2026
              </span>

              <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight">
                Sistema de Agendamento da Secretaria Municipal de Educação de
                Bayeux - PB
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-200">
                Organize o calendário institucional, solicite eventos,
                acompanhe aprovações e gerencie solicitações de transporte em um
                ambiente moderno, seguro e profissional.
              </p>
            </div>

            <div className="mt-10 text-sm text-slate-300">
              Secretaria Municipal de Educação de Bayeux - PB
            </div>
          </div>

          {/* LADO DIREITO (LOGIN) */}
          <div className="flex items-center justify-center bg-white/90 px-6 py-10 sm:px-10 lg:px-14">
            <div className="w-full max-w-md">

              {/* LOGO COM FUNDO */}
              <div className="mb-8 flex justify-center">
                <img
                  src={logoHorizontal}
                  alt="Secretaria Municipal de Educação de Bayeux - PB"
                  className="h-auto w-[260px] max-w-full"
                />

              </div>

              {/* TÍTULO */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Entrar</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Acesse o sistema com seu email institucional.
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email institucional
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-slate-400">
                    <Mail size={18} className="text-slate-400" />
                    <input
                      type="email"
                      placeholder="seuemail@edu.bayeux.pb.gov.br"
                      className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      {...register('email')}
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* SENHA */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Senha
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-slate-400">
                    <LockKeyhole size={18} className="text-slate-400" />
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      placeholder="Informe sua senha"
                      className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      {...register('senha')}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha((valor) => !valor)}
                      className="text-slate-400 transition hover:text-slate-700"
                    >
                      {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {errors.senha && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.senha.message}
                    </p>
                  )}
                </div>

                {/* ERRO */}
                {erroLogin && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erroLogin}
                  </div>
                )}

                {/* BOTÃO */}
                <button
                  type="submit"
                  disabled={carregando}
                  className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {carregando ? 'Entrando...' : 'Acessar sistema'}
                </button>

                <p className="mt-4 text-center text-sm text-slate-500">
                  <Link
                    to="/esqueci-senha"
                    className="font-semibold text-slate-800 hover:text-slate-950"
                  >
                    Esqueci minha senha
                  </Link>
                </p>
              </form>

              {/* RODAPÉ */}
              <p className="mt-6 text-center text-sm text-slate-500">
                Não possui acesso?{' '}
                <Link
                  to="/cadastro"
                  className="font-semibold text-slate-800 hover:text-slate-950"
                >
                  Solicitar cadastro
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}