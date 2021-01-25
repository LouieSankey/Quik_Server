
function makeUsers() {
  return [
    {
      id: 1,
      username: 'username',
      email: 'test@email.com',
      password: 'password',
      birthday: '09-10-1984',
      seeking: 'women',
      date_published: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      username: 'username2',
      email: 'fsd2@fds.com',
      password: 'password',
      birthday: '09-10-1984',
      seeking: 'men',
      date_published: '2029-01-22T16:28:32.615Z',
    }
  ]
}


function makePins() {
  return [
    {
      id: 1,
      location_date_id: "date-unique-location-id",
      pin_date: "10-10-1010",
      location_id: "unique-location-id",
      user_id: 1,
      seeking: "women",
      user_name: "user1",
      age: "32",
      bio: "nothing",
      photo_url: "nothing",
      likes_recieved: [],
      likes_sent: [],
      date_request_recieved: [],
      date_request_sent: [],
      date_location: "name of venue",
      date_location_category: "category of venue",
      date_published: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      location_date_id: "date-unique-location-id-2",
      pin_date: "10-10-1010",
      location_id: "unique-location-id-2",
      user_id: 1,
      seeking: "women",
      user_name: "user2",
      age: "32",
      bio: "nothing",
      photo_url: "nothing",
      likes_recieved: [],
      likes_sent: [],
      date_request_recieved: [],
      date_request_sent: [],
      date_location: "name of venue",
      date_location_category: "category of venue",
      date_published: '2029-01-22T16:28:32.615Z',
    }, {
      id: 3,
      location_date_id: "date-unique-location-id",
      pin_date: "10-10-1010",
      location_id: "unique-location-id",
      user_id: 2,
      seeking: "women",
      user_name: "user1",
      age: "32",
      bio: "nothing",
      photo_url: "nothing",
      likes_recieved: [],
      likes_sent: [],
      date_request_recieved: [],
      date_request_sent: [],
      date_location: "name of venue",
      date_location_category: "category of venue",
      date_published: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      location_date_id: "date-unique-location-id-2",
      pin_date: "10-10-1010",
      location_id: "unique-location-id-2",
      user_id: 2,
      seeking: "women",
      user_name: "user2",
      age: "32",
      bio: "nothing",
      photo_url: "nothing",
      likes_recieved: ["1"],
      likes_sent: ["1"],
      date_request_recieved: [],
      date_request_sent: [],
      date_location: "name of venue",
      date_location_category: "category of venue",
      date_published: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 5,
      location_date_id: "date-unique-location-id",
      pin_date: "10-10-1010",
      location_id: "unique-location-id-2",
      user_id: 3,
      seeking: "women",
      user_name: "user3",
      age: "32",
      bio: "nothing",
      photo_url: "nothing",
      likes_recieved: [""],
      likes_sent: [""],
      date_request_recieved: [],
      date_request_sent: [],
      date_location: "name of venue",
      date_location_category: "category of venue",
      date_published: '2029-01-22T16:28:32.615Z',
    }


  ]

}

function makeChat() {
  return [
    {
    room_id: "1-2-date-unique-location-id",
    username: "user1",
    msg: "hello"
  },
  {
    room_id: "1-2-date-unique-location-id",
    username: "user2",
    msg: "hi how are you?"
  },
  {
    room_id: "1-2-date-unique-location-id",
    username: "user1",
    msg: "I'm fine, you?"
  }

  ]

}


module.exports = {
  makeUsers,
  makePins,
  makeChat
}
