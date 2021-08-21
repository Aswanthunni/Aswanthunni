CREATE TABLE IF NOT EXISTS packagetable(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, details TEXT, fees TEXT, month TEXT, isactive TEXT);

CREATE TABLE IF NOT EXISTS adpackagetable(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, details TEXT, fees TEXT, month TEXT, isactive TEXT);

CREATE TABLE IF NOT EXISTS backup(id INTEGER PRIMARY KEY AUTOINCREMENT,lastdate TEXT);

CREATE TABLE IF NOT EXISTS customertable (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
email TEXT,
dob TEXT, 
age TEXT, 
mobile TEXT, 
gender TEXT, 
address1 TEXT, 
address2 TEXT, 
height TEXT, 
weight TEXT, 
regfees TEXT,
gympackid INTEGER,
addpackid INTEGER,
createdate TEXT,
img TEXT,
isactive TEXT
);

CREATE TABLE IF NOT EXISTS gympackagedue (
id INTEGER PRIMARY KEY AUTOINCREMENT,
customerid INTEGER,
packageid INTEGER,
totalpaid TEXT,
balance TEXT, 
paymentdate TEXT, 
duedate TEXT, 
createdate TEXT,
comments TEXT,
isactive TEXT
);

CREATE TABLE IF NOT EXISTS adpackagedue (
id INTEGER PRIMARY KEY AUTOINCREMENT,
customerid INTEGER,
packageid INTEGER,
totalpaid TEXT,
balance TEXT, 
paymentdate TEXT, 
duedate TEXT, 
createdate TEXT,
comments TEXT,
isactive TEXT
);

CREATE TABLE IF NOT EXISTS regfeedue (
id INTEGER PRIMARY KEY AUTOINCREMENT,
customerid INTEGER,
fees TEXT,
totalpaid TEXT,
balance TEXT, 
paymentdate TEXT,
comments,
isactive TEXT
);