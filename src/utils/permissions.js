export function getUsuarioLogado() {
  const usuarioSalvo = localStorage.getItem('usuario')
  return usuarioSalvo ? JSON.parse(usuarioSalvo) : null
}

export function isAdmin() {
  const usuario = getUsuarioLogado()
  return usuario?.perfil === 'ADMIN'
}

export function isCoordenador() {
  const usuario = getUsuarioLogado()
  return usuario?.perfil === 'COORDENADOR'
}

export function isGestor() {
  const usuario = getUsuarioLogado()
  return usuario?.perfil === 'GESTOR'
}

export function podeCriarEvento() {
  const usuario = getUsuarioLogado()
  return usuario?.perfil === 'ADMIN' || usuario?.perfil === 'COORDENADOR'
}

export function podeSolicitarTransporte() {
  const usuario = getUsuarioLogado()
  return usuario?.perfil === 'COORDENADOR' || usuario?.perfil === 'ADMIN'
}

export function podeAprovarEventos() {
  const usuario = getUsuarioLogado()
  return usuario?.perfil === 'ADMIN'
}

export function podeGerenciarUsuarios() {
  const usuario = getUsuarioLogado()
  return usuario?.perfil === 'ADMIN'
}