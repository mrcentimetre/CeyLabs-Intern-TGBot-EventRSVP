const fs = require('fs');

const writeToDatabase = (userData) => {
  // Read the existing data from the file
  const data = fs.readFileSync('./src/database.json', 'utf8');
  const users = JSON.parse(data);
     
  // Add the new user
  users.push(userData);
  
  // Write the updated data back to the file
  fs.writeFileSync('./src/database.json', JSON.stringify(users, null, 2));
};

module.exports = {
  writeToDatabase
};
