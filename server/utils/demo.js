// The shared demo account (created by `npm run seed`). Visitors log in with it to try the app,
// so its name, email and password are locked: otherwise one visitor could lock everyone else out.
const DEMO_EMAIL = "demo@tracknest.dev";

const DEMO_LOCKED_MESSAGE =
  "The demo account is read-only for profile and password changes. Create your own account to try this feature!";

const isDemoEmail = (email) => typeof email === "string" && email.trim().toLowerCase() === DEMO_EMAIL;

module.exports = { DEMO_EMAIL, DEMO_LOCKED_MESSAGE, isDemoEmail };
