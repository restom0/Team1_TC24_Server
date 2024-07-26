const OrderDto = {
  constructor(Order) {
    this.id = Order.id
    this.userId = Order.userId
    this.tableId = Order.tableId
    this.name = Order.name
    this.phone_number = Order.phone_number
    this.payment = Order.payment
    this.menu = Order.menu
    this.status = Order.status
    this.checkin = Order.checkin
    this.createdAt = Order.createdAt
  }
}
export { OrderDto }
