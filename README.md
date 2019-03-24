# API

## Utilisation

  Pour lancer l'API et sa bdd.

  ```
  docker-compose up
  ```

  Pour préparer la bdd

  ```
  docker-compose run api npm run migrate
  ```


## Example

Pour obtenir les informations sur une game:

  ```
  curl \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{ "query": "{ game(id: \"ff36da80-b091-4439-883b-373dfce5808d\") { id, players {id} } }" }' \
  localhost:8081
  ```

