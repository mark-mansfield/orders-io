## Design Doc

## Project Name: Orders.io

## Author: Mark Mansfield

## Date : 13/3/2019

## Project Goals

Simple Crud application for managing food orders for a catering business

## Data Inputs



1. Admin Inputted Data
   1. additional annotations to order data inputted by admin staff
   2. Access to the following data fields by admin
      1. Contact Number
      2. pick up date
      3. pick up time
      4. Special Notes
      5. Order Items



### Data validation

1.  email field: native html5 validation or angular validator
2.  contact number field: min chars 10, max chars 10, or suitable is mobile number validator
3.  pick up date: no validation as option data comes from hard coded values in a select list
4.  pick up time: no validation as option data comes from hard coded values in a select list
5.  ordered items: no validation as product data comes from trusted data source
6.  Special Notes: xss validation protection / string validation

## Data outputs

JSON - backend / csv (printable)

### Tech Stack

Angular / node / express / mongo db

## Order Summary Layout

Data grid layout

1. Data Fields( order number / Customer name / Pickup Day / [action button delete ] / [action button view] ) one data item per line
2. Action buttons launch a modal dialog containing and order detail summary

## Order detail Summary / modal

The layout for the screen will be a single vertical column with an inner 2 column layout

1. The modal will have 2 states, summary mode and edit mode.
2. Summary mode: Edit button will launch edit mode. Order data will display is configured to list one label / value pair per line
3. Edit mode: 'Cancel' switches state to summary mode; 'Save' and 'Cancel' buttons are displayed if any input value is changed.
4. @toggleEditMode: Method toggles the modal states edit/summary
5. @saveOrder: Method sends data back to parent component
6. @Close: method send null back to the parent component

## Create run sheet - feature

The layout for creating a run sheet uses the mat-stepper component

1. Mat stepper config: 3 steps 'select pickup day' , 'review orders' , and 'build run sheet'
2. Step 1: Select pickup day: displays a list of options as radio buttons corresponding with the pick up days available for the order.
3. Step 2: Review orders: displays a list of all orders that contain the selected pickup day, sorted by pickup time earliest to latest. Action buttons launch a the order detail / summary modal dialog
4. Step 3: Build run sheet: takes all the order data and build it into a csv file for download.



## Use Cases

Customer has placed an order via an external system.
Admin user can perform crud operations into mongo db
Admin user can use the summaries features to generate different reports for the kitchen.

# Views

Order List - filter by date/ person ....

### Description

1. Send http get request containing the order object to getOrders api endpoint and return the resulting array of objects
2. Display a list of orders showing the order number, customer name , pickup day fields.



## RoadMap
2. Uploaded Order data containing the following items
   name:
   email address:
   contact number:
   pick up date:
   pick up time:
   order items:
   Special notes - for dietary concerns:
Uploaded order data will be in be converted from csv to json and stored.
Summary generated data for print will be in convert from json to csv format.
Summary data for screen will consume json data.
