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

const readFromDatabase = (ctx) => {
   // Check if user already exists in the database
   const data = fs.readFileSync('./src/database.json', 'utf8');
   const users = JSON.parse(data);
   
   const existingUser = users.find(user => user.id === ctx.from.id);
   
   return existingUser;
}

module.exports = {
  writeToDatabase,
  readFromDatabase
};
