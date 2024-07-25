export class Response {
  constructor(status, message, data) {
    this.status = status
    this.message = message
    this.data = data
  }

  resposeHandler = (res) => {
    return res.status(this.status).json({
      status: this.status,
      message: this.message,
      data: this.data
    })
  }
}
