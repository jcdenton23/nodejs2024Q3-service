# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```
# API Routes

## Users (/user)
- **GET /user**: Retrieve all users.  
  - **Response**: 200 with user records.
- **GET /user/{userId}**: Retrieve a single user by ID.  
  - **Responses**:
    - 200 with user record if found.
    - 400 if invalid ID.
    - 404 if user not found.
- **POST /user**: Create a new user.  
  - **Body**: `{ login: string; password: string }`
  - **Responses**:
    - 201 with new user record.
    - 400 if fields missing.
- **PUT /user/{userId}**: Update a user's password.  
  - **Body**: `{ oldPassword: string; newPassword: string }`
  - **Responses**:
    - 200 with updated record.
    - 400 if invalid ID.
    - 403 if old password incorrect.
    - 404 if user not found.
- **DELETE /user/{userId}**: Delete a user by ID.  
  - **Responses**:
    - 204 if successful.
    - 400 if invalid ID.
    - 404 if user not found.

## Tracks (/track)
- **GET /track**: Retrieve all tracks.  
  - **Response**: 200 with track records.
- **GET /track/{trackId}**: Retrieve a single track by ID.  
  - **Responses**:
    - 200 with track record if found.
    - 400 if invalid ID.
    - 404 if track not found.
- **POST /track**: Create a new track.  
  - **Response**: 201 with new track record.
  - **Response**: 400 if fields missing.
- **PUT /track/{trackId}**: Update track info.  
  - **Responses**:
    - 200 with updated record.
    - 400 if invalid ID.
    - 404 if track not found.
- **DELETE /track/{trackId}**: Delete a track by ID.  
  - **Responses**:
    - 204 if successful.
    - 400 if invalid ID.
    - 404 if track not found.

## Artists (/artist)
- **GET /artist**: Retrieve all artists.  
  - **Response**: 200 with artist records.
- **GET /artist/{artistId}**: Retrieve a single artist by ID.  
  - **Responses**:
    - 200 with artist record if found.
    - 400 if invalid ID.
    - 404 if artist not found.
- **POST /artist**: Create a new artist.  
  - **Response**: 201 with new artist record.
  - **Response**: 400 if fields missing.
- **PUT /artist/{artistId}**: Update artist info.  
  - **Responses**:
    - 200 with updated record.
    - 400 if invalid ID.
    - 404 if artist not found.
- **DELETE /artist/{artistId}**: Delete an artist by ID.  
  - **Responses**:
    - 204 if successful.
    - 400 if invalid ID.
    - 404 if artist not found.

## Albums (/album)
- **GET /album**: Retrieve all albums.  
  - **Response**: 200 with album records.
- **GET /album/{albumId}**: Retrieve a single album by ID.  
  - **Responses**:
    - 200 with album record if found.
    - 400 if invalid ID.
    - 404 if album not found.
- **POST /album**: Create a new album.  
  - **Response**: 201 with new album record.
  - **Response**: 400 if fields missing.
- **PUT /album/{albumId}**: Update album info.  
  - **Responses**:
    - 200 with updated record.
    - 400 if invalid ID.
    - 404 if album not found.
- **DELETE /album/{albumId}**: Delete an album by ID.  
  - **Responses**:
    - 204 if successful.
    - 400 if invalid ID.
    - 404 if album not found.

## Favorites (/favs)
- **GET /favs**: Retrieve all favorites, grouped by type (artists, albums, tracks).  
  - **Response**: 200 with `FavoritesResponse` object.

### Favorites by Type
- **POST /favs/track/{trackId}**: Add a track to favorites.  
  - **Responses**:
    - 201 if successful.
    - 400 if invalid ID.
    - 422 if track not found.
- **DELETE /favs/track/{trackId}**: Remove a track from favorites.  
  - **Responses**:
    - 204 if successful.
    - 400 if invalid ID.
    - 404 if track not in favorites.
- **POST /favs/album/{albumId}**: Add an album to favorites.  
  - **Responses**:
    - 201 if successful.
    - 400 if invalid ID.
    - 422 if album not found.
- **DELETE /favs/album/{albumId}**: Remove an album from favorites.  
  - **Responses**:
    - 204 if successful.
    - 400 if invalid ID.
    - 404 if album not in favorites.
- **POST /favs/artist/{artistId}**: Add an artist to favorites.  
  - **Responses**:
    - 201 if successful.
    - 400 if invalid ID.
    - 422 if artist not found.
- **DELETE /favs/artist/{artistId}**: Remove an artist from favorites.  
  - **Responses**:
    - 204 if successful.
    - 400 if invalid ID.
    - 404 if artist not in favorites.

