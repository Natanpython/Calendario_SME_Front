import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import { CadastroPage } from '../pages/CadastroPage'
import { VerificarCodigoPage } from '../pages/VerificarCodigoPage'
import { DashboardPage } from '../pages/DashboardPage'
import { CalendarPage } from '../pages/CalendarPage'
import { EventosPage } from '../pages/EventosPage'
import { EventosPendentesPage } from '../pages/EventosPendentesPage'
import { TransportePage } from '../pages/TransportePage'
import { MeusOficiosPage } from '../pages/MeusOficiosPage'
import { UsuariosPage } from '../pages/UsuariosPage'
import { PrivateRoute } from './PrivateRoute'
import { EsqueciSenhaPage } from '../pages/EsqueciSenhaPage'
import { RedefinirSenhaPage } from '../pages/RedefinirSenhaPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route path="/verificar-codigo" element={<VerificarCodigoPage />} />
      <Route path="/esqueci-senha" element={<EsqueciSenhaPage />} />
      <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />

      <Route
        path="/painel"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/calendario"
        element={
          <PrivateRoute>
            <CalendarPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/eventos"
        element={
          <PrivateRoute>
            <EventosPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/eventos/pendentes"
        element={
          <PrivateRoute>
            <EventosPendentesPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/transporte"
        element={
          <PrivateRoute>
            <TransportePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/oficios"
        element={
          <PrivateRoute>
            <MeusOficiosPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/usuarios"
        element={
          <PrivateRoute>
            <UsuariosPage />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}