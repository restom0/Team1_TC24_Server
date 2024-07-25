// name: { type: String, required: true },
//     address: { type: String, required: true },
//     openTime: { type: Number, required: true },
//     closeTime: { type: Number, required: true },
//     description: { type: String, required: true },
//     imageUrls: { type: String, required: true },
//     createdAt: { type: Date, required: true, default: Date.now },
const RestaurantDto = {
  constructor(Table) {
    this.id = Table.id
    this.name = Table.name
    this.address = Table.address
    this.openTime = Table.openTime
    this.closeTime = Table.closeTime
    this.description = Table.description
    this.imageUrls = Table.imageUrls
  }
}
export { RestaurantDto }
