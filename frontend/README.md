# Frontend

## Find it online
Just want to play around with Rholang? Simply go to [rchain.cloud](http://rchain.cloud/).

## Running it locally
If you want to help develop rchain.cloud, or run your own instance, follow these instructions:
1. Ensure [Docker](https://www.docker.com/) and [Docker-compose](https://docs.docker.com/compose/) are installed
2. Clone the Github repo to your desired location using `git clone https://github.com/th3build/rchain.cloud`.
3. Run development enviroment locally using one of two options:
- sh setup_locally.sh
or
- docker network create rchain-cloud
- docker-compose -f docker-compose-dev.yml build
- docker-compose -f docker-compose-dev.yml up -d

First option requires bash shell (MacOs and Linux distributions both have it),
Second option works on all systems.