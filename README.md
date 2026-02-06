# eventbridge-scheduler

A service based on EventBridge's Scheduler.

Demonstrates interactions with EB Scheduler for a multi-tenant application.

# API

Create One-Time Schedule
Create Recurring Schedule

Fetch all my schedules
Fetch all my one-time schedules
Fetch all my recurring schedules

# Resources

Coner Murphy: [Scheduling Events in AWS with the EventBridge Scheduler and AWS CDK](https://conermurphy.com/blog/aws-eventbridge-scheduler-cdk/)
Pierre Chollet: [Learn serverless on AWS step-by-step - Schedule tasks with EventBridge Scheduler](https://dev.to/slsbytheodo/learn-serverless-on-aws-step-by-step-schedule-tasks-with-eventbridge-scheduler-4cbh)

# Notes

Early on in development, when using aws-sdk in an int test, I get an error from Jest saying, "TypeError: A dynamic import callback was invoked without --experimental-vm-modules." I added the following prefix to the `test:int` script:
`NODE_OPTIONS=\"$NODE_OPTIONS --experimental-vm-modules\"` and the error goes away. However, other projects have similar aws-sdk `int` tests and don't need this flag. Why?

After much digging, I found another project that adds `transformIgnorePatterns: ['/node_modules/?!uuid'],` to its `jest.config.js` file. If I add this here, that error drops away. I do not know why. I have other projects w/o that `transformIgnorePatterns` entry that use `ulid` without the error. Something is still wonky.

Answer to above question, the pattern is malformed. If I update the match to `node_modules/(?!(ulid))`, it does NOT fix the error. However, either leaving it empty (`node_modules/(?!())`) or putting in `@aws-sdk` (`node_modules/(?!(@aws-sdk))`) eliminates the error.

## Scheduler Sorting

AI claims that the `List` operation will return results sorted lexicographically by `Name`. I cannot find this in any of its sources, however. In practice, the results (for two items) seems indeterminate. Sometimes the names are sorted lexicographically. Sometimes not.
