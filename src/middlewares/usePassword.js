import bcrypt from 'bcrypt'
const saltRounds = 10
// const myPlaintextPassword = "s0//P4$$w0rD";
// const someOtherPlaintextPassword = "not_bacon";

const createHash = async (data) => {
  try {
    const hash = await bcrypt.hash(data, saltRounds)
    return hash
  } catch (error) {
    console.error('Error creating hash:', error)
    throw error
  }
}
const checkPassword = async (data, hash) => {
  try {
    const result = await bcrypt.compare(data, hash)
    return result
  } catch (error) {
    console.error('Error comparing password:', error)
    throw error
  }
}
export { createHash, checkPassword }
