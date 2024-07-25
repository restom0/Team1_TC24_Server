// userId: { type: ObjectId, ref: 'Users', required: true },
//     tableId: { type: [ObjectId], ref: 'Tables', required: true },
//     name: { type: String, required: true },
//     phone_number: { type: String, required: true },
//     payment: { type: String, require: true, enum: PAYMENT_METHOD },
//     menu: { type: [ObjectId], required: true },
//     status: { type: String, required: true, enum: PAYMENT_STATUS },
//     checkin: { type: Date, required: true },
//     createdAt: { type: Date, required: true, default: Date.now },
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
