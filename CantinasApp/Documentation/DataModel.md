# Data Model

## Entities

### User

- **Attributes:**
  - ID (PK)
  - UserName
  - Email
  - Password
  - Role (Supplier, NetworkManager, Nutritionist, Student)
  - Status (enabled, disabled)

### Supplier

- **Attributes:**
  - ID (PK)
  - Farmer id -- ?
  - Certification Status (compliant / not compliant)
  - Billing address
  - Phone (business)
  - Expected Products id (supplier can have multiple products)
  - Yearly Evaluations
  - Grade

### Application

- **Attributes:**
  - ID
  - Application date
  - Farmer ID -- ?
  - Products Proposed (mapper com Products ID / quantities / unit)
  - Status (submitted, under review, approved, rejected, cancelled)
  - Documents Submitted
  - Supplier Comment
  - Email (business)
  - Phone (business)
  - Evaluation Comment

### Menu

- **Attributes:**
  - ID (PK)
  - Initial Date
  - Final Date
  - Type of Menu (school menu, nursing home menu)
  - Meals ID
  - Status (active, inactive)

### Meal

- **Attributes:**
  - ID (PK)
  - Type of Meal (lunch or dinner)
  - Date
  - Menu ID (FK)
  - Dish ID (FK)

### Dish

- **Attributes:**
  - ID (PK)
  - Name
  - Type of Dish (meat, fish, vegetarian)
  - Description
  - Ingredients List
  - Preparation

### Ingredient

- **Attributes:**
  - ID (PK)
  - Product ID (FK)
  - Quantity
  - Unit

### Product

- **Attributes:**
  - ID (PK)
  - Name
  - Type of Product
  - Information (mapper com nutritional information / allergens)
  - Bio (true / false)

### ReservationPrevision

- **Attributes:**
  - ID (PK)
  - Meal ID (FK)
  - Number of Reservations

### OrderPlanning

- **Attributes:**
  - ID (PK)
  - Products List (mapper com Products ID / quantities / unit)

### Reservation

- **Attributes:**
  - ID (PK)
  - Status (active, pending, cancelled)
  - Reservation Date
  - Quantity
  - Meal ID (FK)
  - Price
  - Price category (student, guest, staff, subsidied)
  - User ID (FK)
  - Penalty
  - Payment ID (FK)
