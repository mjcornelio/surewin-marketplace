
# R&A Surewin Marketplace Backend
This project is a backend application that provides an API for a surewin marketplace property rental management system.


## Installation

Clone the repository
```bash
  git clone https://github.com/mjcornelio/surewin-marketplace.git
```
Install dependencies: 

```bash
  cd surewin-backend
  npm install
```
## Usage/Examples

To start the server, run npm start. The server will listen on port 5000 by default. To change the port number, set the PORT environment variable before starting the server.

```bash
  npm start
```
for development
```bash
  npm run dev 
```

The API provides the following endpoints:
```bash
- POST /login
- POST /forgotPassword
- POST /resetPassword
- POST /register
- POST /login
- GET /tenants
- POST /tenants/add
- GET /archived
- GET /tenants/:id
- PATCH /tenants/edit/:id
- DELETE /tenants/delete/:id
- DELETE /tenants/permanentdelete/:id
- PATCH /lease/edit/:id
- PATCH /lease/end/:id
- PATCH /bill/electricity
- PATCH /bill/water
- POST /upload/:type
- GET /property-units
- POST /property-units/add"
- PATCH /property-units/update/:id
- GET /property-units/:id
- DELETE /property-units/delete/:id
- GET /transactions
- POST /transactions/add
- GET /transactions/:id
- GET /invoices
- POST /invoices/add
- GET /invoices/:id
- GET /parking_collections
- POST /parking_collections/add
- GET /utility
- PATCH /utility
- GET /users
- POST /users/add
- GET /users/:id
- PATCH /users/edit/:id
- DELETE /users/delete/:id
- PATCH /change-password/:id
```
## Technologies Used
- Node.js
- Express.js
- Sequelize.js
- JSON Web Tokens


