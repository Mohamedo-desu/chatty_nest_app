export const userPosts = [
  {
    id: "1",
    username: "emilyjones",
    displayName: "Emily Jones",
    avatar: "https://i.pravatar.cc/150?img=5",
    content:
      "Finally completed my marathon training! 🏃‍♀️ Feeling ready for race day! #MarathonLife",
    media: null,
    timestamp: "2025-01-19T08:00:00Z",
    views: 1050,
    comments: [
      {
        id: "c1",
        username: "runningenthusiast",
        displayName: "James Taylor",
        avatar: "https://i.pravatar.cc/150?img=15",
        content: "That's amazing! Best of luck on race day!",
        timestamp: "2025-01-19T08:15:00Z",
        replies: [
          {
            id: "r1",
            username: "fitnessguru",
            displayName: "Sarah Miller",
            avatar: "https://i.pravatar.cc/150?img=25",
            content: "Go, Emily! You're going to crush it! 💪",
            timestamp: "2025-01-19T08:20:00Z",
          },
        ],
      },
    ],
    shares: 35,
  },
  {
    id: "2",
    username: "johndoe",
    displayName: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=10",
    content: "Caught this stunning view during my morning hike 🌄.",
    media: "https://source.unsplash.com/random/800x600?nature",
    timestamp: "2025-01-18T07:45:00Z",
    views: 2200,
    comments: [
      {
        id: "c2",
        username: "naturelover",
        displayName: "Anna Wilson",
        avatar: "https://i.pravatar.cc/150?img=20",
        content: "Wow! Nature is truly breathtaking. Which trail is this?",
        timestamp: "2025-01-18T08:00:00Z",
        replies: [],
      },
    ],
    shares: 60,
  },
  {
    id: "3",
    username: "sophiamartin",
    displayName: "Sophia Martin",
    avatar: "https://i.pravatar.cc/150?img=30",
    content:
      "Delicious homemade pizza night 🍕! Here's my favorite recipe: https://bit.ly/homemade-pizza",
    media: "https://source.unsplash.com/random/800x600?pizza",
    timestamp: "2025-01-17T18:30:00Z",
    views: 1500,
    comments: [
      {
        id: "c3",
        username: "foodieadam",
        displayName: "Adam Brown",
        avatar: "https://i.pravatar.cc/150?img=35",
        content: "That looks so good! Definitely trying this recipe tonight.",
        timestamp: "2025-01-17T18:45:00Z",
        replies: [
          {
            id: "r2",
            username: "chefgrace",
            displayName: "Grace Kelly",
            avatar: "https://i.pravatar.cc/150?img=40",
            content: "A classic! Homemade pizza nights are the best.",
            timestamp: "2025-01-17T18:50:00Z",
          },
        ],
      },
    ],
    shares: 80,
  },
];
