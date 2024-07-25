import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })
export const DATABASE_CONFIG = {
  MONGO_DATABASE:
    process.env.MONGODB_URI |
    'mongodb+srv://nguyenthanhnhonabc:nhon@app.2jwix0f.mongodb.net/?retryWrites=true&w=majority&appName=app'
}
