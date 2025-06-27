// classe para representar um erro HTTP
// com um código de status e uma mensagem
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
