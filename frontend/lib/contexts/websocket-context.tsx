'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth-context';
import { toast } from 'sonner';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001', {
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
        
        // Join user-specific room
        newSocket.emit('join', user.id);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        setIsConnected(false);
      });

      // Listen for dispute updates
      newSocket.on('disputeUpdate', (dispute) => {
        console.log('Dispute updated:', dispute);
        toast.success(`Dispute "${dispute.itemName}" status updated to ${dispute.status}`);
      });

      // Listen for admin notifications (if user is admin)
      if (user.role === 'admin') {
        newSocket.on('adminDisputeUpdate', (dispute) => {
          console.log('Admin notification - dispute updated:', dispute);
          toast.info(`New dispute activity: ${dispute.itemName} (${dispute.status})`);
        });
      }

      // Listen for status changes
      newSocket.on('statusChange', (data) => {
        toast.info(data.message);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  return (
    <WebSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}