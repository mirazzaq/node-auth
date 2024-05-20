### simple apis to use sequelize for authentication ###

POST https://node-auth-production-d86c.up.railway.app/api/sign-up
`
name:John  Doe
email:me2@mail.com
password:123456
`

`
{
    "message": "Registered successfully"
}

`

POST https://node-auth-production-d86c.up.railway.app/api/sign-in

`
email:me2@mail.com
password:123456
`

`
{
    "id": 1,
    "name": "john",
    "email": "me@mail.com",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzE2MTk5NjIzLCJleHAiOjM2MDAwMDAwMDAxNzE2MjAwMDAwfQ.x5UnA236mIkAkm3JbujTMi6kp-ez1QR11jDDpRmrDLE",
    "refreshToken": "4e833f24-0af8-4e8a-9a47-5e3d01c85e26"
}
`

GET https://node-auth-production-d86c.up.railway.app/api/profile

`
headers - Authorization Bearer {{token_from_login}}
`

`
{
    "id": 1,
    "name": "john",
    "email": "me@mail.com",
    "createdAt": "2024-05-20T10:02:34.000Z",
    "updatedAt": "2024-05-20T10:02:34.000Z"
}

`


/api/profile - secure endpoint