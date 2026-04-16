import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  MapPin,
  Tag,
  Clock3,
  User,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { api } from '../services/api'
import { podeAprovarEventos } from '../utils/permissions'

export function EventosPendentesPage() {
  const navigate = useNavigate()
  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [processandoId, setProcessandoId] = useState(null)

  useEffect(() => {
    if (!podeAprovarEventos()) {
      navigate('/painel')
      return
    }

    carregarPendentes()
  }, [navigate])

  async function carregarPendentes() {
    try {
      const response = await api.get('/eventos/admin/pendentes/lista')

      const ordenados = response.data.sort(
        (a, b) => new Date(b.dataInicio) - new Date(a.dataInicio),
      )

      setEventos(ordenados)
    } catch (error) {
      console.error('Erro ao carregar eventos pendentes:', error)
    } finally {
      setCarregando(false)
    }
  }

  async function aprovarEvento(id) {
    try {
      setProcessandoId(id)

      await api.patch(`/eventos/${id}/aprovar`, {
        observacoes: 'Evento aprovado pela gestão.',
      })

      await carregarPendentes()
    } catch (error) {
      console.error('Erro ao aprovar evento:', error)
      alert(
        error?.response?.data?.message || 'Não foi possível aprovar o evento.',
      )
    } finally {
      setProcessandoId(null)
    }
  }

  async function reprovarEvento(id) {
    const motivo = window.prompt('Informe o motivo da reprovação:')

    if (!motivo) return

    try {
      setProcessandoId(id)

      await api.patch(`/eventos/${id}/reprovar`, {
        motivo,
      })

      await carregarPendentes()
    } catch (error) {
      console.error('Erro ao reprovar evento:', error)
      alert(
        error?.response?.data?.message || 'Não foi possível reprovar o evento.',
      )
    } finally {
      setProcessandoId(null)
    }
  }

  return (
    <DashboardLayout titulo="Aprovação de Eventos">
      <div className="space-y-6">
        

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {carregando ? (
            <Estado texto="Carregando eventos pendentes..." />
          ) : eventos.length === 0 ? (
            <Estado texto="Nenhum evento pendente no momento." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {eventos.map((evento) => (
                <EventoPendenteCard
                  key={evento.id}
                  evento={evento}
                  processando={processandoId === evento.id}
                  onAprovar={() => aprovarEvento(evento.id)}
                  onReprovar={() => reprovarEvento(evento.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  )
}

function EventoPendenteCard({
  evento,
  processando,
  onAprovar,
  onReprovar,
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-[#fbfcfe] p-5 transition hover:shadow-sm">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
          PENDENTE
        </span>
      </div>

      <h3 className="mt-3 text-lg font-bold text-slate-900">
        {evento.titulo}
      </h3>

      <p className="mt-2 text-sm text-slate-600 line-clamp-3">
        {evento.descricao || 'Sem descrição informada.'}
      </p>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <Info
          icon={<MapPin size={14} />}
          text={evento.local || 'Local não informado'}
        />
        <Info
          icon={<Tag size={14} />}
          text={evento.categoria?.nome || 'Sem categoria'}
        />
        <Info
          icon={<Clock3 size={14} />}
          text={new Date(evento.dataInicio).toLocaleString('pt-BR')}
        />
        <Info
          icon={<User size={14} />}
          text={evento.criadoPor?.nome || 'Não informado'}
        />
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button
          onClick={onAprovar}
          disabled={processando}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-70"
        >
          <CheckCircle2 size={18} />
          {processando ? 'Processando...' : 'Aprovar'}
        </button>

        <button
          onClick={onReprovar}
          disabled={processando}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-70"
        >
          <XCircle size={18} />
          {processando ? 'Processando...' : 'Reprovar'}
        </button>
      </div>
    </div>
  )
}

function Info({ icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#35506b]">{icon}</span>
      <span>{text}</span>
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