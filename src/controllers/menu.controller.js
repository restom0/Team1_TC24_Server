import { Response } from '../dto/response/response.js'
import MenuItem from '../models/menus.model.js'

const createMenuItem = async (req, res) => {
  // #swagger.tags=['Menu']
  try {
    const newItem = new MenuItem(req.body)
    await newItem.save()
    return new Response(201, 'Item created', newItem).resposeHandler(res)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const getAllMenuItems = async (req, res) => {
  // #swagger.tags=['Menu']
  try {
    const items = await MenuItem.aggregate([
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurant_id',
          foreignField: '_id',
          as: 'restaurant'
        }
      },
      {
        $unwind: '$restaurant'
      }
    ])
    res.status(200).json(items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMenuItemById = async (req, res) => {
  // #swagger.tags=['Menu']
  try {
    const item = await MenuItem.aggregate([
      {
        $match: { _id: req.params.id }
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurant_id',
          foreignField: '_id',
          as: 'restaurant'
        }
      },
      {
        $unwind: '$restaurant'
      }
    ])
    if (!item) return res.status(404).json({ message: 'Item not found' })
    res.status(200).json(item)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateMenuItemById = async (req, res) => {
  // #swagger.tags=['Menu']
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!item) return res.status(404).json({ message: 'Item not found' })
    res.status(200).json(item)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const deleteMenuItemById = async (req, res) => {
  // #swagger.tags=['Menu']
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ message: 'Item not found' })
    res.status(200).json({ message: 'Item deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const MenuController = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItemById,
  deleteMenuItemById
}
