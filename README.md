# Wilmon-Travel-Service by Serverless Framework

This serverless framework application serves for Wilmon Travel.

- [Wilmon Travel Demo](https://prod.d2fl6puxokt7iu.amplifyapp.com/)
- [Wilmon Notification Service](https://github.com/ryanmz1/wilmon-notification-service)
- [Wilmon Auth Service](https://github.com/ryanmz1/wilmon-auth-service)

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

![ArchitecturePic](https://public-bucket-ryan1329.s3.ap-northeast-2.amazonaws.com/wilmon/wilmontravel.drawio.png 'Wilmon Travel')

## Dependencies

```
auth0     ^3.5.0
aws-sdk   ^2.639.0
redis     ^4.0.0
```
