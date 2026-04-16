import { useEffect, useState } from 'react'
import {
  CalendarPlus,
  MapPin,
  Clock3,
  Tag,
  User,
} from 'lucide-react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { api } from '../services/api'
import { CreateEventoModal } from '../components/CreateEventoModal'
import { podeCriarEvento } from '../utils/permissions'

function getStatusStyle(status) {
  switch (status) {
    case 'APROVADO':
      return 'bg-green-100 text-green-700'
    case 'PENDENTE':
      return 'bg-yellow-100 text-yellow-700'
    case 'REPROVADO':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export function EventosPage() {
  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)

  useEffect(() => {
    carregarEventos()
  }, [])

  async function carregarEventos() {
    try {
      const response = await api.get('/eventos')

      // 🔥 ordena do mais novo pro mais antigo
      const ordenados = response.data.sort(
        (a, b) => new Date(b.dataInicio) - new Date(a.dataInicio),
      )

      setEventos(ordenados)
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <DashboardLayout titulo="Eventos">
      <div className="space-y-6">
        {/* HEADER */}
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#35506b]">Eventos</p>
              <h2 className="text-2xl font-bold text-slate-900">
                Gestão de eventos
              </h2>
            </div>

            {podeCriarEvento() && (
              <button
                onClick={() => setModalAberto(true)}
                className="flex items-center gap-2 rounded-2xl bg-[#23415e] px-5 py-3 text-white hover:bg-[#1c344c]"
              >
                <CalendarPlus size={18} />
                Novo evento
              </button>
            )}
          </div>
        </section>

        {/* LISTA */}
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {carregando ? (
            <Estado texto="Carregando eventos..." />
          ) : eventos.length === 0 ? (
            <Estado texto="Nenhum evento encontrado." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {eventos.map((evento) => (
                <EventoCard key={evento.id} evento={evento} />
              ))}
            </div>
          )}
        </section>
      </div>

      <CreateEventoModal
        aberto={modalAberto}
        onClose={() => setModalAberto(false)}
        onSuccess={carregarEventos}
      />
    </DashboardLayout>
  )
}

function EventoCard({ evento }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-[#fbfcfe] p-5 transition hover:shadow-sm">
      {/* STATUS */}
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
            evento.status,
          )}`}
        >
          {evento.status}
        </span>
      </div>

      {/* TITULO */}
      <h3 className="mt-3 text-lg font-bold text-slate-900">
        {evento.titulo}
      </h3>

      {/* DESCRIÇÃO */}
      <p className="mt-2 text-sm text-slate-600 line-clamp-3">
        {evento.descricao || 'Sem descrição'}
      </p>

      {/* INFO */}
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <Info icon={<MapPin size={14} />} text={evento.local || 'Não informado'} />
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