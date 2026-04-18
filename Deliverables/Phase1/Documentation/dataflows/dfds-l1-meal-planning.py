from pytm import TM, Actor, Boundary, Process, Datastore, Dataflow

tm = TM("Level 1 DFD: Meal Planning & Menu Publishing")
tm.description = "Complexity justification: Data flows from three Datastores before a main Process can proceed."

# 1. External Entity
# The primary user (Dietitian) who is making the plans.
dietitian = Actor("Dietitian")

# 2. Trust Boundaries
web_boundary = Boundary("Web Zone (API Server)")
storage_boundary = Boundary("Data Zone (Backend Storage)")

# 3. Processes (Decomposed logic)
# A helper process to aggregate data from last week and inventory
# US8: Monitoring/Metrics, US10: Integration with inventory
data_analyser = Process("Planning Data Monitor", inBoundary=web_boundary)
# The main UI/Logic the Dietitian uses
# US3: Meal Plan Core Function
meal_planner = Process("Meal Planning Logic", inBoundary=web_boundary)

# 4. Data Stores
# These now sit inside the storage_boundary to show they are protected
inventory_db = Datastore("Stock DB", inBoundary=storage_boundary)
reservation_db = Datastore("Reservations DB", inBoundary=storage_boundary)
meal_db = Datastore("Meal Database", inBoundary=storage_boundary)

# 5. Data Flows

# --- The Initial Research Flow (Analysing 'How many people' and 'What produce') ---
# 1. Dietitian requests planning data
Dataflow(dietitian, data_analyser, "Request Weekly Data")
# 2. Analyser queries Inventory (US10)
Dataflow(inventory_db, data_analyser, "Query Current Stock")
# 3. Analyser queries Reservations (U12)
Dataflow(reservation_db, data_analyser, "Select Last Weeks Consumption")
# 4. Analyser aggregates data and sends to Planner
Dataflow(data_analyser, meal_planner, "Planning Data (Reservation History and Stock)")

# --- The Meal Creation Flow ---
# 5. Dietitian provides the actual meal details (Recipes, ingredients)
Dataflow(dietitian, meal_planner, "Submit New Meal Details")
# 6. Planner creates and saves new meals (US3)
Dataflow(meal_planner, meal_db, "Insert New Meal Records")

# --- The Menu Publishing Flow (US3) ---
# 7. Dietitian confirms the final list for the week
Dataflow(dietitian, meal_planner, "Publish Menu")

# 9. Final Response to user
Dataflow(meal_planner, dietitian, "Menu Published Confirmation")

# Process the model
tm.process()