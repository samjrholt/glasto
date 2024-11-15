# Running the website
This project is a test website designed to mimic the behavior of the Glastonbury Tickets website, with a simple flow from the landing page to a success page, including a queue and cookie-based session handling.

## Running the website
To run the website locally, use the following command:
```python
python -m http.server 8000 
```
This will start the server, which can be accessed in your browser at:
```
http://localhost:8000/
```
It is recommended to use an incognito/private browsing window since the site uses cookies. Alternatively, ensure that cookies are cleared between tests to avoid any session conflicts.

## Website Flow
- **Landing Page (index.htm):** The initial page you visit, which redirects after 1 second to the next page.

- **Coaches Page (coaches.html):** Here, you can select either "Wednesday" or "Thursday" as your travel option. Clicking either button will take you to the queue page.

- **Queue Page (queue.html):** The queue page automatically refreshes every 15 seconds, similar to the real ticketing site. A refresh counter tracks the number of refreshes. After 3 refreshes, the page will automatically redirect to the details page. (Note: In the real website, there is no fixed time to leave the queue, but for testing purposes, this behavior is simulated.)

- **Details Page (details.html):** This page allows you to enter any required details, simulating a typical form submission flow.

- **Success Page (success.html):** Once you submit your details, you will be redirected to the success page.

