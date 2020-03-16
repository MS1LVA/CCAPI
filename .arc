@app
content-cyborg-api

@http
get /
post /users
post /login
post /analyze

@tables
users
  userID *String

@index
users
  email *String

@aws
profile default
region us-east-1
  