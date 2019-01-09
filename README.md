# Sugoi Custom Portal

Full Stack Node.js / MongoDB application to keep track of custom orders and act as front-end portal for customer to view custom orders.

![Portal Tech](./imgs/portal_tech.png)

## Description

The Sugoi portal is a fully secured application that allows the Sugoi custom team to enter, edit and keep track of custom orders. The Art department will also use it to keep track of incoming orders to be worked on. Full visibility of orders and allowing customers to view their proofs in 3D are the main focus.

The login screen which uses passport and express to authenticate users stored in the database, once authenticated, a session is created for the user and is logged into the main dashboard.
![Login](./imgs/portal_login.png)

Shows all orders in progress
![Order View](./imgs/portal_progress.png)

Shows all orders that are completed
![Completed Orders](./imgs/portal_completed.png)

Can go into any order to view the result of the art teams work on the order if available
![Single Order View](./imgs/portal_order_view.png)

3D of the garment
![3D view 1](./imgs/portal_order_3D_view.png)

Another view of the garment
![3D view 2](./imgs/portal_order_3D_view2.png)

Once order is completed all production information can be seen here, shipping, delivery date etc...
![Production Tab](./imgs/portal_production.png)

This is where sales team enters any payments they have taken (soon to be connectd to Stripe API)
![Payment View](./imgs/portal_payments.png)

Admin section to govern users
![Admin](./imgs/portal_user_management.png)
