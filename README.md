# Taps-App Workshop Event Ticketing Telegram Bot


![Taps-App Workshop Event Information Image](https://i.imgur.com/qt8Sjsb.png "Taps-App Workshop Event Information Image")


## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Database](#database)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Taps-App Workshop Event Ticketing Telegram Bot is a Telegram bot designed to handle event RSVPs. It allows users to register for events, join groups, and receive event-related information.

## Features

- User registration for events
- Group invitation management
- Event information retrieval

## Installation

To install and run this bot locally, follow these steps:

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/CEYLABS-INTERN-TGBOT-EVENTRSVP.git
    ```

2. Navigate to the project directory:

    ```sh
    cd CEYLABS-INTERN-TGBOT-EVENTRSVP
    ```

3. Install the dependencies:

    ```sh
    npm install
    ```

4. Update a `src/config.js` file, add your Telegram bot token and event group ID:

    ```js
    module.exports = {
    BOT_TOKEN: 'Your Bot Token Here', // bot`s token. You can get that in @BotFather
    GROUP_ID: 'Your Group ID Here' // // Group ID of the event group. You can get it using the /grpid command after adding the bot to the group.
    }

## Usage

To start the bot, run the following command:

```sh
npm test
```

## Configuration

The configuration settings are located in the ```src/config.js``` file. Adjust the settings according to your requirements.

## Database
User registration details are stored in the ```src/database.json``` file. The information stored includes the user's name, email, and the number of tickets they registered for.

### Structure of database.json
The ```database.json``` file contains user data in the following format:

```json
{
  "users": [
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "noOfTickets": 2
    },
    {
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "noOfTickets": 1
    }
  ]
}
```

## Contributing

We welcome contributions! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
