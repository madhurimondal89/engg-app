import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";

// In-memory storage for shared calculations
interface SharedCalculation {
  roomId: string;
  calculatorType: string;
  data: any;
  participants: Set<WebSocket>;
  lastUpdated: Date;
}

const sharedCalculations = new Map<string, SharedCalculation>();

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from public directory
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Handle HTML routes
  app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
  });

  // Serve SEO files
  app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'sitemap.xml'));
  });
  app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'robots.txt'));
  });

  app.get('/calculators/:calculator', (req, res) => {
    const calculatorFile = path.join(process.cwd(), 'public', 'calculators', `${req.params.calculator}.html`);
    res.sendFile(calculatorFile, (err) => {
      if (err) {
        res.status(404).sendFile(path.join(process.cwd(), 'public', 'index.html'));
      }
    });
  });

  // API routes for shared calculations
  app.post('/api/share/create', express.json(), (req, res) => {
    const { calculatorType, data } = req.body;
    const roomId = generateRoomId();

    sharedCalculations.set(roomId, {
      roomId,
      calculatorType,
      data,
      participants: new Set(),
      lastUpdated: new Date()
    });

    res.json({ roomId, shareUrl: `/calculators/${calculatorType}?room=${roomId}` });
  });

  app.get('/api/share/:roomId', (req, res) => {
    const { roomId } = req.params;
    const calculation = sharedCalculations.get(roomId);

    if (!calculation) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({
      roomId: calculation.roomId,
      calculatorType: calculation.calculatorType,
      data: calculation.data,
      participantCount: calculation.participants.size
    });
  });

  const httpServer = createServer(app);

  // Set up WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws, req) => {
    let currentRoom: string | null = null;

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());

        switch (data.type) {
          case 'join_room':
            handleJoinRoom(ws, data.roomId);
            currentRoom = data.roomId;
            break;

          case 'update_calculation':
            handleUpdateCalculation(data.roomId, data.calculationData);
            break;

          case 'leave_room':
            handleLeaveRoom(ws, data.roomId);
            currentRoom = null;
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (currentRoom) {
        handleLeaveRoom(ws, currentRoom);
      }
    });

    function handleJoinRoom(socket: WebSocket, roomId: string) {
      const calculation = sharedCalculations.get(roomId);
      if (!calculation) {
        socket.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
        return;
      }

      calculation.participants.add(socket);

      // Send current calculation data to the new participant
      socket.send(JSON.stringify({
        type: 'room_joined',
        roomId,
        calculationData: calculation.data,
        participantCount: calculation.participants.size
      }));

      // Notify other participants
      broadcastToRoom(roomId, {
        type: 'participant_joined',
        participantCount: calculation.participants.size
      }, socket);
    }

    function handleUpdateCalculation(roomId: string, calculationData: any) {
      const calculation = sharedCalculations.get(roomId);
      if (!calculation) return;

      calculation.data = calculationData;
      calculation.lastUpdated = new Date();

      // Broadcast update to all participants
      broadcastToRoom(roomId, {
        type: 'calculation_updated',
        calculationData
      });
    }

    function handleLeaveRoom(socket: WebSocket, roomId: string) {
      const calculation = sharedCalculations.get(roomId);
      if (!calculation) return;

      calculation.participants.delete(socket);

      // Notify remaining participants
      broadcastToRoom(roomId, {
        type: 'participant_left',
        participantCount: calculation.participants.size
      });

      // Clean up empty rooms
      if (calculation.participants.size === 0) {
        sharedCalculations.delete(roomId);
      }
    }

    function broadcastToRoom(roomId: string, message: any, excludeSocket?: WebSocket) {
      const calculation = sharedCalculations.get(roomId);
      if (!calculation) return;

      const messageStr = JSON.stringify(message);
      calculation.participants.forEach(socket => {
        if (socket !== excludeSocket && socket.readyState === WebSocket.OPEN) {
          socket.send(messageStr);
        }
      });
    }
  });

  return httpServer;
}

function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
