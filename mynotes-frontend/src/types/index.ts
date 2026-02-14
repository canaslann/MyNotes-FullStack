// Block Types
export enum BlockType {
  PAGE = 'PAGE',
  HEADING = 'HEADING',
  TEXT = 'TEXT',
  BULLET = 'BULLET',
  TODO = 'TODO',
}

// Core Models
export interface Block {
  id: string;
  type: BlockType;
  content: string;
  parentId: string | null;
  properties: Record<string, any>;
  timestamp: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

// API Request/Response Types
export interface AuthRequest {
  email: string;
  password: string;
  username?: string;
}

export interface AuthResponse {
  token: string;
}

export interface BlockRequest {
  type: BlockType;
  content: string;
  parentId: string | null;
  properties?: Record<string, any>;
}

export interface BlockResponse extends Block {}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  path: string;
  timestamp: string;
}

// Frontend Specific Types
export interface PageNode extends Block {
  children?: Block[];
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
}

export interface BlockState {
  blocks: Block[];
  currentPage: string | null;
  rootPages: Block[];
  loading: boolean;
  error: string | null;
  fetchRootPages: () => Promise<void>;
  fetchPageContent: (pageId: string) => Promise<void>;
  createBlock: (block: BlockRequest) => Promise<void>;
  updateBlock: (id: string, block: Partial<BlockRequest>) => Promise<void>;
  deleteBlock: (id: string) => Promise<void>;
  moveBlock: (id: string, newParentId: string) => Promise<void>;
}
