import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { api } from '../services/api'

const formInicial = {
  titulo: '',
  descricao: '',
  dataInicio: '',
  horaInicio: '',
  dataFim: '',
  horaFim: '',
  local: '',
  exigeTransporte: false,
  categoriaId: '',
}

export function CreateEventoModal({
  aberto,
  onClose,
  onSuccess,
  eventoEmEdicao = null,
}) {
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState(formInicial)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (aberto) {
      carregarCategorias()
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [aberto])

  useEffect(() => {
    if (!aberto) return

    if (eventoEmEdicao) {
      const inicio = separarDataHora(eventoEmEdicao.dataInicio)
      const fim = separarDataHora(eventoEmEdicao.dataFim)

      setForm({
        titulo: eventoEmEdicao.titulo || '',
        descricao: eventoEmEdicao.descricao || '',
        dataInicio: inicio.data,
        horaInicio: inicio.hora,
        dataFim: fim.data,
        horaFim: fim.hora,
        local: eventoEmEdicao.local || '',
        exigeTransporte: eventoEmEdicao.exigeTransporte || false,
        categoriaId:
          eventoEmEdicao.categoriaId || eventoEmEdicao.categoria?.id || '',
      })
    } else {
      setForm(formInicial)
    }

    setErro('')
  }, [aberto, eventoEmEdicao])

  function separarDataHora(valor) {
    if (!valor) return { data: '', hora: '' }

    const data = new Date(valor)

    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')
    const hora = String(data.getHours()).padStart(2, '0')
    const minuto = String(data.getMinutes()).padStart(2, '0')

    return {
      data: `${ano}-${mes}-${dia}`,
      hora: `${hora}:${minuto}`,
    }
  }

  async function carregarCategorias() {
    try {
      const response = await api.get('/categorias-evento')
      setCategorias(response.data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setForm((estadoAnterior) => ({
      ...estadoAnterior,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function montarDataHora(data, hora) {
    if (!data || !hora) return ''
    return `${data}T${hora}:00`
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setCarregando(true)
      setErro('')

      const dataInicioCompleta = montarDataHora(form.dataInicio, form.horaInicio)
      const dataFimCompleta = montarDataHora(form.dataFim, form.horaFim)

      if (!dataInicioCompleta || !dataFimCompleta) {
        setErro('Preencha corretamente a data e a hora de início e fim.')
        setCarregando(false)
        return
      }

      const payload = {
        titulo: form.titulo,
        descricao: form.descricao,
        dataInicio: dataInicioCompleta,
        dataFim: dataFimCompleta,
        local: form.local,
        exigeTransporte: form.exigeTransporte,
        categoriaId: form.categoriaId,
      }

      if (eventoEmEdicao) {
        await api.patch(`/eventos/${eventoEmEdicao.id}`, payload)
      } else {
        await api.post('/eventos', payload)
      }

      setForm(formInicial)

      onSuccess?.()
      onClose?.()
    } catch (error) {
      const mensagem = Array.isArray(error?.response?.data?.message)
        ? error.response.data.message.join(', ')
        : error?.response?.data?.message ||
        (eventoEmEdicao
          ? 'Não foi possível editar o evento.'
          : 'Não foi possível criar o evento.')

      setErro(mensagem)
    } finally {
      setCarregando(false)
    }
  }

  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 px-4 py-6">
      <div className="flex min-h-full items-start justify-center">
        <div className="my-4 w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl sm:p-6 md:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#35506b]">
                {eventoEmEdicao ? 'Edição de evento' : 'Cadastro de evento'}
              </p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900">
                {eventoEmEdicao ? 'Editar evento' : 'Novo evento'}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {eventoEmEdicao
                  ? 'Atualize os dados do evento institucional.'
                  : 'Preencha os dados para registrar um novo evento institucional.'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="shrink-0 rounded-2xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <Field label="Título" className="md:col-span-2">
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                className="w-full min-w-0 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
                placeholder="Ex.: Reunião pedagógica"
                required
              />
            </Field>

            <Field label="Descrição" className="md:col-span-2">
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                className="w-full min-w-0 resize-none rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
                rows={4}
                placeholder="Descreva o evento"
              />
            </Field>

            <Field label="Data de início">
              <input
                type="date"
                name="dataInicio"
                value={form.dataInicio}
                onChange={handleChange}
                className="block w-full min-w-0 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
                required
              />
            </Field>

            <Field label="Hora de início">
              <input
                type="time"
                name="horaInicio"
                value={form.horaInicio}
                onChange={handleChange}
                className="block w-full min-w-0 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
                required
              />
            </Field>

            <Field label="Data de fim">
              <input
                type="date"
                name="dataFim"
                value={form.dataFim}
                onChange={handleChange}
                className="block w-full min-w-0 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
                required
              />
            </Field>

            <Field label="Hora de fim">
              <input
                type="time"
                name="horaFim"
                value={form.horaFim}
                onChange={handleChange}
                className="block w-full min-w-0 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
                required
              />
            </Field>

            <Field label="Local">
              <input
                type="text"
                name="local"
                value={form.local}
                onChange={handleChange}
                className="w-full min-w-0 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
                placeholder="Auditório da Secretaria"
              />
            </Field>

            <Field label="Categoria">
              <select
                name="categoriaId"
                value={form.categoriaId}
                onChange={handleChange}
                className="w-full min-w-0 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
                required
              >
                <option value="">Selecione</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </Field>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-sm text-slate-700 transition hover:bg-white">
                <input
                  type="checkbox"
                  name="exigeTransporte"
                  checked={form.exigeTransporte}
                  onChange={handleChange}
                  className="h-4 w-4 shrink-0 rounded border-slate-300"
                />
                Este evento exige transporte
              </label>
            </div>

            {erro && (
              <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {erro}
              </div>
            )}

            <div className="md:col-span-2 flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={carregando}
                className="rounded-2xl bg-[#23415e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1c344c] disabled:opacity-70"
              >
                {carregando
                  ? 'Salvando...'
                  : eventoEmEdicao
                    ? 'Salvar alterações'
                    : 'Salvar evento'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  )
}