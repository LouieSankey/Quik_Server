
![quik-logo-small](https://user-images.githubusercontent.com/8163492/105931411-ffedb600-5fff-11eb-9011-b0c1250885df.png)

Quik - Dating and Connections.

Server built with Node.js Express, Socket.io, Knex, and Postgress.

Live App: https://quik.vercel.app/

Client Repo: https://github.com/LouieSankey/quik_dating

## Quik

TESTING NOTE: Quik is a real time connections app with a live chat feature. If you'd like to test the chat and connections you must log in with two users on two separte browsers (ie, Chrome and Safari) as Quik currently makes use of local storage in its authentication.



## Schema
```
User
{
    email: {
        type: String,
            required: true,
                unique: true
    }
     username: {
        type: String,
            required: true
          
    }
     birthday: {
        type: String,
            required: true
             
    }
     seeking: {
        type: String,
            required: true
              
    }
    password: {
        type: String,
            required: true
    }
}

Pin
{
    location_date_id: {
        type: String,
            required: true
    }
    pin_date: {
        type: String,
            required: true
    }
     location_id: {
        type: String,
            required: true
    }
      user_id: {
        type: Number,
            required: true
    }
      seeking: {
        type: String,
            required: true
    }
      user_name: {
        type: String,
            required: true
    }
      age: {
        type: String,
            required: true
    }
      bio: {
        type: String,
            required: true
    }
      photo_url: {
        type: String,
            required: true
    }
      likes_recieved: {
        type: Array,
            required: true
    }
     likes_sent: {
        type: Array,
            required: true
    }
     date_request_recieved: {
        type: Array,
            required: true
    }
    date_request_sent: {
        type: Array,
            required: true
    }
    date_location: {
        type: String,
            required: true
    }
    date_location_category: {
        type: String,
            required: true
    }
    
}

Message
{
    room_id: {
        type: text,
            required: true
    }
    username: {
        type: text,
            required: true
    }
    msg: {
        type: text,
            required: true
    }
   
 ```
 
  
## API OVERVIEW

 ```
 /user_route
├── /user
│   └── GET
│   └── POST
├── /email/:email
│   └── POST
├── /user_id
│   └── GET
│   └── DELETE
│   └── PATCH

/pins_route
├── /pin
│   └── POST
├── /user_id/:user_id
│   └── GET
├── /connections
│   └── POST
├── /matches/:location_date_id
│   └── POST
│   └── PATCH
├── /matches/request/:location_date_id')
│   └── PATCH


/chat_route
├── /room_id/:room_id
│   └── GET


```
## /user_route
## POST /user
 ```
// req.body
{
   username: String,
    email: String,
    birthday: String,
    password: String,
    seeking: String,
}

 ```

## /user_route
## GET /user
 ```
// res.body
[
  {
    id: Number,
    Nusername: String,
    email: String,
    birthday: String,
    password: String,
    seeking: String,
  }
]
 ```
## /user_route
## POST /user/email/:email
 ```
// req.body 
{
  email: String,
  password: String
}

//res.body
{
    id: Number,
    Nusername: String,
    email: String,
    birthday: String,
    seeking: String,
}
```

## /user_route
## GET /user_id
 ```
//res.body
{
  username: String,
  email: String
}
 ```
## /pins_route
## POST /pin
 ```
//res.body
{
   location_date_id: String, 
   pin_date: String,
   location_id: String, 
   user_id, Integer,
   seeking: String, 
   user_name: String, 
   age: String, 
   bio: String, 
   photo_url: String, 
   date_location: String, 
   date_location_category: String,
}
 ```
 
## /pins_route
## GET /user_id/:user_id'
 ```
//res.body
[
  {
   id: Number,
   location_date_id: String, 
   pin_date: String,
   location_id: String, 
   user_id, Integer,
   seeking: String, 
   user_name: String, 
   age: String, 
   bio: String, 
   likes_recieved: Array,
   likes_sent: Array,
   date_request_recieved: Array,
   date_request_sent: Array
   photo_url: String, 
   date_location: String, 
   date_location_category: String,
  }
]
 ```

## /pins_route
## POST /matches/:location_date_id
 ```
//res.body

{
  location_date_id: String,
  own_id Number, 
  others_id: Number
}
 ```
