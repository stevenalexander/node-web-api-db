# Sample node solution with frontend/API

[![BuildStatus](https://travis-ci.org/stevenalexander/node-web-api-db.svg?branch=master)](https://travis-ci.org/stevenalexander/node-web-api-db?branch=master)

Simple solution with a node frontend talking to a node api connected to a DB run in containers

## Requires

* [docker](https://www.docker.com/)
  * [docker-compose](https://docs.docker.com/compose/)

## Run

```
docker-compose up
# may have issue with DB on first start due to node-api not waiting for DB to be available
```
