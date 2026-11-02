# TrackNest testing checklist

Manual checks to run before a release. Tick each box as you go.
Use the demo account (`demo@tracknest.dev` / `Demo1234!`, created by `npm run seed`) for everything that changes data, so real accounts are never touched.

## 0. Automated checks

- [ ] `cd client && npm run lint` finishes with no errors
- [ ] `cd client && npm run build` finishes with no errors
- [ ] Server starts with `cd server && npm start` and `GET /` returns `{"message":"TrackNest API is running"}`

## 1. Registration and login

- [ ] Register with an empty form: every field shows an error, no request is sent
- [ ] Register with an invalid email (`abc`): "Please enter a valid email"
- [ ] Register with a 5-character password: "at least 8 characters"
- [ ] Register with mismatching confirm password: "Passwords do not match"
- [ ] Register with an email that already exists: "Email is already registered"
- [ ] Register with valid data: you land on the dashboard
- [ ] Log in with a wrong password: "Invalid email or password"
- [ ] Log in with the demo account: dashboard shows 14 jobs
- [ ] The Log in button is disabled and shows a spinner while the request runs
- [ ] Visiting `/login` while logged in redirects to the dashboard
- [ ] Log out sends you to `/login`; going back does not show private data

## 2. Dashboard

- [ ] Summary cards show Total 14, Applied 4, Interview 3, Offer 1, Rejected 2 (demo account)
- [ ] Skeleton rows appear while the first page loads
- [ ] Search "stripe": only Stripe is listed; clearing the box lists everything again
- [ ] Search with `%` or `_` does not match everything
- [ ] Status filter "Interview": only interview jobs; the total in the footer updates
- [ ] Search with no matches shows "No matching jobs" and **Clear filters** resets it
- [ ] Each sort option reorders the table (company A-Z, deadline soonest, status order, newest/oldest)
- [ ] Jobs without a deadline are always at the end when sorting by deadline
- [ ] Per page 5: "Page 1 of 3"; Next/Previous work and are disabled at the ends
- [ ] Changing a filter, sort or page size goes back to page 1
- [ ] Deadlines within 7 days are amber, past deadlines on active jobs are red
- [ ] A new account with no jobs shows the "No applications yet" empty state

## 3. Add, edit, delete

- [ ] Add job with empty company/title: field errors, nothing saved
- [ ] Add job with URL `javascript:alert(1)` or `abc`: URL error
- [ ] Add job with only company + title: saved with status Saved
- [ ] Add job with every field filled: all values appear on the edit page afterwards
- [ ] The save button shows a spinner and is disabled while saving, Cancel is disabled too
- [ ] Edit a job, change the status: the badge and the dashboard cards update
- [ ] `/jobs/999999/edit` shows "Job not found" with a link back
- [ ] Delete opens the popup; Cancel (or clicking outside) closes it without deleting
- [ ] Confirm delete: the job disappears and the totals update
- [ ] Deleting the last job on the last page moves to the previous page

## 4. Statistics

- [ ] The Statistics chunk loads on demand (Network tab shows a `Statistics-*.js` file only when opening the page)
- [ ] Cards, pie chart (one slice per status with jobs) and bar chart (last 12 months) match the dashboard numbers
- [ ] A new account with no jobs shows the "No data yet" empty state

## 5. Profile

- [ ] Change the name: the "Welcome back" text in the top bar updates
- [ ] Change the email without a password: "Current password is incorrect"
- [ ] Change the password with a wrong current password: "Current password is incorrect"
- [ ] New password shorter than 8 characters or not matching its confirmation: error shown
- [ ] (Use a throwaway account for these, not the demo account) Password change succeeds and you can log in with the new password

## 6. Error handling

- [ ] Open `/this-page-does-not-exist` while logged in: styled 404 page, sidebar still visible
- [ ] In the browser console run `localStorage.setItem("token","bad")` and reload `/dashboard`: you are sent to `/login` with "Your session expired"
- [ ] Stop the server and reload the dashboard: "Can't reach the server" message with a **Try again** button; start the server and click it: data loads
- [ ] `GET /api/nothing` returns a JSON 404
- [ ] `POST /api/auth/login` with a broken JSON body returns 400, not 500
- [ ] Calling any `/api/jobs` route without a token returns 401

## 7. Security

- [ ] Log in as user A, copy a job id, log in as user B and open `/jobs/<id>/edit`: "Job not found"
- [ ] `DELETE /api/jobs/<A's job id>` with B's token returns 404 and the job still exists
- [ ] `sortBy=password` or `status=x` on `GET /api/jobs` returns 400
- [ ] No `.env` file is tracked by git (`git ls-files | findstr .env` only shows `.env.example` files)

## 8. Responsive layout

- [ ] Desktop (1366 px): sidebar on the left, table fits
- [ ] Tablet (800 px): sidebar is narrower, nothing overflows the page
- [ ] Phone (390 px): sidebar becomes a top bar with icons, cards are 2 per row, form fields stack, the table scrolls sideways inside its box
- [ ] Keyboard only: Tab reaches every link, button and field, and the focus ring is visible
