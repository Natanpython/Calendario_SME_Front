import { useEffect, useState } from 'react'
import {
  BusFront,
  CalendarDays,
  MapPin,
  Users,
  UserRound,
  Phone,
  Briefcase,
  FileText,
  ClipboardList,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { api } from '../services/api'
import { podeSolicitarTransporte } from '../utils/permissions'

export function TransportePage() {
  const navigate = useNavigate()
  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [carregandoEventos, setCarregandoEventos] = useState(true)

  const [form, setForm] = useState({
    eventoId: '',
    horarioSaida: '',
    horarioRetorno: '',
    localSaida: '',
    destino: '',
    quantidadePassageiros: '',
    responsavelNome: '',
    responsavelTelefone: '',
    cargoSolicitante: '',
    justificativa: '',
    observacoes: '',
  })

  useEffect(() => {
    if (!podeSolicitarTransporte()) {
      navigate('/calendario')
      return
    }

    carregarEventos()
  }, [navigate])

  async function carregarEventos() {
    try {
      setCarregandoEventos(true)
      const response = await api.get('/eventos')
      const aprovados = response.data.filter((evento) => evento.status === 'APROVADO')
      setEventos(aprovados)
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
    } finally {
      setCarregandoEventos(false)
    }
  }

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
      setCarregando(true)

      const payload = {
        eventoId: form.eventoId,
        horarioSaida: form.horarioSaida,
        horarioRetorno: form.horarioRetorno || undefined,
        localSaida: form.localSaida,
        destino: form.destino,
        quantidadePassageiros: Number(form.quantidadePassageiros),
        responsavelNome: form.responsavelNome,
        responsavelTelefone: form.responsavelTelefone || undefined,
        cargoSolicitante: form.cargoSolicitante,
        justificativa: form.justificativa,
        observacoes: form.observacoes || undefined,
      }

      await api.post('/transporte', payload)

      alert('Solicitação enviada com sucesso!')

      setForm({
        eventoId: '',
        horarioSaida: '',
        horarioRetorno: '',
        localSaida: '',
        destino: '',
        quantidadePassageiros: '',
        responsavelNome: '',
        responsavelTelefone: '',
        cargoSolicitante: '',
        justificativa: '',
        observacoes: '',
      })
    } catch (error) {
      console.error('ERRO TRANSPORTE COMPLETO:', error)
      console.error('ERRO RESPONSE DATA:', error?.response?.data)

      const mensagem = Array.isArray(error?.response?.data?.message)
        ? error.response.data.message.join(', ')
        : error?.response?.data?.message || 'Erro ao enviar solicitação.'

      alert(mensagem)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <DashboardLayout titulo="Solicitação de Transporte">
      <div className="space-y-6">
       

        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-6">
            <section>
              <div className="mb-4">
                <h4 className="text-xl font-bold text-slate-900">Dados do evento</h4>
                <p className="mt-1 text-sm text-slate-500">
                  Selecione o evento aprovado e informe o deslocamento.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InputGroup
                  label="Evento"
                  icon={<CalendarDays size={16} />}
                >
                  <select
                    name="eventoId"
                    value={form.eventoId}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none"
                    required
                  >
                    <option value="">Selecione um evento</option>
                    {eventos.map((evento) => (
                      <option key={evento.id} value={evento.id}>
                        {evento.titulo}
                      </option>
                    ))}
                  </select>
                </InputGroup>

                <InputGroup
                  label="Quantidade de passageiros"
                  icon={<Users size={16} />}
                >
                  <input
                    type="number"
                    name="quantidadePassageiros"
                    value={form.quantidadePassageiros}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none"
                    placeholder="Informe a quantidade"
                    required
                  />
                </InputGroup>

                <InputGroup
                  label="Horário de saída"
                  icon={<CalendarDays size={16} />}
                >
                  <input
                    type="datetime-local"
                    name="horarioSaida"
                    value={form.horarioSaida}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none"
                    required
                  />
                </InputGroup>

                <InputGroup
                  label="Horário de retorno"
                  icon={<CalendarDays size={16} />}
                >
                  <input
                    type="datetime-local"
                    name="horarioRetorno"
                    value={form.horarioRetorno}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none"
                  />
                </InputGroup>

                <InputGroup
                  label="Local de saída"
                  icon={<MapPin size={16} />}
                >
                  <input
                    type="text"
                    name="localSaida"
                    value={form.localSaida}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none"
                    placeholder="Ex.: Secretaria de Educação"
                    required
                  />
                </InputGroup>

                <InputGroup
                  label="Destino"
                  icon={<MapPin size={16} />}
                >
                  <input
                    type="text"
                    name="destino"
                    value={form.destino}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none"
                    placeholder="Ex.: Escola / Auditório / Local do evento"
                    required
                  />
                </InputGroup>
              </div>
            </section>

            <section className="border-t border-slate-200 pt-6">
              <div className="mb-4">
                <h4 className="text-xl font-bold text-slate-900">
                  Responsável pela solicitação
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  Informe os dados do responsável que está solicitando o transporte.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InputGroup
                  label="Responsável"
                  icon={<UserRound size={16} />}
                >
                  <input
                    type="text"
                    name="responsavelNome"
                    value={form.responsavelNome}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none"
                    placeholder="Nome do responsável"
                    required
                  />
                </InputGroup>

                <InputGroup
                  label="Telefone do responsável"
                  icon={<Phone size={16} />}
                >
                  <input
                    type="text"
                    name="responsavelTelefone"
                    value={form.responsavelTelefone}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none"
                    placeholder="(83) 99999-9999"
                  />
                </InputGroup>

                <div className="md:col-span-2">
                  <InputGroup
                    label="Cargo do solicitante"
                    icon={<Briefcase size={16} />}
                  >
                    <input
                      type="text"
                      name="cargoSolicitante"
                      value={form.cargoSolicitante}
                      onChange={handleChange}
                      className="w-full bg-transparent text-sm text-slate-900 outline-none"
                      placeholder="Ex.: Coordenador Pedagógico"
                      required
                    />
                  </InputGroup>
                </div>
              </div>
            </section>

            <section className="border-t border-slate-200 pt-6">
              <div className="mb-4">
                <h4 className="text-xl font-bold text-slate-900">
                  Justificativa e observações
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  Informe o motivo da solicitação e detalhes adicionais, se necessário.
                </p>
              </div>

              <div className="grid gap-4">
                <TextareaGroup
                  label="Justificativa"
                  icon={<FileText size={16} />}
                  name="justificativa"
                  value={form.justificativa}
                  onChange={handleChange}
                  placeholder="Descreva a justificativa da solicitação de transporte"
                  required
                  rows={4}
                />

                <TextareaGroup
                  label="Observações"
                  icon={<ClipboardList size={16} />}
                  name="observacoes"
                  value={form.observacoes}
                  onChange={handleChange}
                  placeholder="Informações adicionais, se houver"
                  rows={3}
                />
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setForm({
                    eventoId: '',
                    horarioSaida: '',
                    horarioRetorno: '',
                    localSaida: '',
                    destino: '',
                    quantidadePassageiros: '',
                    responsavelNome: '',
                    responsavelTelefone: '',
                    cargoSolicitante: '',
                    justificativa: '',
                    observacoes: '',
                  })
                }
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Limpar formulário
              </button>

              <button
                type="submit"
                disabled={carregando}
                className="rounded-2xl bg-[#23415e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1c344c] disabled:opacity-70"
              >
                {carregando ? 'Enviando solicitação...' : 'Solicitar transporte'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

function InputGroup({ label, icon, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 transition focus-within:border-slate-300 focus-within:bg-white">
        <span className="shrink-0 text-[#35506b]">{icon}</span>
        {children}
      </div>
    </div>
  )
}

function TextareaGroup({
  label,
  icon,
  name,
  value,
  onChange,
  placeholder,
  required,
  rows = 4,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 transition focus-within:border-slate-300 focus-within:bg-white">
        <div className="mb-2 flex items-center gap-2 text-[#35506b]">
          {icon}
        </div>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          className="w-full resize-none bg-transparent text-sm text-slate-900 outline-none"
          placeholder={placeholder}
          required={required}
          rows={rows}
        />
      </div>
    </div>
  )
}