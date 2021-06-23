# Assignment 7 Web Apps | SoSe 2021

## Business Description (7a)

A one-page description of the organization and its business activities.
An explanation of the purpose of the app, as well as a title and a domain name for the app.
A list of the information management tasks that the app should support (at least 10 and at most 20), each with a title and description.

### freeopengym.com

### WHO WE ARE
We are free open gym. We are phisically located in Berlin and we are a new start-up with focus on sports.

### MISSION
Our mission is to get people to teach or practice their favorite sport.

### VISION
Our vision is a world where people can stay fit, share knowledge about sports and get to know other people.

### SERVICES
we offer a free to use app which gives the possibility to search or create classes realated to sport activities, which are happening in real life potentially all around the world. Users can attend classes, lead them or both.
User: user or teacher
Event: something a teacher wants to teach. (e.g. "Yoga class with Lisa")
Classes: collection of meet-ups related to a certain event (e.g. "Every Wednesday at 14:00 at Muster Straße 1 Berlin)

Each teacher can have multiple events ("I teach yoga" "I teach football") and each event can have 1 or more classes. Users book classes.

### PERSONA
Max 20, new in Berlin, likes football but doesn't know anyone with whom he could play.
Lisa 25, Barcelona, wants to discover yoga and would like to take an introduction class for a cheap price.
Mario 50, Rome, old regional Champions of Bocce who wants to start teaching Bocce to younger people.

## APP REQUIREMENTS

### TITLE & DOMAIN
free open gym - freeopengym.com
### TECH STACK AND GENERAL REMARKS
The app will be a dynamic website, therefore a database and a login functionality will be needed. The allowed tech stack for this project should be containing the following techlogies:
- HTML5
- CSS3 
- Javascript
- implementation of google firebase services

<br>The website must pass the W3C Markup Validation Service and follow all the general rules and aspects of modern web design and javascript coding. Our app should render legibly and quickly at any screen resolution even on older devices.

### CONTENT
The only supported language for the app is English. The static content will be provided by us, users will be creating their own content according to the app model constraints.

### STRUCTURE
Layout should be structured in this way:
- Navbar with brand information and menu items. Should show all items on big screens and collapse to a hamburger menu style for small displays.
- Breadcrumb navigation path must be present on the page.
- Pages:
-- The home-page must contain a picture, a title, a subtitle and up to two different calls to actions above the fold. Below the fold a description of the app, mission/vision and some events as examples.
-- Search page must contain a search form.
-- Event list page should contain a list of classes according to user' search.
-- Event pages should contain information about the event and the related classes.
-- User pages should contain information about the user.
- FAQ section
- Footer contains links to events categories, mission/vision, logo and name and copyright notice.
- 
### UI & UX
Animation can be included if they improve the usability of the website guiding the user to the desidered section.
We need a font which is easy to understand among all the target groups. 
The colors provided are 4:
Dark text and elements: 231F20
Light text and elements: F9F9FF
Sections with darker background:  7EBDC2
Main call to actions: BB4430

### TASKS
User Features:
user id, username, password, date of birth, user type (teacher, not teacher), bio

Event Feature:
user id, event id, event name, categories, description

Class Features:
event id, time, location, spots available

User:
- create user
- modify user
- delete user
- read user


Event:
- create event
- modify event
- delete event
- read event

Class:
- create event
- modify event
- delete event
- read event

Interactions:
- user joins classes
- user un/follows other users

### Requirements
| original | elaborated/improvements |
| -------- | ----------------------- |
| Event: something a teacher wants to teach. (e.g. "Yoga class with Lisa") | Renaming **Event** to more intuitive **Course** |
|User | split into <ul><li>Participant (can join course, but not hold any)</li><li>Teacher (can hold a course, but not join any)</li> |
| User attributes | <ul><li>bio optional (user might not want to give additional information)</li><li>date of birth optional (user might not want to give this information)</li></ul>
