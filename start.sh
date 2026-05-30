#!/usr/bin/env bash
#
# start.sh — Lancer / arrêter / redémarrer le site AM Express Transport en local.
#
#   ./start.sh start            Démarre le serveur (mode développement, recommandé)
#   ./start.sh start preview    Démarre en mode "build de production" (npm run build + preview)
#   ./start.sh stop             Arrête le serveur
#   ./start.sh restart          Redémarre (reprend le même mode)
#   ./start.sh status           Affiche l'état du serveur
#
# Le serveur tourne en arrière-plan. PID dans .server.pid, logs dans .server.log.
#
set -u

# Se placer dans le dossier du script (le projet), quel que soit l'endroit d'appel
cd "$(dirname "$0")" || exit 1

PORT=4321
PIDFILE=".server.pid"
LOGFILE=".server.log"
MODEFILE=".server.mode"
ASTRO="./node_modules/.bin/astro"

# Petites couleurs (désactivées si pas un terminal)
if [ -t 1 ]; then
  G='\033[0;32m'; R='\033[0;31m'; Y='\033[0;33m'; B='\033[0;34m'; N='\033[0m'
else
  G=''; R=''; Y=''; B=''; N=''
fi
info()  { printf "${B}ℹ️  %s${N}\n" "$1"; }
ok()    { printf "${G}✅ %s${N}\n" "$1"; }
warn()  { printf "${Y}⚠️  %s${N}\n" "$1"; }
err()   { printf "${R}❌ %s${N}\n" "$1"; }

# Le serveur tourne-t-il ? (via le PID enregistré)
is_running() {
  [ -f "$PIDFILE" ] || return 1
  local pid; pid="$(cat "$PIDFILE" 2>/dev/null)"
  [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null
}

local_ip() { hostname -I 2>/dev/null | awk '{print $1}'; }

print_urls() {
  ok "Site accessible :"
  printf "   • Ordinateur : ${B}http://localhost:%s/${N}\n" "$PORT"
  local ip; ip="$(local_ip)"
  [ -n "$ip" ] && printf "   • Mobile     : ${B}http://%s:%s/${N}  (même Wi-Fi)\n" "$ip" "$PORT"
}

do_start() {
  local mode="${1:-dev}"

  if is_running; then
    warn "Le serveur tourne déjà (PID $(cat "$PIDFILE"))."
    print_urls
    return 0
  fi

  # Dépendances installées ?
  if [ ! -d node_modules ]; then
    info "Installation des dépendances (npm install)…"
    npm install || { err "npm install a échoué."; exit 1; }
  fi

  # Mode preview = on (re)construit d'abord le site
  if [ "$mode" = "preview" ]; then
    info "Construction du site (npm run build)…"
    if ! npm run build > "$LOGFILE" 2>&1; then
      err "Le build a échoué. Voir $LOGFILE :"
      tail -n 15 "$LOGFILE"
      exit 1
    fi
    info "Démarrage du serveur (mode preview)…"
    nohup "$ASTRO" preview --host 0.0.0.0 --port "$PORT" >> "$LOGFILE" 2>&1 &
  else
    info "Démarrage du serveur (mode développement)…"
    nohup "$ASTRO" dev --host 0.0.0.0 --port "$PORT" > "$LOGFILE" 2>&1 &
  fi

  local pid=$!
  echo "$pid" > "$PIDFILE"
  echo "$mode" > "$MODEFILE"

  # Attendre que le serveur réponde (max ~15 s)
  for _ in $(seq 1 30); do
    if curl -s -o /dev/null "http://localhost:$PORT/" 2>/dev/null; then
      ok "Serveur démarré (mode $mode, PID $pid)."
      print_urls
      info "Logs : $LOGFILE   ·   Arrêt : ./start.sh stop"
      return 0
    fi
    # Le process est-il mort prématurément ?
    if ! kill -0 "$pid" 2>/dev/null; then
      err "Le serveur s'est arrêté au démarrage. Voir $LOGFILE :"
      tail -n 15 "$LOGFILE"
      rm -f "$PIDFILE"
      exit 1
    fi
    sleep 0.5
  done

  warn "Le serveur met du temps à répondre. Vérifiez $LOGFILE."
}

do_stop() {
  local stopped=0
  if is_running; then
    local pid; pid="$(cat "$PIDFILE")"
    info "Arrêt du serveur (PID $pid)…"
    kill "$pid" 2>/dev/null
    # Laisser le temps de s'arrêter, puis forcer si besoin
    for _ in $(seq 1 10); do
      kill -0 "$pid" 2>/dev/null || break
      sleep 0.3
    done
    kill -9 "$pid" 2>/dev/null
    stopped=1
  fi
  rm -f "$PIDFILE"

  # Filet de sécurité : libérer le port s'il est encore occupé
  if command -v fuser >/dev/null 2>&1 && fuser "$PORT/tcp" >/dev/null 2>&1; then
    fuser -k "$PORT/tcp" >/dev/null 2>&1
    stopped=1
  fi

  if [ "$stopped" = "1" ]; then ok "Serveur arrêté."; else info "Aucun serveur en cours."; fi
}

do_status() {
  if is_running; then
    ok "Serveur actif (mode $(cat "$MODEFILE" 2>/dev/null || echo '?'), PID $(cat "$PIDFILE"))."
    print_urls
  else
    info "Serveur arrêté."
  fi
}

case "${1:-}" in
  start)   do_start "${2:-dev}" ;;
  stop)    do_stop ;;
  restart) do_stop; echo; do_start "${2:-$(cat "$MODEFILE" 2>/dev/null || echo dev)}" ;;
  status)  do_status ;;
  *)
    echo "Usage : ./start.sh {start|stop|restart|status} [preview]"
    echo
    echo "  start            Démarre en mode développement (recommandé)"
    echo "  start preview    Démarre en mode build de production"
    echo "  stop             Arrête le serveur"
    echo "  restart          Redémarre (même mode qu'au dernier démarrage)"
    echo "  status           État du serveur"
    exit 1
    ;;
esac
