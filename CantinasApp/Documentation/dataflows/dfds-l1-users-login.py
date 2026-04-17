from pytm import TM, Actor, Boundary, Process, Datastore, Dataflow

tm = TM("Cantina APP Login System")
tm.description = "Level 1 DFD showing Authentication Flow"

# 1. External Entity
user = Actor("Users")

# 2. Define Trust Boundaries
web_boundary = Boundary("User / Web Server Boundary")
db_boundary = Boundary("Web Server / Database Boundary")

# 3. Web Server Zone Components
web_servlet = Process("Cantina", inBoundary=web_boundary)
login_proc = Process("Login Process", inBoundary=web_boundary)
web_pages = Datastore("Web Pages", inBoundary=web_boundary)

# 4. Database Zone Components
# These are grouped together inside the second red line
cantinaapp_db = Process("College CantinaApp Database", inBoundary=db_boundary)
db_files = Datastore("Database Files", inBoundary=db_boundary)

# 5. Data Flows

# External to Web Server
Dataflow(user, web_servlet, "Login Request")
Dataflow(web_servlet, user, "Login Response")

# Web Server Internal
Dataflow(web_pages, web_servlet, "Pages")
Dataflow(web_servlet, login_proc, "AuthenticateUser()")
Dataflow(login_proc, web_servlet, "Authenticate User Result")

# Web Server to Database (Crossing the boundary)
Dataflow(login_proc, cantinaapp_db, "Authenticate User SQL Query")
Dataflow(cantinaapp_db, login_proc, "Authenticate User SQL Query Result")

# Database Internal
Dataflow(cantinaapp_db, db_files, "Data")
Dataflow(db_files, cantinaapp_db, "Data")

tm.process()