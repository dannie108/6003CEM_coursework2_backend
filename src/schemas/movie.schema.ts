export const movie = {

  
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "/movie",
  "title": "Movie",
  "description": "A movie record in the system",
  "type": "object",
  "properties": {
    "title": {
      "description": "Title of the movie",
      "type": "string"
    },
    "genre": {
      "description": "Genre of the movie",
      "type": "string"
    },
    "year": {
      "description": "Release year of the movie",
      "type": "integer",
      "minimum": 1900
    },
    "rating": {
      "description": "IMDb rating of the movie",
      "type": "number",
      "minimum": 0,
      "maximum": 10
    },
    "metascore": {
      "description": "Metascore rating of the movie",
      "type": "integer",
      "minimum": 0,
      "maximum": 100
    },
    "description": {
      "description": "Plot or summary of the movie",
      "type": "string"
    },
    "poster": {
      "description": "Poster image URL",
      "type": "string",
      "format": "uri"
    },
    "recommend_count": {
      "description": "Number of times the movie has been recommended",
      "type": "integer",
      "minimum": 0
    }
  },
  "required": ["title", "genre", "year", "rating"]
}



