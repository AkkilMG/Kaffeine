import { EventEmitter } from 'events';

export type StatusUpdateEvent = {
  type: 'status-update';
  kaffeinerId: string;
  userId: string;
  status: boolean;
  time: string;
};

export type KaffeinerChangeEvent = {
  type: 'kaffeiner-change';
  action: 'create' | 'delete' | 'update';
  userId: string;
  kaffeinerId: string;
};

export type UserChangeEvent = {
  type: 'user-change';
  action: 'create' | 'delete' | 'role-change' | 'ban' | 'unban' | 'reset-password';
  userId?: string;
};

export type RealtimeEvent = StatusUpdateEvent | KaffeinerChangeEvent | UserChangeEvent;

class RealtimeEventBus {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(500);
  }

  emit(event: RealtimeEvent) {
    this.emitter.emit('event', event);
  }

  subscribe(listener: (event: RealtimeEvent) => void): () => void {
    this.emitter.on('event', listener);
    return () => {
      this.emitter.off('event', listener);
    };
  }

  removeAllListeners() {
    this.emitter.removeAllListeners();
  }
}

export const eventBus = new RealtimeEventBus();
