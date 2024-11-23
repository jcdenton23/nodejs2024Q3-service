# Home Library Service

## Prerequisites

Ensure you have the following installed before proceeding:

- [Git](https://git-scm.com/downloads): Version control system
- [Node.js](https://nodejs.org/): Includes npm (Node.js Package Manager)
- [Docker](https://www.docker.com/products/docker-desktop): Containerization platform
  
## Downloading

```
git clone https://github.com/jcdenton23/nodejs2024Q3-service.git
```
Switch to the dev-3 branch

```
git checkout dev-3
```

## Installing NPM modules

```
npm install
```

## Running application
Start:
```
npm run docker:dev:up
```
Stop and remove docker containers:
```
npm run docker:dev:down
```

## Testing

After application running open new terminal and enter:

To run all tests with auth

```
npm run test:auth
```


