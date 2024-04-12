-- Create the Member table
CREATE TABLE Member (
    memberID SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    dateOfBirth DATE NOT NULL,
    fitnessAchievements TEXT,
    fitnessRoutine TEXT
);

-- Create the Trainer table
CREATE TABLE Trainer (
    trainer_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL
);

-- Create the Session table
CREATE TABLE Session (
    SessionId SERIAL PRIMARY KEY,
    SessionName VARCHAR(255) NOT NULL,
    TrainerId INT NOT NULL,
    RoomId INT NOT NULL,
    SessionDate DATE NOT NULL,
    SessionTime TIME NOT NULL,
    DurationMinutes INT NOT NULL,
    Size INT NOT NULL,
    ClassType VARCHAR(255),
    SessionFocus VARCHAR(255),

    FOREIGN KEY (TrainerId) REFERENCES Trainer(trainer_id),
    FOREIGN KEY (RoomId) REFERENCES Room(RoomID)
);

-- Create the Room table
CREATE TABLE Room (
    RoomID SERIAL PRIMARY KEY,
    RoomName VARCHAR(255) NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create the AdministrativeStaff table
CREATE TABLE AdministrativeStaff (
    staff_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL
);

-- Create the HealthMetrics table
CREATE TABLE HealthMetrics (
    healthMetricID SERIAL PRIMARY KEY,
    height INT,
    weight INT,
    age INT,
    memberID INT,
    FOREIGN KEY (memberID) REFERENCES Member(memberID)
);

-- Create the Equipment table
CREATE TABLE Equipment (
    EquipmentId SERIAL PRIMARY KEY,
    EquipmentName VARCHAR(255) NOT NULL,
    Condition VARCHAR(50) DEFAULT 'Factory New'
);

-- Create the Billing table
CREATE TABLE Billing (
    BillId SERIAL PRIMARY KEY,
    MemberId INT NOT NULL,
    Date DATE NOT NULL,
    Amount INT NOT NULL,
    FOREIGN KEY (MemberId) REFERENCES Member(memberID)
);

-- Create the MembersCart table
CREATE TABLE MembersCart (
    CartId SERIAL PRIMARY KEY,
    MemberId INT,
    SessionId INT,
    Price INT,
    FOREIGN KEY (MemberId) REFERENCES Member(memberID),
    FOREIGN KEY (SessionId) REFERENCES Session(SessionId)
);
