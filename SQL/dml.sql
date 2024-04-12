-- Insert statements for Trainer table
INSERT INTO Trainer (username, password, email, full_name, date_of_birth)
VALUES ('John', 'abc123', 'g@gmail.com', 'John Doe', '2004-03-09');

-- Insert statements for AdministrativeStaff table
INSERT INTO AdministrativeStaff (username, password, email, full_name, date_of_birth)
VALUES ('Tory', 'abc123', 't@gmail.com', 'Tory Jones', '2004-05-18');

-- Insert statements for Equipment table
INSERT INTO Equipment (EquipmentName)
VALUES ('Bicep Machine'),
       ('Chest Machine'),
       ('Tricep Machine'),
       ('Back Machine'),
       ('Leg Machine');

-- Insert statements for Room table
INSERT INTO Room (RoomName)
VALUES ('Gymnasium 1'),
       ('Gymnasium 2'),
       ('Exercise Room 1'),
       ('Exercise Room 2'),
       ('Exercise Room 3');
