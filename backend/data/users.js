import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    // arguments(password, number of rounds)
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Henry Long',
    email: 'henry@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

export default users;
