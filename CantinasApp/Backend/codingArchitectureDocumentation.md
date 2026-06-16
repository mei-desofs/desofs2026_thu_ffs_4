# Coding Architecture Documentation

## Risk-Based Remediation Time Frames

- Critical vulnerabilities in third-party components must be remediated immediately or within 24 hours of detection.
- High-risk vulnerabilities should be remediated within 7 days.
- Medium-risk vulnerabilities should be remediated within 30 days.
- Low-risk vulnerabilities should be reviewed and remediated within 6 months.
- Library upgrades should be tracked every day and scheduled to upgrade at least within 30 days.

## Resource-Demanding Functionality

- Create and update applications, if the user is handling a lot of files. To prevent this we added a file limit and size limit.
- Get Waste Percentage, can take a lot of time if there is a lot of data
- Get canteen statistics, can be a problem because of the filter functionality.

## Dangerous Functionality

- Uploading of files for the application
- Forgot password and reset password functionalities (Confidentiality Concern)