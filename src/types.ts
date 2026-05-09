export type Tab = 'hub' | 'browser' | 'node' | 'playground' | 'memory';

export interface ExecutionFrame {
  id: string;
  name: string;
  type: 'function' | 'anonymous' | 'callback';
  line?: number;
}
