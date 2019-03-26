# Sugoi Portal
### *Sugoi Custom order entry and order tracking web application*

---
## What's used:
* Node.JS / Express backend
* MVC Views (Handlebars) & API
* Mongo DB Database / Mongoose
* Vuex-Vue.js frontend (order confirmation)
* Docker containers for backend / frontend deployment on LG servers
* Passport.js / cookie-session authentication
* SSL certificates
* Datatables plugin
* SheetJS - Excel creation plugin
* Filesaver.js to save files directly on client
* Materialize CSS (MVC)
* Bootstrap CSS (Vuex frontend)
* WebGL - 3D OBJ Viewer on HTML5 Canvas
* CORS
* Helmet
* FedEx API
* Cron - to update FedEx info every few hours
* bcryptjs - hashing stored passwords in db
* moment - date/time manipulation package
* dayjs - date/time manipulation package

## URLs
    Production - https://portal.sugoi.com
    Staging - https://portal.stage.sugoi.com
    Dev - https://localhost:5000

# Backend Routes
## Node.js / Express - MVC

### *`/*` - secured - must be authenticated*
* this route fowards all incoming requests not found in routes below to `Vue.js` frontend order confirmation
### *`/orders` - All routes secured - must be authenticated*
* `GET /`  - fetches all from `orders` collection and displays in `index.handlebars` table.
* `GET /initial` - fetches all from `orders` collection in `Initial` status and displays in `orders/index.handlebars` table.
* `GET /completed` - fetches all from `orders` collection in `Sent to Vendor` status and displays in `orders/notinprogress.handlebars` table.
* `GET /cancelled` - fetches all from `orders` collection in `Cancelled` status and displays in `orders/notinprogress.handlebars` table.
* `GET /archived` - fetches all from `orders` collection in `Archived` status and displays in `orders/notinprogress.handlebars` table.
* `GET /po/:#######` - fetches order from `orders` collection based on order number and displays a table that can be downloaded to Excel. Used to create PO for vendor.
* `GET /xml/:#######` - fetches order from `orders` collection based on order number and responds with `raw xml data` converted from json.
* `GET /add` - displays form for user to input new order into the system.
* `POST /add` - takes form request data and is saved to `orders` collection in database. Redirects to `orders/initial`
* `GET /view/:##` - fetches order from `orders` collection based on `_id` from order and displays in `orders/view.handlebars`
* `GET /edit/:##` - fetches order from `orders` collection based on `_id` from order and displays in form `orders/edit.handlebars` waiting for user input.
* `PUT /edit/:##` - takes data from `orders/edit.handlebars` form and validates entry. Based on status of order, calculations are done and order is updated and saved to `orders` collection in database.  Redirects to `/orders`.
* `GET /node-edit/:##` - fetches `instruction` item from `instructions Array` inside the `orders` collection and displays data in form `node-edit.handlebars`
* `PUT /node-edit/:##` - fetches `instruction` item from `instructions Array` inside the `orders` collection and updates the data based on form data.
* `PUT /revision/:##` - fetches `instruction` item from `instructions Array` inside the `orders` collection and updates the data based on form data.
* `PUT /notes/:##` - takes data from notes.handlebars and validates entry. Order is updated and saved to `instructions Array` inside `orders` collection.

### *`/payments` - All routes secured - must be authenticated and edit orders*
* `GET /`  - fetches all from `orders` collection and displays in `payments/index.handlebars` table.
* `GET /edit/:##`  - fetches order from `orders` collection based on `_id` from order and displays form in `payments/edit.handlebars`
* `GET /edit/:##`  - takes request data from form `payments/edit.handlebars`, updates and saves data to `orders` collection.

### *`/prod` - All routes secured - must be authenticated and edit prod*
* `GET /ccn`  - fetches all from `orders` collection in `Sent to Vendor` status and displays in `orders/ccnview.handlebars` table.
* `GET /open`  - fetches all from `orders` collection in `Sent to Vendor` status and `not shipped` and displays in `orders/prod.handlebars` table.
* `GET /pending`  - fetches all from `orders` collection in `Sent to Vendor` status and `shipped` and displays in `orders/prod.handlebars` table.
* `GET /cancelled`  - fetches all from `orders` collection in `CANCELLED` status and displays in `orders/prod.handlebars` table.
* `GET /edit/:##`  - fetches order from `orders` collection and displays in a form in `orders/prod-edit.handlebars`
* `PUT /edit/:##`  - takes request data from form `orders/prod-edit.handlebars`, updates and saves data to `orders` collection.

### *`/proofs` - All routes secured - must be authenticated*
* `GET /uploadform`  - *currently unavailable - coming in future build*.
* `POST /uploadform`  - *currently unavailable - coming in future build*.
* `GET /:##`  - fetches single proof from `proofs` collection and then displays in `proofs/view.handlebars`
* `GET /qc/:#######`  - fetches single proof from `proofs` collection and then displays in `proofs/qc.handlebars`
* `GET /qc/edit/:##`  - fetches single proof from `proofs` collection and then displays form in `proofs/qc-edit.handlebars`
* `PUT /qc/edit/:##`  - takes request data from form `proofs/qc-edit.handlebars`, updates and saves data to `proofs` collection.
* `GET /qc/archive/:##`  - fetches single proof from `proofs` collection and sets qc notes to `Archived` status, redirects to `/proofs/qc/:#######`
* `GET /qc/archive/view/:##`  - fetches single proof from `proofs` collection and sets qc notes to `Archived` status, redirects to `/proofs/qc-archive`

### *`/reports` - All routes secured - must be authenticated and admin*
* `GET /`  - fetches all reports `reports` collection using current week and displays in `reports/index.handlebars`.
* `GET /week/:weekNum` - fetches report from `reports` collection based on the week number desired and displays data in `reports/index.handlebars`

### *`/styles` - currently unavailable, moved to API routes*

### *`/users`- All routes secured - must be authenticated and admin*
* `GET /login`  - displays a form in `users/login.handlebars`
* `POST /login`  - takes request data from `users/login.handlebars` form and authenticates user using Passport.js. If authenticated a cookie-session is created through https and a secret key which expires after 8 hours.
* `GET /login/:userName/:key`  - displays a form in `users/login.handlebars` using pre-existing login information passed in url paramaters.
* `GET /admin` - displays `users/admin.handlebars` dashboard page.
* `GET /edit/:##` - displays form in`users/edit.handlebars`
* `PUT /edit/:##` - takes request data from `users/edit.handlebars` form and updates user information
* `GET /delete/:##` - deletes user from `users` collection in the database
* `GET /register` - displays form in `users/register.handlebars` to register a new user
* `POST /register` - takes request data from `users/register.handlebars` form and adds new user to `users` collection in database, hashing password using bcrypt for safety
* `GET /password` - displays form in `users/password.handlebars` form.
* `PUT /password` - takes request data from `users/password.handlebars` form and updates user password with hashed requested password.

---
## API - request routes (Vuex Order Confirmation routes):

### *`/api/graphicCodes` - Open route*
* `GET /`  - fetches all from `graphicCodes` collection and responds with an array of json formatted data and puts into Vuex state.

### *`/api/provTax` - Open route*
* `GET /`  - fetches all from `provs` collection and responds with an array of json formatted data and puts into Vuex state.

### *`/api/reps` - Open route*
* `GET /`  - fetches all from `reps` collection and responds with an array of json formatted data and puts into Vuex state.

### *`/api/states` - Open route*
* `GET /`  - fetches all from `states` collection and responds with an array of json formatted data and puts into Vuex state.

### *`/api/styles` - Open route*
* `GET /`  - fetches all from `styles2019` collection and responds with an array of json formatted data and puts into Vuex state.

### *`/api/orders` - All routes secured - must be authenticated*
* `GET /`  - fetches all orders from `orders` collection and responds with an array of json formatted data and puts into Vuex state.
* `GET /:#######`  - fetches single order from `orders` collection based on order number passed in url paramaters and responds with json formatted data and puts into Vuex state.
* `PUT /:#######/:##` - fetches single order from `orders` collection based on order number passed in url paramaters and pushes line into `orderLines Array`, responds with json formatted data.
* `PUT /:#######/:##/:##` - fetches single order from `orders` collection based on order number passed in url paramaters and pushes item into `items Array` responds with json formatted data.
* `PUT /:#######` - fetches single order from `orders` collection based on order number passed in url paramaters and updates entire order based on Vuex state, responds with json formatted data and updates Vuex state.

# Front-End Routes
## Vue.js / Vuex / Vue-Router

* *`/Home` - secured - must be authenticated*
    * displays the `header` component
    * displays the `orderDetails` component
    * displays the `orderLines` component
        * displays the `orderLines/items` component

* *`/EditDetails` - secured - must be authenticated*
    * allows user to edit all the details of the order
    * automatically updates and saves to state and updates the database once commited

* *`/EditLine` - secured - must be authenticated*
    * allows user to edit each line level details of the order individually
    * automatically updates and saves to state and updates the database once commited

* *`/EditItem` - secured - must be authenticated*
    * allows user to edit each item level details of the order individually
    * automatically updates and saves to state and updates the database once commited

*All changes made on order confirmation update the PO, XML file and order routes on the Backend.*

