import { io, Socket } from "socket.io-client";

let _socket: Socket | null = null;

// Buffer for question events that arrive before the battle page mounts
// (server may send question during the brief casual→battle navigation window).
let _pendingQuestion: unknown = null;

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001") + "/match";

/** Singleton socket — shared across pages so the match survives navigation. */
export function getMatchSocket(): Socket {
  if (!_socket) {
    _socket = io(SOCKET_URL, { autoConnect: false, transports: ["websocket"] });
  }
  return _socket;
}

export function disconnectMatchSocket() {
  if (_socket) {
    _socket.disconnect();
    _socket = null;
  }
  _pendingQuestion = null;
}

/** Store a question received before the battle page is ready. */
export function setPendingQuestion(data: unknown) {
  _pendingQuestion = data;
}

/** Consume (and clear) the buffered question. Returns null if none. */
export function takePendingQuestion(): unknown {
  const q = _pendingQuestion;
  _pendingQuestion = null;
  return q;
}
