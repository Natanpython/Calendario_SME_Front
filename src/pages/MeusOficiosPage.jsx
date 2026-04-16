import { useEffect, useState } from 'react'
import { FileDown, FileText, CalendarDays, CircleCheck } from 'lucide-react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { api } from '../services/api'

export function MeusOficiosPage() {
  const [oficios, setOficios] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarOficios()
  }, [])

  async function carregarOficios() {
    try {
      const response = await api.get('/eventos')

      const eventosComOficio = response.data
        .filter((evento) => evento.oficio)
        .sort(
          (a, b) =>
            new Date(b.oficio.criadoEm) - new Date(a.oficio.criadoEm),
        )

      setOficios(eventosComOficio)
    } catch (error) {
      console.error('Erro ao carregar ofícios:', error)
    } finally {
      setCarregando(false)
    }
  }

  async function baixarOficio(oficioId) {
    try {
      const response = await api.get(`/transporte/oficio/${oficioId}`, {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `oficio-${oficioId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao baixar ofício:', error)
      alert(
        error?.response?.data?.message || 'Não foi possível baixar o ofício.',
      )
    }
  }

  return (
    <DashboardLayout titulo="Ofícios Gerados">
      <div className="space-y-6">
        

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {carregando ? (
            <Estado texto="Carregando ofícios..." />
          ) : oficios.length === 0 ? (
            <Estado texto="Nenhum ofício encontrado até o momento." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {oficios.map((evento) => (
                <OficioCard
                  key={evento.id}
                  evento={evento}
                  onBaixar={() => baixarOficio(evento.oficio.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  )
}

function OficioCard({ evento, onBaixar }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-[#fbfcfe] p-5 transition hover:border-slate-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl bg-[#eef4fb] p-3 text-[#35506b]">
          <FileText size={22} />
        </div>

        <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          <CircleCheck size={14} />
          Gerado
        </span>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Número do ofício
        </p>
        <h4 className="mt-1 text-lg font-bold text-slate-900">
          {evento.oficio?.numero || 'Ofício gerado'}
        </h4>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Evento vinculado
        </p>
        <p className="mt-1 text-sm font-medium text-slate-800">
          {evento.titulo}
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <CalendarDays size={16} className="mt-0.5 text-[#35506b]" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Gerado em
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {new Date(evento.oficio.criadoEm).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onBaixar}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#23415e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1c344c]"
      >
        <FileDown size={18} />
        Baixar PDF
      </button>
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