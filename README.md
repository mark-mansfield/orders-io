## Design Doc

## Project Name: Catering Manager

## Author: Mark Mansfield

## Date : 13/3/2019

## Project Goals

The overall goal of this project is to enable the transformation of
saved order data, taken through a web interface, into printable reports that are to be used by the kitchen team
when prepping food for customers.

## Data Inputs

1. Uploaded Order data containing the following items
   name:
   email address:
   contact number:
   pick up date:
   pick up time:
   order items:
   Special notes - for dietary concerns:

2. Admin Inputted Data
   1. additional annotations to order data inputted by admin staff
   2. Access to the following data fields by admin
      1. Contact Number
      2. pick up date
      3. pick up time
      4. Special Notes
      5. Order Items

Uploaded order data will be in be converted from csv to json and stored.
Summary generated data for print will be in convert from json to csv format.
Summary data for screen will consume json data.

### Data validation

1.  email field: native html5 validation or angular validator
2.  contact number field: min chars 10, max chars 10, or suitable is mobile number validator
3.  pick up date: no validation as option data comes from hard coded values in a select list
4.  pick up time: no validation as option data comes from hard coded values in a select list
5.  ordered items: no validation as product data comes from trusted data source
6.  Special Notes: xss validation protection / string validation

## Data outputs

1. Order Summary data will be formatted to a specific csv format out lined in the section 'Order Summary Layout'
2. Daily Orders Summary data will be formatted using a row column based layout with one row representing an order contain all the relevant fields as specified by the section "Daily Orders Summary Layout".
3. Order data updated by admin will be saved as json

### Tech Stack

Angular / node / express / mongo db

## Order Summary Layout

The layout for screen will be a single vertical column layout listing.

1. Customer data in an easy to read format of ( order number / Customer name / Pickup Day / [action button delete ] / [action button view] ) one data item per line
2. Action buttons launch a modal dialog containing and order detail summary

## Order detail Summary / modal

The layout for the screen will be a single vertical column with an inner 2 column layout

1. The modal will have 2 states, summary mode and edit mode.
2. Summary mode: Edit button will launch edit mode. Order data will display is configured to list one label / value pair per line
3. Edit mode: 'Cancel' switches state to summary mode; 'Save' and 'Cancel' buttons are displayed if any input value is changed.
4. @toggleEditMode: Method toggles the modal states edit/summary
5. @saveOrder: Method sends data back to parent component
6. @Close: method send null back to the parent component

## Create run sheet layout

The layout for creating a run sheet uses the mat-stepper component

1. Mat stepper config: 3 steps 'select pickup day' , 'review orders' , and 'build run sheet'
2. Step 1: Select pickup day: displays a list of options as radio buttons corresponding with the pick up days available for the order.
3. Step 2: Review orders: displays a list of all orders that contain the selected pickup day, sorted by pickup time earliest to latest. Action buttons launch a the order detail / summary modal dialog
4. Step 3: Build run sheet: takes all the order data and build it into a csv file for download.

## Architecture

Auth Server and Data will be on the same server initially. If the project needs to scale then look at breaking these items out into different servers.

## Replication

A replication server will be set to be used as a fall back.

## Use Cases

Customer has placed an order via an external system.
Admin user uploads the csv file containing order data in the system.
The admin can then edit order info and then use the Summaries features to generate different reports for the kitchen.

# Views

Order List

### Description

1. Send http get request containing the order object to getOrders api endpoint and return the resulting array of objects
2. Display a list of orders showing the order number, customer name , pickup day fields.

### User interactions

#### Create run sheet

Takes all the orders and combines them into a single object, convert this to csv file , download file.

## Design Doc

## Project Name: Catering Manager

## Author: Mark Mansfield

## Date : 13/3/2019

## Project Goals

The overall goal of this project is to enable the transformation of
saved order data, taken through a web interface, into printable reports that are to be used by the kitchen team
when prepping food for customers.

## Data Inputs

1. Uploaded Order data containing the following items
   name:
   email address:
   contact number:
   pick up date:
   pick up time:
   order items:
   Special notes - for dietary concerns:

2. Admin Inputted Data
   1. additional annotations to order data inputted by admin staff
   2. Access to the following data fields by admin
      1. Contact Number
      2. pick up date
      3. pick up time
      4. Special Notes
      5. Order Items

Uploaded order data will be in be converted from csv to json and stored.
Summary generated data for print will be in convert from json to csv format.
Summary data for screen will consume json data.

### Data validation

1.  email field: native html5 validation or angular validator
2.  contact number field: min chars 10, max chars 10, or suitable is mobile number validator
3.  pick up date: no validation as option data comes from hard coded values in a select list
4.  pick up time: no validation as option data comes from hard coded values in a select list
5.  ordered items: no validation as product data comes from trusted data source
6.  Special Notes: xss validation protection / string validation

## Data outputs

1. Order Summary data will be formatted to a specific csv format out lined in the section 'Order Summary Layout'
2. Daily Orders Summary data will be formatted using a row column based layout with one row representing an order contain all the relevant fields as specified by the section "Daily Orders Summary Layout".
3. Order data updated by admin will be saved as json

### Tech Stack

Angular / node / express / mongo db

## Order Summary Layout

The layout for screen and print will be a single vertical column layout listing.

1. Customer data in an easy to read format of ( data label / data value ) one data item per line
2. Ordered products will have an a layout of( item label / qty / price) one product per line
3. Special Notes will be displayed as readable text with a 50 char limit per line in paragraph form.

## Daily Orders Summary Layout

The layout for screen and print will be a table based layout with header row labels.
Each row appearing in the table will represent a single customer order.
The label configuration will contain all customer fields and all product labels taken from the collection of products being sold i.e. the "Menu"

Orientation will need to be set to <b>landscape</b>
label lengths will need to be set to a <b>maximum set of characters</b>to avoid breaking the layout.

## Architecture

Auth Server and Data will be on the same server initially. If the project needs to scale then look at breaking these items out into different servers.

## Replication

A replication server will be set to be used as a fall back.

## Use Cases

Customer has placed an order via an external system.
Admin user uploads the csv file containing order data in the system.
The admin can then edit order info and then use the Summaries features to generate different reports for the kitchen.

<hr>

# Views

# Order List

### Description

1. Send http get request containing the order object to getOrders api endpoint and return the resulting array of objects
2. Display a list of orders showing the order number, customer name , pickup day fields.

### User interactions

#### Create run sheet

Takes all the orders and combines them into a single object, convert this to csv file , download file.

#### View order

display individual order for review / edit.

<hr>

# import order

## Description

1. Select csv file from local filesystem check mime type
2. Then http post to backend importOrder api end point
   ( converts to json and returns the result )
3. Then send http post to createOrder api endpoint
   ( saves order to mongo db 'orders' collection )

### User interactions

Use html file selector to locate file to upload.

<hr>

#### View order

display individual order for review / edit.
