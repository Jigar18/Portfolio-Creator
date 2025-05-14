- [ ] Add the "show more skills button" in the skills section.
- [ ] Add the option to remove the certifications on clicking the edit button
- [ ] Setup file upload of images on uploadThings for access of files on cloud.
- [ ] Setup database for data entry in it, So that it can be fetched and used at different places.
- [ ] To make the UI robust and flexible, set the size of the sections to be fixed and if there is any extra thing needs to be shown then for that an extra show more button can be added which will open a modal windows and show all the remaining items.
- [x] Save the installation id from webhook.ts for future usage.
- [x] If the user is not logged in then they should not be accessing some specific routes which start with user/:something
- [ ] Log out functionality (remove the token cookie).
- [ ] Add a relationship between the tables of user and their details and give the details table a primary key.


- [ ] create a database of skills, first check if the queried skill is there in the db and if it is not there then search to the api for the skill and after retrieval store it in the db.

## BUG - in the education and experiance section there comes a view more button when the length of them is more than two but it doesn't hide the remainig thigs after the two lengths and just there always

## BUG - User is able to access the api route

## BUG - format the things like name and job title in a order such that the first letter of the word is capital followed by small letters.

## UI Changes
- [ ] add a loading spinner or something like that, on the places where callback is called and redirecting to this and that page is shown