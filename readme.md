# STEPS : 

Add the client ID, client Secret and redirect urls in .env files and slackconfig.js
Also replace the local server uri with your server uri wherever necessary. 

Frontend : 

```
cd frontend
npm install
npm start
```

Backend :

```
cd NICE_UCAAS
npm install
npm start
```

DynamoDB (local) :

```
cd dynamodb (local)
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

