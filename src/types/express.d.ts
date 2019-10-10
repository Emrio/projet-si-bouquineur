declare namespace Express {
  export interface Request {
    flash: (type: 'error' | 'success' | 'info' | 'warning', content: string) => void
  }

  export interface Response {
    api: API
  }

  interface API {
    send: (code: ResponseCode, additionalInfo: any) => void
    buildBoard: (filepath: string, pagetitle: string, opts?: any) => void
    buildError: (code: ResponseCode, message: string) => void
  }

  export type ResponseCode = 200 | 400 | 401 | 403 | 404 | 405 | 429 | 500 | 501 | 503
}
