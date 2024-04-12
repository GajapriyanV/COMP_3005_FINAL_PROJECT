// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Require the db.js file
const app = express();
const cors = require("cors");
const PORT = 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Register Member Endpoint
app.post('/registermember', async (req, res) => {
  try {
    // Extract member information from request body
    const { username, password, role, fullName, email, dateOfBirth,weight,height,age, fitnessAchievements, fitnessRoutine, } = req.body;

    // Insert member information into the database
    const result = await db.query(
      'INSERT INTO Member (username, password, role, fullName, email, dateOfBirth, fitnessAchievements, fitnessRoutine) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING memberID',
      [username, password, role, fullName, email, dateOfBirth, fitnessAchievements, fitnessRoutine]
    );

    // Extract the inserted memberID from the result
    const memberId = result.rows[0].memberid;

    const healthMetricsResult = await db.query(
      'INSERT INTO HealthMetrics (height, weight, age, memberID) VALUES ($1, $2, $3, $4)',
      [height, weight, age, memberId]
    );
    
    res.status(201).json({ message: 'Member registered successfully' });
  } catch (error) {
    console.error('Error registering member', error);
    res.status(500).send('Internal Server Error');
  }
});

// Register Trainer Endpoint
app.post('/registertrainer', async (req, res) => {
  try {
    // Extract trainer information from request body
    const { username, password, email, full_name, date_of_birth } = req.body;

    // Insert trainer information into the database
    const result = await db.query(
      'INSERT INTO Trainer (username, password, email, full_name, date_of_birth) VALUES ($1, $2, $3, $4, $5) RETURNING trainer_id',
      [username, password, email, full_name, date_of_birth]
    );

    // Extract the inserted trainer_id from the result
    const trainerId = result.rows[0].trainer_id;

    res.status(201).json({ message: 'Trainer registered successfully' });
  } catch (error) {
    console.error('Error registering trainer', error);
    res.status(500).send('Internal Server Error');
  }
});

// Register Administrative Staff Endpoint
app.post('/registeradmin', async (req, res) => {
  try {
    // Extract administrative staff information from request body
    const { username, password, email, full_name, date_of_birth } = req.body;

    // Insert administrative staff information into the database
    const result = await db.query(
      'INSERT INTO AdministrativeStaff (username, password, email, full_name, date_of_birth) VALUES ($1, $2, $3, $4, $5) RETURNING staff_id',
      [username, password, email, full_name, date_of_birth]
    );

    // Extract the inserted staff_id from the result
    const staffId = result.rows[0].staff_id;

    res.status(201).json({ message: 'Administrative staff registered successfully' });
  } catch (error) {
    console.error('Error registering administrative staff', error);
    res.status(500).send('Internal Server Error');
  }
});

// Member Login Endpoint
app.post('/memberlogin', async (req, res) => {
  try {
    // Extract username and password from request body
    const { username, password } = req.body;

    // Query the database to check if the username and password match a member
    const result = await db.query(
      'SELECT memberID FROM Member WHERE username = $1 AND password = $2',
      [username, password]
    );

    // If a member with the provided credentials is found, return the memberID
    if (result.rows.length > 0) {
      const memberId = result.rows[0].memberid;
      console.log(memberId);
      res.status(200).json({ memberId });
    } else {
      // If no member is found with the provided credentials, return an error message
      res.status(404).json({ message: 'Member not found or incorrect credentials' });
    }
  } catch (error) {
    console.error('Error logging in member', error);
    res.status(500).send('Internal Server Error');
  }
});

// Trainer Login Endpoint
app.post('/trainerlogin', async (req, res) => {
  try {
    // Extract username and password from request body
    const { username, password } = req.body;

    // Query the database to check if the username and password match a trainer
    const result = await db.query(
      'SELECT trainer_id FROM Trainer WHERE username = $1 AND password = $2',
      [username, password]
    );

    // If a trainer with the provided credentials is found, return the trainer_id
    if (result.rows.length > 0) {
      const trainerId = result.rows[0].trainer_id;
      res.status(200).json({ trainerId });
    } else {
      // If no trainer is found with the provided credentials, return an error message
      res.status(404).json({ message: 'Trainer not found or incorrect credentials' });
    }
  } catch (error) {
    console.error('Error logging in trainer', error);
    res.status(500).send('Internal Server Error');
  }
});

// Admin Login Endpoint
app.post('/adminlogin', async (req, res) => {
  try {
    // Extract username and password from request body
    const { username, password } = req.body;

    // Query the database to check if the username and password match an administrative staff member
    const result = await db.query(
      'SELECT staff_id FROM AdministrativeStaff WHERE username = $1 AND password = $2',
      [username, password]
    );

    // If an administrative staff member with the provided credentials is found, return the staff_id
    if (result.rows.length > 0) {
      const staffId = result.rows[0].staff_id;
      res.status(200).json({ staffId });
    } else {
      // If no administrative staff member is found with the provided credentials, return an error message
      res.status(404).json({ message: 'Administrative staff member not found or incorrect credentials' });
    }
  } catch (error) {
    console.error('Error logging in administrative staff member', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get Member Info by ID Endpoint
app.post('/memberinfo', async (req, res) => {
  try {
    // Extract memberId from request body
    const { memberId } = req.body;

    // Query the database to select member info based on memberId
    const result = await db.query(
      'SELECT * FROM Member WHERE memberID = $1',
      [memberId]
    );

    // Check if member with the provided memberId exists
    if (result.rows.length > 0) {
      const memberInfo = result.rows[0];
      res.status(200).json({ memberInfo });
    } else {
      // If no member is found with the provided memberId, return an error message
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    console.error('Error retrieving member info', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get Member Health Metrics by ID Endpoint
app.post('/memberhealth', async (req, res) => {
  try {
    // Extract memberId from request body
    const { memberId } = req.body;

    // Query the database to select health metrics based on memberId
    const result = await db.query(
      'SELECT height, weight, age FROM HealthMetrics WHERE memberID = $1',
      [memberId]
    );

    // Check if member with the provided memberId exists
    if (result.rows.length > 0) {
      const healthMetrics = result.rows[0];
      res.status(200).json({ healthMetrics });
    } else {
      // If no member is found with the provided memberId, return an error message
      res.status(404).json({ message: 'Health metrics not found for the member' });
    }
  } catch (error) {
    console.error('Error retrieving health metrics', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/updatemember', async (req, res) => {
  try {
    // Extract member information from request body
    const { memberId, username, email, password, fitnessAchievements, weight, height, age } = req.body;
    console.log(memberId, username, email, password, fitnessAchievements, weight, height, age);

    // Update member information in the database
    const result = await db.query(
      'UPDATE Member SET username = $1, email = $2, password = $3, fitnessAchievements = $4 WHERE memberID = $5',
      [username, email, password, fitnessAchievements, memberId]
    );

    // Update health metrics in the database
    await db.query(
      'UPDATE HealthMetrics SET weight = $1, height = $2, age = $3 WHERE memberID = $4',
      [weight, height, age, memberId]
    );

    res.status(200).json({ message: 'Member information updated successfully' });
  } catch (error) {
    console.error('Error updating member information', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/createsession', async (req, res) => {
  try {
    // Extract session details from request body
    const {
      SessionName,
      TrainerId,
      RoomId,
      SessionDate,
      SessionTime,
      DurationMinutes,
      Size,
      ClassType,
      SessionFocus
    } = req.body;

    // Insert session information into the database
    const result = await db.query(
      'INSERT INTO Session (SessionName, TrainerId, RoomId, SessionDate, SessionTime, DurationMinutes, Size, ClassType, SessionFocus) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [SessionName, TrainerId, RoomId, SessionDate, SessionTime, DurationMinutes, Size, ClassType, SessionFocus]
    );

    res.status(201).json({ message: 'Session created successfully' });
  } catch (error) {
    console.error('Error creating session', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/availablerooms', async (req, res) => {
  try {
    // Query the database to select rooms where available is true
    const result = await db.query(
      'SELECT * FROM Room WHERE available = TRUE'
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving available rooms', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/getmemberinfo', async (req, res) => {
  try {
    // Extract full name from request body
    const { fullName } = req.body;

    // Query the database to select email, fitness achievements, and fitness routines of the member with the given full name
    const result = await db.query(
      'SELECT email, fitnessAchievements, fitnessRoutine FROM Member WHERE fullName = $1',
      [fullName]
    );

    // Check if member with the provided full name exists
    if (result.rows.length > 0) {
      const memberInfo = result.rows[0];
      res.status(200).json({ memberInfo });
    } else {
      // If no member is found with the provided full name, return an error message
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    console.error('Error retrieving member info', error);
    res.status(500).send('Internal Server Error');
  }
});


// Make Room Available Endpoint
app.post('/makeroomavailable', async (req, res) => {
  try {
    // Extract room name from request body
    const { roomName } = req.body;
    console.log(roomName);

    // Update the database to set available to true for the room with the provided name
    const result = await db.query(
      'UPDATE Room SET available = TRUE WHERE RoomName = $1',
      [roomName]
    );

    res.status(200).json({ message: 'Room availability updated successfully' });
  } catch (error) {
    console.error('Error updating room availability', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/makeroomunavailable', async (req, res) => {
  try {
    // Extract room name from request body
    const { roomName } = req.body;
    console.log(roomName);

    // Update the database to set available to false for the room with the provided name
    const result = await db.query(
      'UPDATE Room SET available = FALSE WHERE RoomName = $1',
      [roomName]
    );

    res.status(200).json({ message: 'Room availability updated successfully' });
  } catch (error) {
    console.error('Error updating room availability', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get all Sessions Endpoint
app.get('/allsessions', async (req, res) => {
  try {
    // Query the database to select all sessions, including the session date and time
    const result = await db.query(
      'SELECT SessionId, SessionName, SessionDate, SessionTime FROM Session'
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving sessions', error);
    res.status(500).send('Internal Server Error');
  }
});



// Update Session Date and Time Endpoint
app.post('/updatesessiondatetime', async (req, res) => {
  try {
    // Extract session ID, new date, and new time from request body
    const { sessionId, newDate, newTime } = req.body;

    // Update session date and time in the database based on session ID
    const result = await db.query(
      'UPDATE Session SET SessionDate = $1, SessionTime = $2 WHERE SessionId = $3',
      [newDate, newTime, sessionId]
    );

    res.status(200).json({ message: 'Session date and time updated successfully' });
  } catch (error) {
    console.error('Error updating session date and time', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/addtocart', async (req, res) => {
  try {
    // Extract MemberId, SessionId, and Price from request body
    const { MemberId, SessionId, Price } = req.body;

    // Start a transaction
    await db.query('BEGIN');

    // Insert cart item into the MembersCart table
    const resultInsert = await db.query(
      'INSERT INTO MembersCart (MemberId, SessionId, Price) VALUES ($1, $2, $3)',
      [MemberId, SessionId, Price]
    );

    // Update session size by incrementing it by 1
    const resultUpdate = await db.query(
      'UPDATE Session SET Size = Size + 1 WHERE SessionId = $1',
      [SessionId]
    );

    // Commit the transaction if both queries are successful
    await db.query('COMMIT');

    res.status(201).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    // Rollback the transaction if there's any error
    await db.query('ROLLBACK');

    console.error('Error adding item to cart', error);
    res.status(500).send('Internal Server Error');
  }
});


// Select session name and price for a given member ID
app.post('/getcartitems', async (req, res) => {
  try {
    // Extract MemberId from request body
    const { MemberId } = req.body;

    // Query the database to select session ID and price for the given member ID from MembersCart
    const cartItemsResult = await db.query(
      'SELECT SessionId, Price FROM MembersCart WHERE MemberId = $1',
      [MemberId]
    );

    // Create an array to store session details
    const sessionDetails = [];

    // Iterate over the cart items to get session names and additional details
    for (const item of cartItemsResult.rows) {
      // Retrieve session name and any additional details you need for each session
      const sessionInfoResult = await db.query(
        'SELECT SessionName FROM Session WHERE SessionId = $1',
        [item.sessionid]
      );

      // Push session details into the sessionDetails array
      sessionDetails.push({
        sessionName: sessionInfoResult.rows[0].sessionname,
        price: item.price
      });
    }

    // Send the session details back in the response
    res.status(200).json(sessionDetails);
  } catch (error) {
    console.error('Error retrieving cart items', error);
    res.status(500).send('Internal Server Error');
  }
});

// Create Billing Endpoint
app.post('/createbilling', async (req, res) => {
  try {
    // Extract MemberId, Date, and Amount from request body
    const { MemberId, Date, Amount } = req.body;

    // Start a transaction to ensure data integrity
    await db.query('BEGIN');

    // Insert billing information into the database
    const result = await db.query(
      'INSERT INTO Billing (MemberId, Date, Amount) VALUES ($1, $2, $3) RETURNING BillId',
      [MemberId, Date, Amount]
    );

    // Extract the inserted BillId from the result
    const billId = result.rows[0].billid;

    // Delete rows associated with the MemberId from memberscart
    await db.query(
      'DELETE FROM memberscart WHERE MemberId = $1',
      [MemberId]
    );

    // Commit the transaction
    await db.query('COMMIT');

    res.status(201).json({ message: 'Billing record created successfully', billId });
  } catch (error) {
    // If any error occurs, rollback the transaction
    await db.query('ROLLBACK');
    console.error('Error creating billing record', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/updateequipment', async (req, res) => {
  try {
    // Extract equipment name and new condition from request body
    const { equipmentName, newCondition } = req.body;

    // Update the condition of the equipment based on its name
    const query = 'UPDATE Equipment SET Condition = $1 WHERE EquipmentName = $2';
    const values = [newCondition, equipmentName];
    const result = await db.query(query, values);

    res.status(200).json({ message: `Condition of ${equipmentName} updated successfully` });
  } catch (error) {
    console.error('Error updating equipment condition:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getbillings', async (req, res) => {
  try {
    // Query the database to select billings with member's full name
    const result = await db.query(
      `SELECT b.MemberId, m.fullName, b.Amount 
       FROM Billing b
       INNER JOIN Member m ON b.MemberId = m.MemberId`
    );

    // Send the billings data back in the response
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving billings', error);
    res.status(500).send('Internal Server Error');
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
