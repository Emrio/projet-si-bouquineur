declare namespace Express {
  export interface Request {
    flash: (type: 'error' | 'success' | 'info' | 'warning', content: string) => void
  }
}
