import { Navigate } from 'react-router-dom'

export function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  const usuario = localStorage.getItem('usuario')

  if (!token || !usuario) {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    return <Navigate to="/login" replace />
  }

  return children
}