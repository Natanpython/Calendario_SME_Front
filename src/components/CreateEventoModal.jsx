import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { api } from '../services/api'

export function CreateEventoModal({ aberto, onClose, onSuccess }) {
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    local: '',
    exigeTransporte: false,
    categoriaId: '',
  })
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (aberto) {
      carregarCategorias()
    }
  }, [aberto])

  async function carregarCategorias() {
  try {
    const response = await api.get('/categorias-evento')
    setCategorias(response.data)
  } catch (error) {
    console.error('ERRO CATEGORIAS:', error)
  }
}

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setForm((estadoAnterior) => ({
      ...estadoAnterior,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setCarregando(true)
      setErro('')

      await api.post('/eventos', form)

      onSuccess?.()
      onClose?.()

      setForm({
        titulo: '',
        descricao: '',
        dataInicio: '',
        dataFim: '',
        local: '',
        exigeTransporte: false,
        categoriaId: '',
      })
    } catch (error) {
      setErro(
        error?.response?.data?.message || 'Não foi possível criar o evento.',
      )
    } finally {
      setCarregando(false)
    }
  }

  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Novo evento</h3>
            <p className="mt-1 text-sm text-slate-500">
              Cadastre um novo evento institucional.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Título
            </label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              placeholder="Ex.: Reunião pedagógica"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Descrição
            </label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              rows={4}
              placeholder="Descreva o evento"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Data/Hora de início
            </label>
            <input
              type="datetime-local"
              name="dataInicio"
              value={form.dataInicio}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Data/Hora de fim
            </label>
            <input
              type="datetime-local"
              name="dataFim"
              value={form.dataFim}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Local
            </label>
            <input
              type="text"
              name="local"
              value={form.local}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              placeholder="Auditório da Secretaria"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Categoria
            </label>
            <select
              name="categoriaId"
              value={form.categoriaId}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              required
            >
              <option value="">Selecione</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
              <input
                type="checkbox"
                name="exigeTransporte"
                checked={form.exigeTransporte}
                onChange={handleChange}
              />
              Este evento exige transporte
            </label>
          </div>

          {erro && (
            <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {erro}
            </div>
          )}

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={carregando}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
            >
              {carregando ? 'Salvando...' : 'Salvar evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}