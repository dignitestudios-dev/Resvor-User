import {
  flyer,
  loungeImg,
  flyerThree,
  flyerTwo,
  loungeTwo,
  FlayerOne,
  flyerImage,
} from "../assets/export";

export const loungeData = [
  {
    id: 1,
    name: "Highbar Rooftop - New York, NY",
    time: "12:00 PM",
    location: "New York",
    description: "Rooftop Vibes, House Music, Sunset.....",
    extras: "VIP Cabanas, Bottle Service, Private.....",
    image: loungeImg, // import or dynamic URL
  },
  {
    id: 2,
    name: "Skyline Terrace - Los Angeles, CA",
    time: "9:00 PM",
    location: "Los Angeles",
    description: "Chill Beats, Open Air, Night Lights.....",
    extras: "Craft Cocktails, DJ Sets, Lounge Seating.....",
    image: loungeTwo,
  },
  {
    id: 3,
    name: "Oceanview Lounge - Miami, FL",
    time: "6:30 PM",
    location: "Miami",
    description: "Beachside Vibes, Tropical House, Sunset.....",
    extras: "Private Booths, Bottle Service, Poolside.....",
    image: loungeImg,
  },
];

export const flyerData = [
  { id: 1, name: "Summer Sale Flyer", image: flyerImage },
  { id: 2, name: "New Arrivals Flyer", image: flyerImage },
  { id: 3, name: "Holiday Deals Flyer", image: flyerImage },
  { id: 4, name: "Back to School Flyer", image: flyerImage },
  { id: 5, name: "Black Friday Flyer", image: flyerImage },
  {
    id: 6,
    name: "Winter Clearance Flyer",
    image: flyerImage,
  },
  {
    id: 7,
    name: "Spring Collection Flyer",
    image: flyerImage,
  },
  { id: 8, name: "Flash Sale Flyer", image: flyerImage },
  {
    id: 9,
    name: "Limited Edition Flyer",
    image: flyerImage,
  },
  {
    id: 10,
    name: "Weekly Specials Flyer",
    image: flyerImage,
  },
];

export const cardTemplates = [
  {
    id: 1,
    name: "Pool Party",
    image: FlayerOne,
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
    email: "johndoe@gmail.com",
    phone: "+156823154",
    country: "New York, USA",
  },
  {
    id: 2,
    name: "Darlene Steward",
    message: "Pls take a look at the images.",
    time: "5 min ago",
    unread: 0,
    avatar: "DS",
    email: "johndoe@gmail.com",
    phone: "+156823154",
    country: "New York, USA",
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

export const servicesData = [
  {
    id: 1,
    title: "VIP Table",
    includes: [
      "Lorem ipsum dolor sit amet.",
      "Lorem ipsum dolor sit amet.",
      "Lorem ipsum dolor sit amet.",
      "Lorem ipsum dolor sit amet.",
    ],
    price: 400,
    img: loungeImg,
  },
  {
    id: 2,
    title: "Premium Lounge",
    includes: [
      "Private seating area.",
      "Complimentary drinks.",
      "High-end lighting setup.",
    ],
    price: 550,
    img: loungeImg,
  },
  {
    id: 3,
    title: "Standard Table",
    includes: [
      "Comfortable seating.",
      "Basic service.",
      "Good view of main stage.",
    ],
    price: 250,
    img: loungeImg,
  },
  {
    id: 4,
    title: "Exclusive Suite",
    includes: [
      "Dedicated waiter.",
      "Premium bottle service.",
      "VIP rest area.",
      "Priority entry.",
    ],
    price: 800,
    img: loungeImg,
  },
  {
    id: 5,
    title: "Balcony Table",
    includes: [
      "Great top-view seating.",
      "Semi-private space.",
      "Fast-entry lane.",
    ],
    price: 350,
    img: loungeImg,
  },
];

export const eventsData = [
  {
    name: "John Doe",
    date: "12-05-25",
    time: "08:00AM 09:00PM",
    guestLimit: "04",
    seatingArea: "Rooftop",
    location: "Dallas, TX – 802 PainEase Plaza",
    status: "Upcoming",
    eventType: "Birthday Party",
  },
  {
    name: "Jane Smith",
    date: "12-05-25",
    time: "08:00AM 09:00PM",
    guestLimit: "04",
    seatingArea: "Rooftop",
    location: "Chicago, IL – 1204 Windy Lane",
    status: "Approval",
    eventType: "Birthday Party",
  },
  {
    name: "Jane Smith",
    date: "12-05-25",
    time: "08:00AM 09:00PM",
    guestLimit: "04",
    seatingArea: "Rooftop",
    location: "Chicago, IL – 1204 Windy Lane",
    status: "Approval",
    eventType: "Birthday Party",
  },
  {
    name: "Michael Johnson",
    date: "12-05-25",
    time: "08:00AM 09:00PM",
    guestLimit: "04",
    seatingArea: "Rooftop",
    location: "San Francisco, CA – 55 Market Street",
    status: "Upcoming",
    eventType: "Birthday Party",
  },
  {
    name: "Emily Davis",
    date: "12-05-25",
    time: "08:00AM 09:00PM",
    guestLimit: "04",
    seatingArea: "Rooftop",
    location: "New York, NY – 9 Empire Blvd",
    status: "Upcoming",
    eventType: "Birthday Party",
  },
];
