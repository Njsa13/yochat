# YoChat

![Thumbnail](frontend/public/thumbnail.png)

YoChat is a web-based chat application that allows users to communicate with each other in real time through online messaging.  
This application is designed to provide a simple and user-friendly communication platform accessible via a web browser.

### Objectives

- Enable real-time text-based communication between users
- Provide a simple and intuitive user interface
- Implement a reliable web-based chat system

### Key Features

- Real-time messaging
- User-to-user chat
- Web-based access without additional installation
- Simple and responsive user interface

### Built With

- [![NodeJS][Node.js]][Node-url]
- [![ExpressJS][Express.js]][Express-url]
- [![PrismaIO][Prisma.io]][Prisma-url]
- [![SocketIO][Socket.io]][Socket-url]
- [![ReactJS][React.js]][React-url]
- [![ReduxJS][Redux.js]][Redux-url]
- [![TailwindCSS][Tailwind.css]][Tailwind-url]
- [![DaisyUI][DaisyUI.com]][DaisyUI-url]
- [![Docker][Docker]][Docker-url]

## Getting Started

Follow the steps below to set up and run the project using Docker.

### Prerequisites

- Docker
- Docker Compose

### External Services

- Google OAuth – used for user authentication
- Cloudinary – used for image upload and storage

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/Njsa13/yochat.git
   ```

2. Enter the root directory

   ```bash
   cd yochat
   ```

3. Copy the `.env.example` file and rename it to `.env`

   ```bash
   cp .env.example .env
   ```

4. Update the environment variables in the `.env` file

5. Build docker image

   ```bash
   docker compose up --build -d
   ```

6. Database migration

   ```bash
   docker compose exec backend npx prisma migrate deploy
   docker compose exec backend npx prisma generate
   ```

7. Once the application is running:

   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000

## License

This project is licensed under the [MIT License](LICENSE).

[Node.js]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org
[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express-url]: https://expressjs.com
[Prisma.io]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[Prisma-url]: https://www.prisma.io
[Socket.io]: https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101
[Socket-url]: https://socket.io
[React.js]: https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[React-url]: https://react.dev
[Redux.js]: https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white
[Redux-url]: https://redux.js.org
[Tailwind.css]: https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com
[Docker]: https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com
[DaisyUI.com]: https://img.shields.io/badge/daisyui-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white
[DaisyUI-url]: https://daisyui.com
