import { useEffect, useMemo, useState } from 'react'
import {
  CalendarCheck2,
  FileText,
  MailCheck,
  Users,
  Clock3,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { api } from '../services/api'

export function DashboardPage() {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      const res = await api.get('/eventos')
      setEventos(res.data)
    } catch (error) {
      console.error('Erro ao buscar eventos', error)
    } finally {
      setLoading(false)
    }
  }

  const resumo = useMemo(() => {
    const totalEventos = eventos.length
    const aprovados = eventos.filter((evento) => evento.status === 'APROVADO').length
    const pendentes = eventos.filter((evento) => evento.status === 'PENDENTE').length
    const reprovados = eventos.filter((evento) => evento.status === 'REPROVADO').length

    return {
      totalEventos,
      aprovados,
      pendentes,
      reprovados,
    }
  }, [eventos])

  const ultimosEventos = useMemo(() => {
    return [...eventos]
      .sort(
        (a, b) =>
          new Date(b.criadoEm || b.dataInicio) - new Date(a.criadoEm || a.dataInicio),
      )
      .slice(0, 5)
  }, [eventos])

  return (
    <DashboardLayout titulo="Dashboard">
      <div className="space-y-6">
       

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <CardResumo
            titulo="Eventos cadastrados"
            valor={loading ? '--' : resumo.totalEventos}
            descricao="Total de registros no sistema"
            icone={<CalendarCheck2 size={20} />}
          />
          <CardResumo
            titulo="Eventos aprovados"
            valor={loading ? '--' : resumo.aprovados}
            descricao="Eventos liberados"
            icone={<CheckCircle2 size={20} />}
          />
          <CardResumo
            titulo="Eventos pendentes"
            valor={loading ? '--' : resumo.pendentes}
            descricao="Aguardando análise"
            icone={<AlertCircle size={20} />}
          />
          <CardResumo
            titulo="Eventos reprovados"
            valor={loading ? '--' : resumo.reprovados}
            descricao="Solicitações recusadas"
            icone={<FileText size={20} />}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xl font-bold text-slate-900">
                  Últimos eventos cadastrados
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  Visualização rápida dos registros mais recentes.
                </p>
              </div>

              <span className="hidden rounded-full bg-[#eef4fb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#35506b] sm:inline-flex">
                Atualizado
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {loading ? (
                <EstadoVazio texto="Carregando eventos..." />
              ) : ultimosEventos.length === 0 ? (
                <EstadoVazio texto="Nenhum evento cadastrado até o momento." />
              ) : (
                ultimosEventos.map((evento) => (
                  <EventoItem key={evento.id} evento={evento} />
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h4 className="text-xl font-bold text-slate-900">
                Resumo institucional
              </h4>

              <div className="mt-5 space-y-4">
                <ResumoLinha
                  titulo="Calendário institucional"
                  descricao="Consulta organizada dos eventos cadastrados e aprovados."
                />
                <ResumoLinha
                  titulo="Fluxo de aprovação"
                  descricao="Solicitações passam por análise administrativa."
                />
                <ResumoLinha
                  titulo="Solicitação de transporte"
                  descricao="Eventos aprovados podem gerar ofício e envio por email."
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h4 className="text-xl font-bold text-slate-900">
                Situação do sistema
              </h4>

              <div className="mt-5 grid gap-3">
                <StatusBox label="Autenticação" valor="Ativa" cor="verde" />
                <StatusBox label="Perfis de acesso" valor="Configurados" cor="azul" />
                <StatusBox label="Documentos PDF" valor="Operacional" cor="azul" />
                <StatusBox label="Emails" valor="Integrados" cor="verde" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

function CardResumo({ titulo, valor, descricao, icone }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{titulo}</p>
          <h3 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            {valor}
          </h3>
          <p className="mt-2 text-sm text-slate-600">{descricao}</p>
        </div>

        <div className="rounded-2xl bg-[#eef4fb] p-3 text-[#35506b]">
          {icone}
        </div>
      </div>
    </div>
  )
}

function PainelMiniInfo({ icone, titulo, valor }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white p-2 text-[#35506b] shadow-sm">
          {icone}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            {titulo}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{valor}</p>
        </div>
      </div>
    </div>
  )
}

function EventoItem({ evento }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-[#fbfcfe] p-5 transition hover:border-slate-300">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h5 className="text-lg font-bold text-slate-900">{evento.titulo}</h5>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                evento.status,
              )}`}
            >
              {evento.status}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {evento.descricao || 'Sem descrição informada.'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <p>
            <strong>Início:</strong>{' '}
            {new Date(evento.dataInicio).toLocaleDateString('pt-BR')}
          </p>
          <p className="mt-1">
            <strong>Fim:</strong>{' '}
            {new Date(evento.dataFim).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  )
}

function ResumoLinha({ titulo, descricao }) {
  return (
    <div className="rounded-3xl bg-[#f8fafc] p-4">
      <p className="text-sm font-semibold text-slate-900">{titulo}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{descricao}</p>
    </div>
  )
}

function StatusBox({ label, valor, cor = 'azul' }) {
  const classes =
    cor === 'verde'
      ? 'bg-green-50 text-green-700 border-green-100'
      : 'bg-[#eef4fb] text-[#35506b] border-[#dbe7f3]'

  return (
    <div className={`rounded-2xl border px-4 py-3 ${classes}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-80">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold">{valor}</p>
    </div>
  )
}

function EstadoVazio({ texto }) {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
      {texto}
    </div>
  )
}

function getStatusStyle(status) {
  switch (status) {
    case 'APROVADO':
      return 'bg-green-100 text-green-700'
    case 'PENDENTE':
      return 'bg-yellow-100 text-yellow-700'
    case 'REPROVADO':
      return 'bg-red-100 text-red-700'
    case 'FECHADO':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}