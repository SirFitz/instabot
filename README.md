# Instabot

Instabot is a simple Instagram crawler that logs into your Instagram account with the provided details and follows an account, or fetches their profile along with their latest 12 posts.

  - Enter username and password in Dockerfile
  - Run the deploy script
  - Magic

# Features!

  - /follow - Endpoint that follows the account handle provided: eg.  /follow?handle=katyperry
  - /fetch - Endpoint that fetches the account handle provided: eg.  /fetch?handle=katyperry


Why?:
  - Instagram now requires you to login to view accounts
  - Useful for getting the account's ID to query afterwards
  - Nice and easy way to get the latest posts from an account, both private and public

### Docker
Instabot is very easy to install and deploy in a Docker container.

By default, the Docker will expose port 3006, so change this within the deploy.sh if necessary. When ready, simply run the script to deploy.

```sh
cd instabot
./deploy.sh
```
Verify the deployment by navigating to your server address in your preferred browser.

```sh
127.0.0.1:3006
```

License
----

MIT
