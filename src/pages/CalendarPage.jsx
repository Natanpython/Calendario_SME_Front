import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import { Edit, MapPin, User, X } from 'lucide-react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { api } from '../services/api'
import { CreateEventoModal } from '../components/CreateEventoModal'

function getCorPorStatus(status) {
  switch (status) {
    case 'APROVADO':
      return '#16a34a'
    case 'PENDENTE':
      return '#ca8a04'
    case 'REPROVADO':
      return '#dc2626'
    case 'FECHADO':
      return '#2563eb'
    default:
      return '#64748b'
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'APROVADO':
      return 'Aprovado'
    case 'PENDENTE':
      return 'Pendente'
    case 'REPROVADO':
      return 'Reprovado'
    case 'FECHADO':
      return 'Fechado'
    default:
      return status
  }
}

export function CalendarPage() {
  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [eventoSelecionado, setEventoSelecionado] = useState(null)
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false)
  const [eventoEmEdicao, setEventoEmEdicao] = useState(null)

  useEffect(() => {
    carregarEventos()
  }, [])

  async function carregarEventos() {
    try {
      const response = await api.get('/eventos')

      const eventosFormatados = response.data.map((evento) => ({
        id: evento.id,
        title: evento.titulo,
        start: evento.dataInicio,
        end: evento.dataFim,
        allDay: false,
        backgroundColor: getCorPorStatus(evento.status),
        borderColor: getCorPorStatus(evento.status),
        textColor: '#ffffff',
        extendedProps: {
          eventoOriginal: evento,
          status: evento.status,
          descricao: evento.descricao,
          local: evento.local,
          criadoPor: evento.criadoPor?.nome,
        },
      }))

      setEventos(eventosFormatados)
    } catch (error) {
      console.error('Erro ao carregar eventos do calendário:', error)
    } finally {
      setCarregando(false)
    }
  }

  function aoClicarEvento(info) {
    setEventoSelecionado({
      eventoOriginal: info.event.extendedProps.eventoOriginal,
      titulo: info.event.title,
      status: info.event.extendedProps.status,
      descricao: info.event.extendedProps.descricao,
      local: info.event.extendedProps.local,
      criadoPor: info.event.extendedProps.criadoPor,
      inicio: info.event.start,
      fim: info.event.end,
      cor: info.event.backgroundColor,
    })
  }

  function fecharModal() {
    setEventoSelecionado(null)
  }

  function abrirEdicao() {
    setEventoEmEdicao(eventoSelecionado.eventoOriginal)
    setModalEdicaoAberto(true)
    setEventoSelecionado(null)
  }

  function fecharEdicao() {
    setModalEdicaoAberto(false)
    setEventoEmEdicao(null)
  }

  return (
    <DashboardLayout titulo="Calendário Institucional">
      <div className="space-y-6">


        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h4 className="text-xl font-bold text-slate-900">
                Agenda de eventos
              </h4>
              <p className="mt-1 text-sm text-slate-500">
                Clique em um evento para visualizar as informações detalhadas.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Legenda nome="Aprovado" cor="#16a34a" />
              <Legenda nome="Pendente" cor="#ca8a04" />
              <Legenda nome="Reprovado" cor="#dc2626" />
              <Legenda nome="Fechado" cor="#2563eb" />
            </div>
          </div>

          <div className="mt-6">
            {carregando ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                Carregando calendário...
              </div>
            ) : (
              <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-3 sm:p-4">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  locale={ptBrLocale}
                  height="auto"
                  events={eventos}
                  eventClick={aoClicarEvento}
                  displayEventTime={false}
                  dayMaxEvents={true}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth',
                  }}
                  buttonText={{
                    today: 'Hoje',
                    month: 'Mês',
                  }}
                />
              </div>
            )}
          </div>
        </section>
      </div>

      {eventoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: eventoSelecionado.cor }}
                  />
                  <span className="text-sm font-medium text-slate-500">
                    {getStatusLabel(eventoSelecionado.status)}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  {eventoSelecionado.titulo}
                </h3>
              </div>

              <button
                onClick={fecharModal}
                className="rounded-2xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4">
              <InfoCard
                titulo="Descrição"
                valor={eventoSelecionado.descricao || 'Não informada'}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard
                  titulo="Início"
                  valor={new Date(eventoSelecionado.inicio).toLocaleString(
                    'pt-BR',
                  )}
                />
                <InfoCard
                  titulo="Fim"
                  valor={new Date(eventoSelecionado.fim).toLocaleString(
                    'pt-BR',
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard
                  titulo="Local"
                  valor={eventoSelecionado.local || 'Não informado'}
                  icone={<MapPin size={16} />}
                />
                <InfoCard
                  titulo="Responsável"
                  valor={eventoSelecionado.criadoPor || 'Não informado'}
                  icone={<User size={16} />}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={fecharModal}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Fechar
              </button>

              <button
                onClick={abrirEdicao}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#23415e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1c344c]"
              >
                <Edit size={16} />
                Editar
              </button>
            </div>
          </div>
        </div>
      )}
      <CreateEventoModal
        aberto={modalEdicaoAberto}
        onClose={fecharEdicao}
        onSuccess={carregarEventos}
        eventoEmEdicao={eventoEmEdicao}
      />
    </DashboardLayout>
  )
}

function Legenda({ nome, cor }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-[#f8fafc] px-3 py-2 text-sm text-slate-700">
      <span
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: cor }}
      />
      {nome}
    </div>
  )
}

function InfoCard({ titulo, valor, icone }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-[#fbfcfe] p-4">
      <div className="flex items-center gap-2">
        {icone && <span className="text-[#35506b]">{icone}</span>}
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          {titulo}
        </p>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-800">{valor}</p>
    </div>
  )
}