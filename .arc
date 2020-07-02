@app
content-cyborg-api

@http
get /
post /users
post /login
post /analyze

@tables
users
  email *String


events
  identifier *String

@events
user-signup

@aws
profile default
region us-east-1
  