// ============================================
// VALIDATION UTILITY FUNCTIONS
// utils/validation.js
// Simple validation helpers
// ============================================

// Check if value exists and is not empty
const required = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

// Check if email is valid format
const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check if number is positive
const isPositive = (value, fieldName) => {
  if (value < 0) {
    return `${fieldName} must be positive`;
  }
  return null;
};

// Check if value is a number
const isNumber = (value, fieldName) => {
  if (isNaN(value)) {
    return `${fieldName} must be a number`;
  }
  return null;
};

// Check minimum length
const minLength = (value, min, fieldName) => {
  if (value && value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  return null;
};

// Check maximum length
const maxLength = (value, max, fieldName) => {
  if (value && value.length > max) {
    return `${fieldName} must be less than ${max} characters`;
  }
  return null;
};

// Validate product data
const validateProduct = (data) => {
  const errors = [];
  
  // Check required fields
  const nameError = required(data.Product_Name, 'Product name');
  if (nameError) errors.push(nameError);
  
  const priceError = required(data.Price, 'Price');
  if (priceError) errors.push(priceError);
  
  const categoryError = required(data.Category_ID, 'Category');
  if (categoryError) errors.push(categoryError);
  
  // Check number validations
  if (data.Price !== undefined) {
    const priceNumError = isNumber(data.Price, 'Price');
    if (priceNumError) errors.push(priceNumError);
    
    const pricePositiveError = isPositive(data.Price, 'Price');
    if (pricePositiveError) errors.push(pricePositiveError);
  }
  
  if (data.Stock_Quantity !== undefined) {
    const stockNumError = isNumber(data.Stock_Quantity, 'Stock quantity');
    if (stockNumError) errors.push(stockNumError);
    
    const stockPositiveError = isPositive(data.Stock_Quantity, 'Stock quantity');
    if (stockPositiveError) errors.push(stockPositiveError);
  }
  
  return errors;
};

// Validate customer data
const validateCustomer = (data) => {
  const errors = [];
  
  const nameError = required(data.Name, 'Customer name');
  if (nameError) errors.push(nameError);
  
  if (data.Email && !isValidEmail(data.Email)) {
    errors.push('Invalid email format');
  }
  
  return errors;
};

// Validate user data
const validateUser = (data) => {
  const errors = [];
  
  const usernameError = required(data.username, 'Username');
  if (usernameError) errors.push(usernameError);
  
  const passwordError = required(data.password, 'Password');
  if (passwordError) errors.push(passwordError);
  
  const minLengthError = minLength(data.password, 6, 'Password');
  if (minLengthError) errors.push(minLengthError);
  
  return errors;
};

// Export all validation functions
module.exports = {
  required,
  isValidEmail,
  isPositive,
  isNumber,
  minLength,
  maxLength,
  validateProduct,
  validateCustomer,
  validateUser
};