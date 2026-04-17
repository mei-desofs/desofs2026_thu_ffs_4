from pytm import TM, Actor, Boundary, Process, Datastore, Dataflow

tm = TM("Level 1 DFD: Supplier Application Process")
tm.description = "Fixed Level 1 DFD for Supplier Onboarding"

# 1. External Entities
applicant = Actor("Supplier")
admin = Actor("Network Manager")

# 2. Trust Boundaries
# Use simple names to avoid rendering errors
web_boundary = Boundary("Web Server Boundary")
storage_boundary = Boundary("Data Storage Boundary")

# 3. Processes
# Grouped into boundaries using inBoundary
app_logic = Process("Application Handling Logic", inBoundary=web_boundary)
file_manager = Process("File Upload Service", inBoundary=web_boundary)

# 4. Data Stores
# Removed parentheses and slashes from names
supplier_db = Datastore("SupplierDB", inBoundary=storage_boundary)
certificate_store = Datastore("FileStorage", inBoundary=storage_boundary)

# 5. Data Flows

# Application Submission
Dataflow(applicant, app_logic, "Submit Application Data")
Dataflow(applicant, file_manager, "Upload Certificates")

# Internal Storage Operations
Dataflow(app_logic, supplier_db, "Store Pending Profile")
Dataflow(file_manager, certificate_store, "Save Certificate Files")
Dataflow(file_manager, app_logic, "File Reference URI")
Dataflow(app_logic, supplier_db, "Update Certificate Link")

# Administrative Review
Dataflow(admin, app_logic, "View Pending Applications")
Dataflow(supplier_db, app_logic, "Fetch Supplier Records")
Dataflow(app_logic, admin, "Application Dashboard")

# 6. Process the Model
tm.process()