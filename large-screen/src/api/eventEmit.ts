const EventName = [
  "API:UN_AUTHORIZED",
  "API:INVALID",
  "API:NETWORK_ERROR",
  "API:SESSION_EXPIRED",
] as const;

type EventName = (typeof EventName)[number];

class EventEmitter {
  private listeners: Map<EventName, Set<Function>> = new Map();

  on(eventName: EventName, listener: Function) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)!.add(listener);
  }

  emit(eventName: EventName, ...args: any[]) {
    if (!this.listeners.has(eventName)) {
      console.log(`No listeners registered for event: ${eventName}`);
      return;
    }
    this.listeners.get(eventName)!.forEach((listener) => {
      listener(...args);
    });
  }

  off(eventName: EventName, listener: Function) {
    this.listeners.get(eventName)!.delete(listener);
  }

  once(eventName: EventName, listener: Function) {
    const wrappedListener = (...args: any[]) => {
      this.off(eventName, wrappedListener);
      listener(...args);
    };
    this.on(eventName, wrappedListener);
  }

  removeAllListeners(eventName?: EventName) {
    if (eventName) {
      this.listeners.delete(eventName);
    } else {
      this.listeners.clear();
    }
  }
}

export default new EventEmitter();
