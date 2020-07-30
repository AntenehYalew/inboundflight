# Inbound FLight Operation Management

Inbound Management ops is an aviation related wep app that was built as a showcase by webscrapping information from multiple sources.

Here is the test product https://inboundflights.herokuapp.com/

Test User name :- tstkkxx
Test Password :- test@2020

## About

It is an idea resulted from some frustration of inefficiencies by colleagues in the aviation industry.

It collects live updates of selected flights landing in an airport in one click.

The idea is to help airport agents be able make an informed decision by providing all the needed information with just one click.

## How it works and background

Admin has access toa dd users.

Users will have access to determine, amend, add and delete which flights connecting their flight they would like to have live update landing in their airport.

Example. If a specific international flight has customers connecting at XXX airport from 15 different local flights, staffs are expected to keep track of every single 15 flights status. This basically means, 15 different clicks.

This web app avoids the redundancy and brings all into one click.

N.B:- If anyone needs access to see how it works, contact yalewantenehtadesse@gmail.com

## Technologies Used

Express, NodeJs (Node_modules) are the main languages of this project.
Dependencies include, bcrypt, cheerio, connect-flash, node-fetch, express-session, ejs and others

Database is purely MySQL.

Webscrapping methods were used to fetch data from flight radar.

Live update of flights from the fetched data is intergerated into the daily needed operational output for an airport environment.

## Development Setup

```
NPM i express mongoose ejs
const express         = require("express"),
       mysql          = require("mysql"),
     bodyParser       = require("body-parser"),
      session         = require("express-session"),
       flash         = require("connect-flash"),
      methodOverride = require("method-override");
const app = express();

```

Follow NPM installation to install all dependencies

## Author

- **Anteneh T Yalew**

## License

This project is a personal project and does not have a license
