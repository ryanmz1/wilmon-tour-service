# Wilmon-Travel-Service by Serverless Framework

This serverless framework application serves for Wilmon Travel.

- [Wilmon Travel App](https://prod.d2fl6puxokt7iu.amplifyapp.com/)
- [Wilmon Travel Frontend Project](https://github.com/ryanmz1/wilmon-travel-frontend)

## Architecture

```
- resources
- statements
- src
  - handlers
    - autoGenerateTravels
    - createTravel
    - getTravels
  - lib
    - generateTravel
    - redisHelper

```

## Dependencies

```
auth0     ^3.5.0
aws-sdk   ^2.639.0
redis     ^4.0.0
```
