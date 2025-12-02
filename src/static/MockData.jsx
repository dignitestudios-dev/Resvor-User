import { flyer, loungeImg, flyerThree, flyerTwo } from "../assets/export";

export const flyerData = [
  { id: 1, name: "Summer Sale Flyer", image: flyer },
  { id: 2, name: "New Arrivals Flyer", image: flyerThree },
  { id: 3, name: "Holiday Deals Flyer", image: flyerTwo },
  { id: 4, name: "Back to School Flyer", image: flyer },
  { id: 5, name: "Black Friday Flyer", image: flyerTwo },
  {
    id: 6,
    name: "Winter Clearance Flyer",
    image: flyerThree,
  },
  {
    id: 7,
    name: "Spring Collection Flyer",
    image: flyer,
  },
  { id: 8, name: "Flash Sale Flyer", image: flyerTwo },
  {
    id: 9,
    name: "Limited Edition Flyer",
    image: flyerThree,
  },
  {
    id: 10,
    name: "Weekly Specials Flyer",
    image: flyerTwo,
  },
];

export const cardTemplates = [
  {
    id: 1,
    name: "Pool Party",
    image: flyer,
  },
  {
    id: 2,
    name: "Birthday",
    image: flyer,
  },
  {
    id: 3,
    name: "Wedding",
    image: loungeImg,
  },
  {
    id: 4,
    name: "Corporate",
    image: loungeImg,
  },
  {
    id: 5,
    name: "Festival",
    image: flyer,
  },
];

export const loungeManagers = [
  {
    id: 1,
    name: "John Doe",
    message: "Pls take a look at the images.",
    time: "2 min ago",
    unread: 5,
    avatar: "JD",
  },
  {
    id: 2,
    name: "Darlene Steward",
    message: "Pls take a look at the images.",
    time: "5 min ago",
    unread: 0,
    avatar: "DS",
  },
];

export const chats = {
  1: [
    {
      id: 1,
      sender: "John Doe",
      message: "labore et dolore magna aliqua.",
      time: "09:25 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elitelusmod tempor incididunt ut labore et dolore magna aliqua.",
      time: "09:25 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "John Doe",
      message: "labore et dolore magna aliqua.",
      time: "09:25 AM",
      isOwn: false,
    },
    {
      id: 4,
      sender: "John Doe",
      message: "Sed ut perspiciatis",
      time: "09:25 AM",
      isOwn: false,
    },
    {
      id: 5,
      sender: "You",
      message: "Lorem ipsum dolor sit ut labore et dolore magna aliqua.",
      time: "09:25 AM",
      isOwn: true,
    },
  ],
  2: [
    {
      id: 1,
      sender: "Darlene Steward",
      message: "Hey, how are you?",
      time: "08:15 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      message: "I am doing great, thanks!",
      time: "08:16 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Darlene Steward",
      message: "Pls take a look at the images.",
      time: "08:20 AM",
      isOwn: false,
    },
  ],
};

export const guests = [
  {
    id: 1,
    name: "Christine Easom",
    email: "christine.easom@email.com",
    avatar: "👤",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "👤",
  },
  {
    id: 3,
    name: "Mike Anderson",
    email: "mike.anderson@email.com",
    avatar: "👤",
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    avatar: "👤",
  },
  {
    id: 5,
    name: "James Brown",
    email: "james.brown@email.com",
    avatar: "👤",
  },
  { id: 6, name: "Lisa Davis", email: "lisa.davis@email.com", avatar: "👤" },
  {
    id: 7,
    name: "David Miller",
    email: "david.miller@email.com",
    avatar: "👤",
  },
  {
    id: 8,
    name: "Rachel Green",
    email: "rachel.green@email.com",
    avatar: "👤",
  },
  { id: 9, name: "Tom Harris", email: "tom.harris@email.com", avatar: "👤" },
  {
    id: 10,
    name: "Anna Taylor",
    email: "anna.taylor@email.com",
    avatar: "👤",
  },
];

export const invoices = [
  {
    date: "Feb 19, 2024",
    description: "Subscription plan",
    total: "$150.00",
    status: "Paid",
  },
  {
    date: "Feb 07, 2024",
    description: "Subscription plan",
    total: "$150.00",
    status: "Paid",
  },
  {
    date: "Feb 02, 2024",
    description: "Subscription plan",
    total: "$150.00",
    status: "Paid",
  },
  {
    date: "Jan 30, 2024",
    description: "Subscription plan",
    total: "$150.00",
    status: "Paid",
  },
];
