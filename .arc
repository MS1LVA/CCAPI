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

# @index
# users
#   userID *String

@aws
profile default
region us-east-1
  