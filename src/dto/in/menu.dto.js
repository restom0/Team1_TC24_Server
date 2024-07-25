import { body, validationResult } from 'express-validator'
export const validateMenuItem = [
  body('code').notEmpty().withMessage('Code is required').isString().withMessage('Code must be a string'),
  body('name')
    .trim()
    .custom((value, { req }) => {
      if (value.trim().length === 0) {
        throw new Error('Name cannot be empty or contain only spaces')
      }
      return true
    }),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isString()
    .withMessage('Category must be a string')
    .isIn(['Dish', 'Beverage', 'Dessert'])
    .withMessage('Category must be one of: Dish, Beverage, Dessert'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string'),
  body('unit').notEmpty().withMessage('Unit is required').isString().withMessage('Unit must be a string'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('discount').optional().isFloat({ min: 0 }).withMessage('Discount must be a positive number')
]
