from pytm import TM, Actor, Boundary, Process, Datastore, Dataflow

tm = TM("Data Flow Diagram for the Cantinas App")

# 1. External Entities
administrator = Actor("Administrator")
supplier = Actor("Supplier")
dietitian = Actor("Dietitian")

# 2. Trust Boundaries
users_web_boundary = Boundary("Users / Web Server Boundary")
web_db_boundary = Boundary("Web Server / Database Boundary")

# 3. Processes
cantinasApp_web = Process("Cantinas App", inBoundary=users_web_boundary)
cantinasApp_db = Process("CantinasApp Database", inBoundary=web_db_boundary)

# 4. Data Stores
web_pages = Datastore("Web Pages On Disk", inBoundary=users_web_boundary)
db_files = Datastore("Database Files", inBoundary=web_db_boundary)

# 5. Data Flows

# Flows between external entities and the Website
Dataflow(administrator, cantinasApp_web, "Requests")
Dataflow(cantinasApp_web, administrator, "Responses")

Dataflow(supplier, cantinasApp_web, "Requests")
Dataflow(cantinasApp_web, supplier, "Responses")

Dataflow(dietitian, cantinasApp_web, "Requests")
Dataflow(cantinasApp_web, dietitian, "Responses")

# Internal Web flow
Dataflow(web_pages, cantinasApp_web, "Pages")

# Flows crossing the Web Server / Database Boundary
Dataflow(cantinasApp_web, cantinasApp_db, "SQL Query Calls")
Dataflow(cantinasApp_db, cantinasApp_web, "Data")

# Internal Database flows
Dataflow(cantinasApp_db, db_files, "Data")
Dataflow(db_files, cantinasApp_db, "Data")

tm.process()