import { io, Socket } from "socket.io-client";

let _socket: Socket | null = null;

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
}
