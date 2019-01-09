# Sugoi Custom Portal

Full Stack Node.js / MongoDB application to keep track of custom orders and act as front-end portal for customer to view custom orders.

![Portal Tech](./imgs/portal_tech.png)

## Description

The Sugoi portal is a fully secured application that allows the Sugoi custom team to enter, edit and keep track of custom orders. The Art department will also use it to keep track of incoming orders to be worked on. Full visibility of orders and allowing customers to view their proofs in 3D are the main focus.

![Login](./imgs/portal_login.png)

The login screen which uses passport and express to authenticate users stored in the database, once authenticated, a session is created for the user and is logged into the main dashboard.

![Order View](./imgs/portal_progress.png)

Shows all orders in progress

![Completed Orders](./imgs/portal_completed.png)

Shows all orders that are completed

![Single Order View](./imgs/portal_order_view.png)

Can go into any order to view the result of the art teams work on the order if available

![3D view 1](./imgs/portal_order_3D_view.png)

3D of the garment

![3D view 2](./imgs/portal_order_3D_view2.png)

Another view of the garment

![Production Tab](./imgs/portal_production.png)

Once order is completed all production information can be seen here, shipping, delivery date etc...

![Payment View](./imgs/portal_payments.png)

This is where sales team enters any payments they have taken (soon to be connectd to Stripe API)

![Admin](./imgs/portal_user_management.png)

Admin section to govern users
