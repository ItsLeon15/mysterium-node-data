# Mysterium Node Data
This project is a simple web application that displays data for Mysterium network nodes.
It allows users to search and sort the data by various fields, such as City, Region, Country, Continent, ASN, ISP, and IP Type.
The data is pulled directly from the Mysterium Discovery API (proxied) and displayed in a paginated table format.

## Installation
To install the project, follow these steps:

1. Clone the repository to your local machine.
2. Open a terminal window and navigate to the project directory.
3. Run `npm install` to install the project dependencies.
4. Run `npm start` to start the server.
5. Open a web browser and navigate to http://localhost:3000 to view the app.

## Updates

|  Date Changed (dd/MM/yyyy)   | Content Changed |
| ---------------------------- | --------------- |
|        **05/05/2023**        | - Reformated the code into different files to improve readability <br> - Added Filtered Dropdown boxes |

## Usage
Once you have the app running, you can use the search bar at the top of the page to search for specific nodes. You can also click on any of the table headers to sort the data by that column.

The table is paginated, with 50 nodes displayed per page. You can navigate between pages using the page buttons at the bottom of the table.

## Technologies
This project was built using the following technologies:

- React
- Prop Types
- Font Awesome

This project no longer uses node.js due to complications in rendering data.

## Data Source
The data used in this project was provided by Mysterium Network which can be found [here](https://discovery.mysterium.network/api/v3/proposals). The data includes information on Mysterium nodes, such as their location, ISP, ASN, and IP type. All data, at the time of this project, was released publicly.

## Contributing and Feature Requests
If you want to contribute to this project or have a feature request, please feel free to submit a pull request or open an issue. Any contributions or feedback are greatly appreciated!
