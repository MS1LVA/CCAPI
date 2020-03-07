@app
content-cyborg-api

@http
get /

@tables
users
  userID *String

@index
users
  email *String

@aws
profile default
region us-east-1
  