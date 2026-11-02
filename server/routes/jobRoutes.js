const express = require("express");
const {
  getJobs,
  getJobStats,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // every job route requires login

router.route("/").get(getJobs).post(createJob);
router.get("/stats", getJobStats); // must be before "/:id" or "stats" would be read as an id
router.route("/:id").get(getJob).put(updateJob).delete(deleteJob);

module.exports = router;