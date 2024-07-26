import MenuItem from '../models/menus.model.js'

const createMenuItem = async (data) => {
  const newItem = new MenuItem(data)
  await newItem.save()
  return newItem
}

const getAllMenuItems = async () => {
  const items = await MenuItem.find()
  return items
}

const getMenuItemById = async (id) => {
  const item = await MenuItem.findById(id)
  if (!item) throw new Error('Item not found')
  return item
}

const updateMenuItemById = async (id, data) => {
  const item = await MenuItem.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  })
  if (!item) throw new Error('Item not found')
  return item
}

const deleteMenuItemById = async (id) => {
  const item = await MenuItem.findByIdAndDelete(id)
  if (!item) throw new Error('Item not found')
  return item
}

export const MenuService = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItemById,
  deleteMenuItemById
}
