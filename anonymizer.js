/*
 * anonymizer.js — Multi-stage local PII detection, entity management,
 * single-pass non-cascading redaction, and pre-export leak audit for
 * WhatsApp chat exports.
 *
 * Works in the browser (window.WhatsAppAnonymizer) and in Node (module.exports).
 * 100% offline / client-side — zero network requests, zero external deps.
 */
(function (root, factory) {
  const names = (typeof module !== 'undefined' && module.exports)
    ? require('./names.js')
    : (root.WhatsAppNames || { FIRST_NAMES: [], SURNAMES: [], AMBIGUOUS: new Set() });
  const api = factory(names);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.WhatsAppAnonymizer = api;
})(typeof self !== 'undefined' ? self : globalThis, function (NAMES) {
  'use strict';

  /* ========================================================================
   * 1. GAZETTEERS & CURATED KNOWLEDGE TABLES
   * ======================================================================== */

  // International first names & surnames extending names.js (South Asian,
  // East Asian, MENA, European, Irish/Scottish, Hispanic, Slavic, African).
  const EXTRA_FIRST_NAMES = [
    // South Asian
    'Aarav', 'Aanya', 'Aditya', 'Aditi', 'Aisha', 'Ajay', 'Akash', 'Akhil', 'Alisha', 'Alok',
    'Aman', 'Amir', 'Amit', 'Ananya', 'Anil', 'Ananya', 'Anjali', 'Ankit', 'Ankita', 'Ansh',
    'Ananya', 'Arjun', 'Arnav', 'Aryan', 'Asha', 'Ashish', 'Ashok', 'Avni', 'Ayush', 'Bhavna',
    'Deepa', 'Deepak', 'Dev', 'Devika', 'Dhruv', 'Divya', 'Diya', 'Farhan', 'Gaurav', 'Geeta',
    'Harish', 'Harsh', 'Hema', 'Imran', 'Isha', 'Ishaan', 'Jai', 'Jaya', 'Kabir', 'Kajal',
    'Kamal', 'Karan', 'Kartik', 'Kavita', 'Kavya', 'Kiran', 'Komal', 'Krishna', 'Kunal', 'Lakshmi',
    'Madhav', 'Mahesh', 'Manish', 'Manoj', 'Maya', 'Meera', 'Megha', 'Mihir', 'Mohan', 'Mohit',
    'Mukesh', 'Nadia', 'Neha', 'Nikhil', 'Nisha', 'Nitin', 'Pallavi', 'Pankaj', 'Parth', 'Pooja',
    'Pradeep', 'Prakash', 'Pranav', 'Prashant', 'Preeti', 'Prerna', 'Priya', 'Priyanka', 'Puja', 'Radha',
    'Raghav', 'Rahul', 'Raj', 'Rajan', 'Rajesh', 'Rajiv', 'Rakesh', 'Ramesh', 'Rani', 'Rashmi',
    'Ravi', 'Rekha', 'Renu', 'Richa', 'Rishabh', 'Rishi', 'Ritu', 'Riya', 'Rohan', 'Rohit',
    'Roshni', 'Rupal', 'Sachin', 'Sagar', 'Sahil', 'Sameer', 'Samir', 'Sandeep', 'Sanjay', 'Sanjana',
    'Sanya', 'Sapna', 'Sarita', 'Saurabh', 'Seema', 'Shalini', 'Shankar', 'Shashi', 'Sheetal', 'Shikha',
    'Shilpa', 'Shiv', 'Shiva', 'Shivam', 'Shivani', 'Shraddha', 'Shreya', 'Shruti', 'Shubham', 'Siddharth',
    'Simran', 'Smita', 'Sneha', 'Sonal', 'Sonali', 'Sonam', 'Sonia', 'Suhani', 'Suman', 'Sumit',
    'Sunil', 'Sunita', 'Suraj', 'Suresh', 'Surya', 'Swati', 'Tanvi', 'Tara', 'Tarun', 'Tushar',
    'Uday', 'Uma', 'Usha', 'Vaibhav', 'Vandana', 'Varun', 'Ved', 'Veena', 'Vicky', 'Vidya',
    'Vijay', 'Vikas', 'Vikram', 'Vinay', 'Vineet', 'Vinod', 'Vipin', 'Vishal', 'Vivek', 'Yash',
    'Yusuf', 'Zoya',
    // Arabic / MENA
    'Abbas', 'Abdul', 'Abdullah', 'Adel', 'Adnan', 'Ahmad', 'Amina', 'Amira', 'Ammar', 'Anas',
    'Ayman', 'Bilal', 'Dalia', 'Faisal', 'Farah', 'Farid', 'Fatima', 'Hadi', 'Hafsa', 'Hamza',
    'Hana', 'Hanan', 'Hassan', 'Hiba', 'Huda', 'Hussein', 'Ibrahim', 'Idris', 'Iman', 'Ismail',
    'Jamal', 'Kareem', 'Karim', 'Khalid', 'Laila', 'Lama', 'Layla', 'Leila', 'Lina', 'Mahmoud',
    'Malak', 'Malik', 'Mariam', 'Marwan', 'Maryam', 'Mazen', 'Mohamed', 'Mohammad', 'Mohammed', 'Mona',
    'Mostafa', 'Muhammad', 'Muna', 'Mustafa', 'Nabil', 'Nada', 'Nader', 'Nadia', 'Naila', 'Nasser',
    'Noor', 'Nour', 'Omar', 'Osama', 'Qasim', 'Rami', 'Rana', 'Rania', 'Rashid', 'Reem',
    'Saad', 'Saeed', 'Safiya', 'Salim', 'Salma', 'Salman', 'Sami', 'Samira', 'Sana', 'Sara',
    'Tarek', 'Tariq', 'Waleed', 'Walid', 'Yara', 'Yasin', 'Yasir', 'Yasmin', 'Yasmine', 'Youssef',
    'Zahra', 'Zaid', 'Zain', 'Zainab', 'Zaki', 'Zayd',
    // East & Southeast Asian
    'Akira', 'Aoi', 'Bao', 'Bo', 'Chen', 'Chun', 'Daiki', 'Eun', 'Feng', 'Hana',
    'Haruki', 'Haruto', 'Hiro', 'Hiroshi', 'Hui', 'Hyun', 'Jae', 'Ji', 'Jian', 'Jie',
    'Jin', 'Jing', 'Joon', 'Jun', 'Kaede', 'Kaito', 'Keiko', 'Kenji', 'Kenta', 'Koji',
    'Lan', 'Lei', 'Li', 'Liang', 'Lin', 'Ling', 'Linh', 'Mai', 'Mei', 'Min',
    'Ming', 'Minh', 'Naoki', 'Natsuki', 'Nhat', 'Phuong', 'Ping', 'Qiang', 'Qing', 'Ren',
    'Riku', 'Rina', 'Ryo', 'Sakura', 'Satoshi', 'Seo', 'Shan', 'Shin', 'Shun', 'Sora',
    'Soo', 'Takashi', 'Takeshi', 'Tao', 'Thao', 'Trang', 'Tuan', 'Wei', 'Wen', 'Xiang',
    'Xiao', 'Xin', 'Xiu', 'Yan', 'Yang', 'Yi', 'Ying', 'Yoko', 'Yong', 'Yu',
    'Yuki', 'Yuko', 'Yumi', 'Yuna', 'Yuto', 'Zhi',
    // European / Hispanic / Irish / Nordic / Slavic
    'Aidan', 'Aiden', 'Aileen', 'Ailish', 'Alastair', 'Alejandro', 'Alessandra', 'Alessandro', 'Alexei', 'Alfonso',
    'Alistair', 'Alvaro', 'Amelie', 'Anders', 'Andre', 'Andrei', 'Andres', 'Aneta', 'Anja', 'Anke',
    'Annika', 'Antoine', 'Anton', 'Antonia', 'Antonio', 'Aoife', 'Arnaud', 'Arturo', 'Astrid', 'Axel',
    'Baptiste', 'Bartosz', 'Bastian', 'Benoit', 'Bernardo', 'Bianca', 'Bjorn', 'Bogdan', 'Boris', 'Bram',
    'Callum', 'Camilla', 'Camille', 'Carina', 'Carlo', 'Carlota', 'Carolina', 'Caterina', 'Cedric', 'Celine',
    'Chiara', 'Cian', 'Ciara', 'Ciaran', 'Cillian', 'Clement', 'Colette', 'Conor', 'Cormac', 'Cristian',
    'Cristina', 'Daan', 'Dagmar', 'Damian', 'Dario', 'Darius', 'Davide', 'Declan', 'Dermot', 'Diarmuid',
    'Dimitri', 'Dmitri', 'Dmitry', 'Dominik', 'Eduardo', 'Eamon', 'Eamonn', 'Eileen', 'Einar', 'Ekaterina',
    'Eleni', 'Elise', 'Elodie', 'Emil', 'Emilia', 'Emilio', 'Enrique', 'Enzo', 'Eoin', 'Erika',
    'Esteban', 'Etienne', 'Ewan', 'Fabian', 'Fabio', 'Federico', 'Felipe', 'Fergus', 'Filip', 'Finn',
    'Fionn', 'Flavia', 'Florian', 'Francesca', 'Francesco', 'Francois', 'Freja', 'Freya', 'Frida', 'Gael',
    'Gareth', 'Gavin', 'Giacomo', 'Gianluca', 'Gilles', 'Giorgio', 'Giovanni', 'Giulia', 'Giuseppe', 'Gonzalo',
    'Goran', 'Guillermo', 'Gunnar', 'Gustavo', 'Hamish', 'Hanna', 'Hannes', 'Hans', 'Heike', 'Henrik',
    'Hugo', 'Iain', 'Ignacio', 'Igor', 'Iker', 'Ilona', 'Ines', 'Ingrid', 'Irena', 'Irina',
    'Isla', 'Iva', 'Ivana', 'Jacek', 'Jakob', 'Jakub', 'Jan', 'Jana', 'Janine', 'Jasper',
    'Jeroen', 'Joao', 'Joaquin', 'Johan', 'Johanna', 'Johannes', 'Jonas', 'Jordi', 'Jorge', 'Jose',
    'Josef', 'Jules', 'Julian', 'Juliana', 'Julien', 'Juliette', 'Jürgen', 'Jurgen', 'Kacper', 'Kai',
    'Karin', 'Karina', 'Karol', 'Karolina', 'Kasper', 'Katarina', 'Katarzyna', 'Katja', 'Katrin', 'Kieran',
    'Klara', 'Klaus', 'Koen', 'Konrad', 'Kostas', 'Kristian', 'Kristina', 'Krzysztof', 'Lachlan', 'Lars',
    'Lasse', 'Laura', 'Laurent', 'Leandro', 'Lena', 'Lennart', 'Leon', 'Leonardo', 'Liam', 'Lukas',
    'Luka', 'Lukas', 'Lukasz', 'Lydia', 'Maciej', 'Mads', 'Maeve', 'Magda', 'Magdalena', 'Maia',
    'Maike', 'Maja', 'Malgorzata', 'Manon', 'Manuel', 'Manuela', 'Marc', 'Marcel', 'Marcelo', 'Marco',
    'Marcos', 'Marek', 'Maren', 'Margaux', 'Margot', 'Mariano', 'Maribel', 'Marija', 'Marius', 'Marko',
    'Markus', 'Marta', 'Martijn', 'Martina', 'Matej', 'Mateo', 'Mateusz', 'Mathilde', 'Matias', 'Matteo',
    'Matthias', 'Mathieu', 'Matthieu', 'Maud', 'Mauricio', 'Maxime', 'Maximilian', 'Michal', 'Michele', 'Mikkel',
    'Mila', 'Milan', 'Milos', 'Mireille', 'Miriam', 'Mirko', 'Moira', 'Monika', 'Moritz', 'Nadine',
    'Nadja', 'Natalia', 'Natasha', 'Niamh', 'Niccolo', 'Nico', 'Nicola', 'Nicolas', 'Niels', 'Nikita',
    'Niklas', 'Nikolai', 'Nikos', 'Nils', 'Noemi', 'Nora', 'Oisin', 'Oksana', 'Olav', 'Oleg',
    'Olga', 'Ollie', 'Orla', 'Oskar', 'Padraig', 'Paloma', 'Paola', 'Paolo', 'Pascal', 'Patricio',
    'Patryk', 'Paulina', 'Pavel', 'Pawel', 'Pedro', 'Petra', 'Philipp', 'Philippe', 'Pia', 'Pietro',
    'Piotr', 'Polina', 'Quentin', 'Radek', 'Rafa', 'Ramiro', 'Raul', 'Remi', 'Remy', 'Renata',
    'Renato', 'Rene', 'Ricardo', 'Riccardo', 'Rik', 'Roan', 'Rocco', 'Rodrigo', 'Roisin', 'Romain',
    'Roman', 'Ronan', 'Rory', 'Rosario', 'Rowan', 'Ruairi', 'Ruben', 'Rupert', 'Sander', 'Sandro',
    'Santiago', 'Saoirse', 'Sasha', 'Sascha', 'Sebastien', 'Seamus', 'Sergio', 'Sergey', 'Sergei', 'Siobhan',
    'Sinead', 'Sofia', 'Sofie', 'Solange', 'Soren', 'Sorcha', 'Stefan', 'Stefania', 'Stefano', 'Steffen',
    'Stellan', 'Svetlana', 'Sylvie', 'Tadeusz', 'Tamsin', 'Tatiana', 'Theo', 'Thibault', 'Thierry', 'Thijs',
    'Tiago', 'Till', 'Timo', 'Tiziano', 'Tobias', 'Tomas', 'Tomasz', 'Torsten', 'Tristan', 'Ulrich',
    'Ulrike', 'Ursula', 'Uwe', 'Vadim', 'Valentina', 'Valentino', 'Valeria', 'Valerio', 'Vasco', 'Viktor',
    'Viktoria', 'Vincenzo', 'Vitaly', 'Vito', 'Vlad', 'Vladimir', 'Vladislav', 'Willem', 'Wim', 'Wojciech',
    'Wolfgang', 'Xander', 'Xavier', 'Yael', 'Yann', 'Yannick', 'Yaroslava', 'Yelena', 'Yuri', 'Yulia',
    'Zofia', 'Zuzana',
    // African
    'Abebe', 'Abena', 'Adaeze', 'Adebayo', 'Adewale', 'Amaka', 'Amara', 'Amina', 'Ayo', 'Ayodele',
    'Babatunde', 'Chidi', 'Chidinma', 'Chika', 'Chinedu', 'Chioma', 'Chukwu', 'Damilola', 'Efua', 'Emeka',
    'Esi', 'Femi', 'Folake', 'Funke', 'Gbenga', 'Ife', 'Ifeanyi', 'Ike', 'Jabari', 'Jide',
    'Kelechi', 'Kofi', 'Kwabena', 'Kwaku', 'Kwame', 'Kwasi', 'Lekan', 'Ngozi', 'Nkechi', 'Nnamdi',
    'Obi', 'Obinna', 'Olu', 'Oluwaseun', 'Ope', 'Sade', 'Segun', 'Seyi', 'Sola', 'Tayo',
    'Temi', 'Thabo', 'Tobi', 'Tolu', 'Tunde', 'Uche', 'Wale', 'Yemi', 'Yetunde', 'Zuri',
    // Common modern Western & diminutives missing from names.js
    'Abby', 'Abbie', 'Addie', 'Alfie', 'Allie', 'Alastair', 'Angie', 'Archie', 'Ash', 'Becca',
    'Becky', 'Bella', 'Bennie', 'Benny', 'Bertie', 'Beth', 'Bethany', 'Betsy', 'Bettie', 'Brad',
    'Bryn', 'Caitlin', 'Caitlyn', 'Caleb', 'Callie', 'Cam', 'Carly', 'Cathy', 'Cece', 'Chaz',
    'Chrissy', 'Cindy', 'Connie', 'Corinne', 'Danica', 'Dani', 'Danny', 'Darcy', 'Darren', 'Daryl',
    'Davey', 'Deb', 'Debbie', 'Declan', 'Derrick', 'Dom', 'Donny', 'Dottie', 'Drew', 'Elliot',
    'Elliott', 'Em', 'Emmie', 'Erica', 'Evie', 'Faye', 'Finley', 'Fran', 'Frankie', 'Freddie',
    'Freddy', 'Gabe', 'Gabby', 'Gemma', 'Gerry', 'Gigi', 'Gina', 'Ginny', 'Gracie', 'Gus',
    'Hallie', 'Hattie', 'Hayden', 'Hayley', 'Imogen', 'Indie', 'Izzy', 'Jackie', 'Jada', 'Jaden',
    'Jagger', 'Jaimie', 'Janey', 'Jase', 'Jaz', 'Jazmin', 'Jed', 'Jemima', 'Jen', 'Jenna',
    'Jennie', 'Jenny', 'Jess', 'Jessie', 'Jodie', 'Jody', 'Joey', 'Jon', 'Jonah', 'Jonny',
    'Jordy', 'Josie', 'Joss', 'Jude', 'Kaitlin', 'Kaitlyn', 'Kasey', 'Kat', 'Katelyn', 'Kath',
    'Kathy', 'Katy', 'Kay', 'Kayleigh', 'Keira', 'Kelsey', 'Kendall', 'Kendra', 'Kenny', 'Kerry',
    'Kev', 'Kian', 'Kiera', 'Kirsten', 'Kirsty', 'Kylie', 'Lacey', 'Lana', 'Larry', 'Laurie',
    'Layla', 'Leanne', 'Lenny', 'Lexi', 'Lexie', 'Libby', 'Lillie', 'Lilly', 'Lindsay', 'Lindsey',
    'Liz', 'Lizzie', 'Lizzy', 'Lottie', 'Lou', 'Louie', 'Louisa', 'Louise', 'Lulu', 'Lyla',
    'Maddie', 'Maddy', 'Maddison', 'Madeleine', 'Madeline', 'Madison', 'Maisie', 'Mandy', 'Marcie', 'Margo',
    'Marissa', 'Marley', 'Marnie', 'Marty', 'Matilda', 'Matty', 'Maxine', 'Mckenzie', 'Meg', 'Meghan',
    'Mel', 'Mikey', 'Mila', 'Millie', 'Milly', 'Mindy', 'Minnie', 'Mitch', 'Mo', 'Mollie',
    'Mya', 'Nadia', 'Nat', 'Nate', 'Nicky', 'Nikki', 'Nora', 'Ollie', 'Paddy', 'Paige',
    'Pam', 'Patsy', 'Patti', 'Patty', 'Peyton', 'Phil', 'Pippa', 'Poppy', 'Quinn', 'Rachie',
    'Rafa', 'Reece', 'Reese', 'Reggie', 'Rhea', 'Rhiannon', 'Rhys', 'Rich', 'Richie', 'Ricky',
    'Riley', 'Robbie', 'Robby', 'Rocco', 'Ronnie', 'Rory', 'Rosie', 'Roxy', 'Russ', 'Sadie',
    'Sammy', 'Sasha', 'Savannah', 'Scarlett', 'Scotty', 'Seb', 'Shauna', 'Shelby', 'Shelley', 'Sherry',
    'Sian', 'Sienna', 'Skye', 'Skyler', 'Sonny', 'Stacey', 'Steph', 'Stevie', 'Stu', 'Sue',
    'Summer', 'Suzy', 'Sydney', 'Sylvie', 'Tabitha', 'Talia', 'Tammy', 'Tanya', 'Tasha', 'Tatum',
    'Taylor', 'Ted', 'Teddy', 'Terri', 'Tessa', 'Tiff', 'Tilly', 'Timmy', 'Toby', 'Tommy',
    'Toni', 'Tori', 'Tracey', 'Tricia', 'Trish', 'Trisha', 'Trixie', 'Val', 'Vicky', 'Vicki',
    'Vince', 'Vinny', 'Wally', 'Willie', 'Willy', 'Winnie', 'Wren', 'Yasmin', 'Zac', 'Zachary',
    'Zane', 'Zara', 'Zoe', 'Zoey',
  ];

  const EXTRA_SURNAMES = [
    // International common surnames
    'Patel', 'Sharma', 'Singh', 'Kumar', 'Gupta', 'Verma', 'Mehta', 'Shah', 'Jain', 'Agarwal',
    'Reddy', 'Nair', 'Rao', 'Iyer', 'Menon', 'Pillai', 'Bhat', 'Joshi', 'Kulkarni', 'Desai',
    'Choudhury', 'Chowdhury', 'Banerjee', 'Chatterjee', 'Mukherjee', 'Das', 'Bose', 'Sen', 'Dutta', 'Roy',
    'Kapoor', 'Khanna', 'Malhotra', 'Bhatia', 'Chopra', 'Sinha', 'Mishra', 'Pandey', 'Tiwari', 'Yadav',
    'Khan', 'Ali', 'Hussain', 'Ahmed', 'Rahman', 'Sheikh', 'Siddiqui', 'Malik', 'Qureshi', 'Mirza',
    'Haddad', 'Mansour', 'Khoury', 'Farah', 'Saleh', 'Nasser', 'Hassan', 'Ibrahim', 'Mahmoud', 'Khalil',
    'Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou',
    'Xu', 'Sun', 'Ma', 'Zhu', 'Hu', 'Guo', 'He', 'Lin', 'Luo', 'Gao',
    'Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim',
    'Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato',
    'Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Phan', 'Vu', 'Dang', 'Bui', 'Do',
    'Müller', 'Mueller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz',
    'Hoffmann', 'Schäfer', 'Schaefer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann',
    'Bernard', 'Dubois', 'Laurent', 'Lefebvre', 'Moreau', 'Simon', 'Michel', 'Leroy', 'Roux', 'David',
    'Bertrand', 'Morel', 'Fournier', 'Girard', 'Bonnet', 'Dupont', 'Lambert', 'Fontaine', 'Rousseau', 'Vincent',
    'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco',
    'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Moretti',
    'Kowalski', 'Nowak', 'Wisniewski', 'Wojcik', 'Kowalczyk', 'Kaminski', 'Lewandowski', 'Zielinski', 'Szymanski', 'Wozniak',
    'Ivanov', 'Smirnov', 'Kuznetsov', 'Popov', 'Vasiliev', 'Petrov', 'Sokolov', 'Mikhailov', 'Novikov', 'Fedorov',
    'Murphy', 'Kelly', 'Byrne', 'Ryan', 'Walsh', 'Sullivan', 'Connor', 'Doyle', 'McCarthy', 'Gallagher',
    'Doherty', 'Kennedy', 'Lynch', 'Murray', 'Quinn', 'Moore', 'McLaughlin', 'Carroll', 'Connolly', 'Daly',
    'MacLeod', 'MacDonald', 'Campbell', 'Stewart', 'Robertson', 'Thomson', 'Fraser', 'Reid', 'Scott', 'Hamilton',
    'Davies', 'Evans', 'Thomas', 'Roberts', 'Williams', 'Hughes', 'Edwards', 'Griffiths', 'Morgan', 'Jenkins',
    'Okafor', 'Adeyemi', 'Balogun', 'Mensah', 'Boateng', 'Owusu', 'Appiah', 'Diallo', 'Traore', 'Ndiaye',
    'Silva', 'Santos', 'Ferreira', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins', 'Sousa', 'Fernandes',
    'De Vries', 'Jansen', 'Van Dijk', 'Bakker', 'Janssen', 'Visser', 'Smit', 'Meijer', 'De Boer', 'Mulder',
    'Johansson', 'Andersson', 'Karlsson', 'Nilsson', 'Eriksson', 'Larsson', 'Olsson', 'Persson', 'Svensson', 'Gustafsson',
    'Jensen', 'Nielsen', 'Hansen', 'Pedersen', 'Andersen', 'Christensen', 'Larsen', 'Sorensen', 'Rasmussen', 'Jorgensen',
  ];

  // Formal name <-> common nickname/diminutive groups.
  // Used to auto-link nicknames to senders (e.g. sender "Christopher" + mention "Chris").
  const NICKNAME_GROUPS = [
    ['alexander', 'alex', 'al', 'xander', 'lex'],
    ['alexandra', 'alex', 'lexi', 'lexie', 'sandra', 'sandy'],
    ['samantha', 'sam', 'sammy'],
    ['samuel', 'sam', 'sammy'],
    ['william', 'will', 'bill', 'billy', 'liam', 'willy'],
    ['elizabeth', 'liz', 'lizzie', 'lizzy', 'beth', 'eliza', 'betsy', 'libby'],
    ['michael', 'mike', 'mikey', 'mick', 'micky'],
    ['christopher', 'chris', 'topher', 'kit'],
    ['christina', 'christine', 'chris', 'chrissy', 'tina'],
    ['nicholas', 'nicolas', 'nick', 'nicky', 'nico'],
    ['matthew', 'matt', 'matty'],
    ['katherine', 'catherine', 'kathryn', 'kate', 'katie', 'kat', 'kathy', 'cathy', 'kitty'],
    ['benjamin', 'ben', 'benny', 'benji'],
    ['robert', 'rob', 'robbie', 'bob', 'bobby', 'bert'],
    ['richard', 'rich', 'richie', 'rick', 'ricky', 'dick'],
    ['thomas', 'tom', 'tommy'],
    ['daniel', 'dan', 'danny'],
    ['danielle', 'dani', 'danny'],
    ['james', 'jim', 'jimmy', 'jamie'],
    ['joseph', 'joe', 'joey'],
    ['david', 'dave', 'davey'],
    ['joshua', 'josh'],
    ['andrew', 'andy', 'drew'],
    ['rebecca', 'becca', 'becky'],
    ['jennifer', 'jen', 'jenny', 'jenna'],
    ['jessica', 'jess', 'jessie'],
    ['victoria', 'vicky', 'vicki', 'tori'],
    ['stephanie', 'steph'],
    ['mohammad', 'muhammad', 'mohammed', 'mohamed', 'mo'],
    ['abigail', 'abby', 'abbie'],
    ['gabriel', 'gabe'],
    ['gabriella', 'gabrielle', 'gabby'],
    ['nathaniel', 'nathan', 'nate'],
    ['anthony', 'tony', 'ant'],
    ['edward', 'ed', 'eddie', 'ted', 'teddy'],
    ['charles', 'charlie', 'chuck', 'chaz'],
    ['charlotte', 'lottie', 'charlie'],
    ['margaret', 'maggie', 'meg', 'peggy', 'margo'],
    ['patricia', 'pat', 'patti', 'patty', 'trish', 'trisha'],
    ['patrick', 'pat', 'paddy'],
    ['timothy', 'tim', 'timmy'],
    ['gregory', 'greg'],
    ['stephen', 'steven', 'steve', 'stevie'],
    ['frederick', 'fred', 'freddie', 'freddy'],
    ['zachary', 'zach', 'zack', 'zac'],
    ['oliver', 'ollie'],
    ['eleanor', 'ellie', 'nora'],
    ['madeleine', 'madeline', 'maddy', 'maddie'],
    ['jonathan', 'jon', 'jonny', 'johnny'],
    ['sebastian', 'seb'],
    ['isabella', 'isabelle', 'izzy', 'bella'],
    ['natalie', 'nat'],
    ['philip', 'phillip', 'phil'],
    ['raymond', 'ray'],
    ['kenneth', 'ken', 'kenny'],
    ['lawrence', 'larry'],
    ['donald', 'don', 'donny'],
    ['ronald', 'ron', 'ronnie'],
    ['douglas', 'doug'],
    ['bradley', 'brad'],
    ['cameron', 'cam'],
    ['dominic', 'dom'],
    ['theodore', 'theo', 'ted', 'teddy'],
    ['maximilian', 'maxwell', 'max'],
    ['vincent', 'vince', 'vinny'],
    ['jacqueline', 'jackie'],
    ['deborah', 'debra', 'deb', 'debbie'],
    ['pamela', 'pam'],
    ['valerie', 'val'],
    ['kimberly', 'kim'],
    ['melissa', 'mel'],
    ['melanie', 'mel'],
    ['penelope', 'penny'],
    ['francesca', 'fran', 'frankie'],
    ['veronica', 'ronnie'],
    ['susan', 'suzanne', 'sue', 'suzy'],
    ['cynthia', 'cindy'],
    ['stuart', 'stu'],
    ['kevin', 'kev'],
    ['rachel', 'rach'],
    ['hannah', 'han'],
    ['sophia', 'sophie', 'soph'],
    ['emily', 'em', 'emmie'],
    ['amanda', 'mandy'],
    ['lucy', 'lu'],
    ['louise', 'lou'],
    ['louis', 'lou', 'louie'],
    ['harold', 'harry', 'hal'],
    ['henry', 'harry', 'hank'],
    ['albert', 'al', 'bert', 'bertie'],
    ['alfred', 'alf', 'alfie', 'fred'],
    ['arthur', 'art', 'artie'],
    ['peter', 'pete'],
    ['martin', 'marty'],
    ['mitchell', 'mitch'],
    ['russell', 'russ'],
    ['tobias', 'toby'],
    ['priyanka', 'priya'],
    ['siddharth', 'sid'],
    ['abhishek', 'abhi'],
    ['aditya', 'adi'],
    ['aishwarya', 'ash'],
    ['nikhil', 'nik'],
    ['vikram', 'vik'],
  ];

  // Countries, major regions/states, and world cities / neighborhoods
  const PLACES_UNAMBIGUOUS = [
    // Countries & territories
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
    'Bosnia', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Cambodia', 'Cameroon', 'Canada', 'Chile', 'Colombia',
    'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Denmark', 'Ecuador', 'Egypt', 'Estonia', 'Ethiopia', 'Fiji',
    'Finland', 'France', 'Gambia', 'Germany', 'Ghana', 'Greece', 'Greenland', 'Guatemala', 'Guinea', 'Guyana',
    'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
    'Italy', 'Jamaica', 'Japan', 'Kazakhstan', 'Kenya', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia',
    'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia',
    'Maldives', 'Mali', 'Malta', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
    'Mozambique', 'Myanmar', 'Namibia', 'Nepal', 'Netherlands', 'Nicaragua', 'Nigeria', 'Norway', 'Oman', 'Pakistan',
    'Palestine', 'Panama', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia',
    'Rwanda', 'Samoa', 'Scotland', 'Senegal', 'Serbia', 'Seychelles', 'Singapore', 'Slovakia', 'Slovenia', 'Somalia',
    'Spain', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand',
    'Tunisia', 'Turkmenistan', 'Uganda', 'Ukraine', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia',
    'Zimbabwe', 'England', 'Britain', 'Holland', 'Corsica', 'Sardinia', 'Sicily', 'Crete', 'Majorca', 'Mallorca',
    'Ibiza', 'Menorca', 'Tenerife', 'Lanzarote', 'Madeira', 'Azores', 'Bali', 'Phuket', 'Zanzibar', 'Tahiti',
    'Hawaii', 'Alaska', 'Puerto Rico', 'Costa Rica', 'New Zealand', 'South Africa', 'South Korea', 'North Korea',
    'Saudi Arabia', 'Sri Lanka', 'United Kingdom', 'United States', 'Czech Republic', 'Dominican Republic', 'Hong Kong',
    'Northern Ireland', 'San Marino', 'Sierra Leone', 'Trinidad', 'Tobago', 'UAE', 'UK', 'USA',
    // Major US states, UK counties, regions
    'Alabama', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Idaho', 'Illinois',
    'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
    'Ontario', 'Quebec', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'British Columbia',
    'Queensland', 'Tasmania', 'New South Wales', 'Yorkshire', 'Lancashire', 'Cheshire', 'Cornwall', 'Devon', 'Dorset',
    'Somerset', 'Surrey', 'Sussex', 'Essex', 'Hampshire', 'Berkshire', 'Oxfordshire', 'Cambridgeshire', 'Norfolk', 'Suffolk',
    'Cumbria', 'Northumberland', 'Derbyshire', 'Nottinghamshire', 'Warwickshire', 'Gloucestershire', 'Wiltshire', 'Hertfordshire',
    'Buckinghamshire', 'Middlesex', 'Cotswolds', 'Lake District', 'Peak District', 'Highlands', 'Bavaria', 'Catalonia',
    'Andalusia', 'Tuscany', 'Lombardy', 'Provence', 'Normandy', 'Brittany', 'Alsace', 'Flanders', 'Wallonia',
    'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Gujarat', 'Rajasthan', 'Punjab', 'Haryana', 'Goa', 'Kashmir',
    // Major global cities & neighborhoods
    'London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Sheffield', 'Bristol', 'Newcastle', 'Nottingham', 'Leicester',
    'Coventry', 'Bradford', 'Cardiff', 'Belfast', 'Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Inverness', 'Oxford',
    'Cambridge', 'Brighton', 'Southampton', 'Portsmouth', 'Plymouth', 'Exeter', 'Norwich', 'Durham', 'Canterbury', 'Winchester',
    'Stratford', 'Cheltenham', 'Bournemouth', 'Swansea', 'Milton Keynes', 'Watford', 'Guildford', 'Croydon', 'Kingston',
    'Shoreditch', 'Soho', 'Camden', 'Brixton', 'Hackney', 'Islington', 'Dalston', 'Peckham', 'Greenwich', 'Clapham',
    'Balham', 'Tooting', 'Battersea', 'Wandsworth', 'Putney', 'Fulham', 'Chelsea', 'Kensington', 'Notting Hill', 'Paddington',
    'Marylebone', 'Mayfair', 'Westminster', 'Fitzrovia', 'Bloomsbury', 'Holborn', 'Clerkenwell', 'Hoxton', 'Bethnal Green',
    'Stratford', 'Wembley', 'Hampstead', 'Highgate', 'Crouch End', 'Finsbury Park', 'Stoke Newington', 'Wimbledon', 'Richmond',
    'Chiswick', 'Hammersmith', 'Ealing', 'Acton', 'Shepherd\'s Bush', 'Canary Wharf', 'Bermondsey', 'Southwark', 'Vauxhall',
    'Pimlico', 'Belgravia', 'Knightsbridge', 'Earls Court', 'Whitechapel', 'Stepney', 'Mile End', 'Bow', 'Lewisham',
    'Deptford', 'Dulwich', 'Streatham', 'Tottenham', 'Wood Green', 'Barnet', 'Enfield', 'Romford', 'Ilford', 'Heathrow',
    'Gatwick', 'Stansted', 'Luton',
    'NYC', 'Brooklyn', 'Manhattan', 'Queens', 'Bronx', 'Harlem', 'Williamsburg', 'Bushwick', 'Astoria', 'Tribeca',
    'Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Santa Monica', 'Hollywood', 'Beverly Hills', 'Oakland', 'Berkeley',
    'Palo Alto', 'Mountain View', 'Cupertino', 'Menlo Park', 'Silicon Valley', 'Chicago', 'Houston', 'Dallas', 'Miami', 'Atlanta',
    'Boston', 'Seattle', 'Portland', 'Denver', 'Philadelphia', 'Detroit', 'Minneapolis', 'Nashville', 'New Orleans', 'Las Vegas',
    'Orlando', 'Tampa', 'Pittsburgh', 'Cleveland', 'Cincinnati', 'Indianapolis', 'Columbus', 'Milwaukee', 'Baltimore', 'Raleigh',
    'Sacramento', 'Honolulu', 'Anchorage', 'Salt Lake City', 'San Antonio', 'Kansas City', 'St Louis', 'Albuquerque', 'Tucson',
    'Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Calgary', 'Edmonton', 'Winnipeg', 'Halifax', 'Whistler',
    'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Hobart', 'Gold Coast', 'Bondi', 'Auckland',
    'Wellington', 'Christchurch', 'Queenstown',
    'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille', 'Nantes', 'Strasbourg', 'Montpellier', 'Cannes', 'Montmartre',
    'Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Dusseldorf', 'Leipzig', 'Dresden', 'Nuremberg', 'Heidelberg', 'Bonn',
    'Amsterdam', 'Rotterdam', 'Utrecht', 'Eindhoven', 'Maastricht', 'The Hague', 'Brussels', 'Antwerp', 'Ghent', 'Bruges',
    'Madrid', 'Barcelona', 'Valencia', 'Seville', 'Sevilla', 'Malaga', 'Bilbao', 'Granada', 'Zaragoza', 'Palma', 'San Sebastian',
    'Lisbon', 'Porto', 'Faro', 'Coimbra', 'Algarve', 'Sintra',
    'Rome', 'Milan', 'Milano', 'Naples', 'Turin', 'Florence', 'Firenze', 'Venice', 'Venezia', 'Bologna', 'Verona', 'Genoa', 'Palermo', 'Amalfi', 'Sorrento', 'Capri',
    'Dublin', 'Galway', 'Limerick', 'Waterford', 'Kilkenny', 'Killarney',
    'Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Lucerne', 'Interlaken', 'Zermatt',
    'Vienna', 'Salzburg', 'Innsbruck', 'Graz', 'Prague', 'Brno', 'Budapest', 'Warsaw', 'Krakow', 'Gdansk', 'Wroclaw', 'Poznan',
    'Stockholm', 'Gothenburg', 'Malmo', 'Copenhagen', 'Aarhus', 'Oslo', 'Bergen', 'Trondheim', 'Helsinki', 'Reykjavik',
    'Athens', 'Thessaloniki', 'Santorini', 'Mykonos', 'Rhodes', 'Corfu', 'Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Cappadocia',
    'Bucharest', 'Sofia', 'Belgrade', 'Zagreb', 'Dubrovnik', 'Ljubljana', 'Bratislava', 'Tallinn', 'Riga', 'Vilnius', 'Kyiv', 'Lviv', 'Moscow', 'St Petersburg',
    'Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Hiroshima', 'Nara', 'Okinawa', 'Shibuya', 'Shinjuku',
    'Seoul', 'Busan', 'Incheon', 'Jeju', 'Beijing', 'Shanghai', 'Shenzhen', 'Guangzhou', 'Chengdu', 'Hangzhou', 'Wuhan', 'Nanjing', 'Xi\'an', 'Taipei', 'Macau',
    'Bangkok', 'Chiang Mai', 'Pattaya', 'Krabi', 'Hanoi', 'Ho Chi Minh', 'Saigon', 'Da Nang', 'Kuala Lumpur', 'Penang', 'Jakarta', 'Manila', 'Cebu', 'Phnom Penh',
    'Mumbai', 'Bombay', 'Delhi', 'New Delhi', 'Bengaluru', 'Bangalore', 'Hyderabad', 'Chennai', 'Madras', 'Kolkata', 'Calcutta',
    'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Chandigarh', 'Kochi', 'Cochin', 'Indore', 'Nagpur', 'Bhopal', 'Noida', 'Gurgaon', 'Gurugram',
    'Karachi', 'Lahore', 'Islamabad', 'Dhaka', 'Colombo', 'Kathmandu', 'Thimphu',
    'Dubai', 'Abu Dhabi', 'Sharjah', 'Doha', 'Riyadh', 'Jeddah', 'Muscat', 'Amman', 'Beirut', 'Tel Aviv', 'Jerusalem', 'Haifa', 'Cairo', 'Alexandria', 'Luxor', 'Marrakech', 'Casablanca', 'Fes', 'Tunis', 'Algiers',
    'Lagos', 'Abuja', 'Accra', 'Nairobi', 'Mombasa', 'Kampala', 'Kigali', 'Addis Ababa', 'Dar es Salaam', 'Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Windhoek', 'Gaborone',
    'Mexico City', 'Cancun', 'Guadalajara', 'Monterrey', 'Tulum', 'Oaxaca', 'Playa del Carmen', 'Bogota', 'Medellin', 'Cartagena', 'Cali',
    'Quito', 'Guayaquil', 'Cusco', 'Santiago', 'Valparaiso', 'Buenos Aires', 'Cordoba', 'Mendoza', 'Montevideo', 'Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador', 'Florianopolis', 'Havana', 'Kingston', 'San Juan',
  ];

  // Places that are also everyday English words or personal names:
  // ONLY matched when capitalized AND either in location context ("in Bath")
  // or mid-sentence (never lowercase, never at sentence start without cue).
  const PLACES_AMBIGUOUS = new Set([
    'Bath', 'Reading', 'Deal', 'Nice', 'Split', 'Mobile', 'Normal', 'Orange', 'Cork', 'Hull',
    'York', 'Kent', 'Wales', 'Turkey', 'China', 'Jordan', 'Chad', 'Georgia', 'Victoria', 'Regina',
    'Lima', 'Tours', 'Pisa', 'Como', 'Rye', 'Wells', 'Poole', 'Bury', 'Sale', 'Ware',
    'March', 'Hook', 'Fleet', 'Battle', 'Sandwich', 'Phoenix', 'Buffalo', 'Mesa', 'Lincoln', 'Madison',
    'Jackson', 'Austin', 'Charlotte', 'Savannah', 'Helena', 'Augusta', 'Salem', 'Eugene', 'Bend', 'Flint',
    'Derby', 'Chester', 'Preston', 'Bolton', 'Sutton', 'Merton', 'Brent', 'Tower', 'Forest', 'Park',
    'Green', 'Heath', 'Bridge', 'Cross', 'Fields', 'Hills', 'Grove', 'Vale', 'Bank', 'Angel',
    'Temple', 'Oval', 'Strand', 'Borough', 'Marble', 'Arch', 'Bond', 'Baker', 'Warren', 'Russell',
    'Euston', 'Charing', 'Waterloo', 'Vauxhall', 'Liverpool', 'Victoria', 'Paddington',
  ]);

  // Well-known organizations / employers / institutions (case-sensitive for ambiguous ones)
  const ORGS_UNAMBIGUOUS = [
    'Google', 'Alphabet', 'Microsoft', 'Amazon', 'Netflix', 'Spotify', 'Airbnb', 'Deliveroo', 'DoorDash',
    'Instacart', 'Shopify', 'Stripe', 'PayPal', 'Klarna', 'Monzo', 'Revolut', 'Starling', 'Wise', 'TransferWise',
    'Barclays', 'HSBC', 'Lloyds', 'NatWest', 'Santander', 'Citibank', 'JPMorgan', 'Goldman Sachs', 'Morgan Stanley',
    'BlackRock', 'Vanguard', 'Fidelity', 'Deloitte', 'PwC', 'KPMG', 'McKinsey', 'Accenture', 'Capgemini', 'Palantir',
    'Databricks', 'Snowflake', 'Cloudflare', 'Atlassian', 'Salesforce', 'HubSpot', 'Zendesk', 'Twilio', 'Slack',
    'OpenAI', 'Anthropic', 'DeepMind', 'NVIDIA', 'Intel', 'Qualcomm', 'Samsung', 'Sony', 'Nintendo', 'Siemens',
    'Bosch', 'Airbus', 'Boeing', 'Tesla', 'SpaceX', 'Toyota', 'Honda', 'BMW', 'Mercedes', 'Volkswagen', 'Porsche',
    'Pfizer', 'AstraZeneca', 'Novartis', 'Roche', 'GSK', 'Johnson & Johnson', 'Unilever', 'Nestle', 'L\'Oreal',
    'NHS', 'BBC', 'ITV', 'CNN', 'Reuters', 'Bloomberg', 'Forbes', 'Guardian', 'Economist', 'NYT',
    'Tesco', 'Sainsbury\'s', 'Sainsburys', 'Waitrose', 'Asda', 'Aldi', 'Lidl', 'Morrisons', 'Costco', 'Walmart',
    'IKEA', 'Zara', 'Uniqlo', 'Primark', 'Sephora', 'Starbucks', 'Pret', 'Nando\'s', 'Nandos', 'McDonald\'s',
    'McDonalds', 'Greggs', 'Wetherspoons', 'Spoons', 'Dishoom', 'Wagamama', 'Five Guys', 'Chipotle', 'Subway',
    'Ryanair', 'EasyJet', 'British Airways', 'Lufthansa', 'Emirates', 'Delta', 'United Airlines', 'Eurostar', 'TfL',
    'UCL', 'LSE', 'KCL', 'MIT', 'Caltech', 'Stanford', 'Harvard', 'Yale', 'Princeton', 'Columbia', 'Berkeley',
    'Cornell', 'NYU', 'UCLA', 'Oxbridge', 'Imperial College', 'Oxford University', 'Cambridge University',
    'Uber', 'Lyft', 'Bolt', 'LinkedIn', 'Instagram', 'TikTok', 'Snapchat', 'Facebook', 'WhatsApp', 'Telegram',
  ];

  // Organizations that are also common words (only matched in org context like "work at Apple/Meta/Target")
  const ORGS_CONTEXT_ONLY = new Set([
    'Apple', 'Meta', 'Target', 'Shell', 'Oracle', 'Square', 'Chase', 'Virgin', 'Orange', 'Three',
    'Sky', 'Boots', 'Next', 'Gap', 'Coach', 'Diesel', 'Mango', 'Guess', 'Mint', 'Robinhood',
    'Notion', 'Linear', 'Figma', 'Canva', 'Discord', 'Reddit', 'Twitch', 'Zoom', 'Box', 'Snap',
  ]);

  // Everyday English words, chat slang, days, months, holidays, languages —
  // excluded from contextual NER & "Potential Leaks" suspect scanning.
  const COMMON_WORDS = new Set([
    // Days, months, seasons, holidays
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
    'mon', 'tue', 'tues', 'wed', 'thu', 'thur', 'thurs', 'fri', 'sat', 'sun',
    'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december',
    'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec',
    'spring', 'summer', 'autumn', 'winter', 'fall',
    'christmas', 'xmas', 'easter', 'halloween', 'thanksgiving', 'diwali', 'eid', 'hanukkah', 'ramadan', 'passover', 'valentine', 'valentines', 'new', 'year', 'eve', 'boxing', 'day',
    // Languages & nationalities (general)
    'english', 'spanish', 'french', 'german', 'italian', 'portuguese', 'dutch', 'polish', 'russian', 'arabic', 'hindi', 'urdu', 'bengali', 'punjabi', 'tamil', 'chinese', 'mandarin', 'cantonese', 'japanese', 'korean', 'vietnamese', 'thai', 'turkish', 'greek', 'swedish', 'norwegian', 'danish', 'finnish', 'irish', 'welsh', 'scottish', 'british', 'american', 'canadian', 'australian', 'indian', 'asian', 'european', 'african', 'latin', 'mexican', 'brazilian', 'italian', 'thai', 'greek', 'lebanese', 'ethiopian', 'moroccan', 'persian', 'korean', 'japanese', 'chinese', 'vietnamese', 'turkish',
    // Chat slang, acronyms, greetings, exclamations
    'omg', 'omfg', 'lol', 'lmao', 'lmfao', 'rofl', 'haha', 'hahaha', 'hahahaha', 'hehe', 'hehehe', 'bahaha', 'ahah', 'ahaha',
    'brb', 'gtg', 'ttyl', 'idk', 'imo', 'imho', 'tbh', 'ngl', 'fyi', 'asap', 'smh', 'wtf', 'wth', 'nvm', 'irl', 'dm', 'dms',
    'pm', 'am', 'ok', 'okay', 'oke', 'yup', 'yep', 'nope', 'nah', 'yeah', 'yea', 'yay', 'yey', 'woohoo', 'whoa', 'woah',
    'aww', 'awww', 'ugh', 'meh', 'oof', 'rip', 'ffs', 'af', 'atm', 'btw', 'diy', 'eta', 'faq', 'fomo', 'goat', 'hbd', 'ily',
    'jk', 'np', 'oop', 'oops', 'pls', 'plz', 'rn', 'sry', 'thx', 'tysm', 'ty', 'vip', 'wfh', 'yolo', 'yw', 'aka', 'etc',
    'pdf', 'jpg', 'png', 'gif', 'mp3', 'mp4', 'zip', 'doc', 'url', 'wifi', 'gps', 'usb', 'sim', 'pin', 'atm', 'tv', 'pc', 'mac', 'ios', 'iphone', 'ipad', 'airpods', 'android', 'pixel', 'ps5', 'xbox', 'switch',
    'hey', 'hi', 'hello', 'yo', 'sup', 'hiya', 'howdy', 'oi', 'oy', 'morning', 'afternoon', 'evening', 'night', 'goodnight', 'bye', 'goodbye', 'cya', 'later', 'cheers', 'thanks', 'thank', 'sorry', 'please', 'welcome', 'congrats', 'congratulations',
    // Kinship / informal vocatives (not unique identifying names unless user adds them)
    'mate', 'mates', 'dude', 'bro', 'bros', 'bruh', 'sis', 'guy', 'guys', 'girl', 'girls', 'folk', 'folks', 'team', 'everyone', 'everybody', 'anyone', 'anybody', 'someone', 'somebody', 'all', 'yall', 'fam', 'gang', 'crew', 'squad', 'pals', 'buddy', 'bud', 'pal', 'friend', 'friends', 'bestie', 'babe', 'baby', 'hun', 'hon', 'honey', 'love', 'lovely', 'darling', 'sweetie', 'sweetheart', 'dear', 'man', 'men', 'woman', 'women', 'people', 'person', 'boss', 'chief', 'champ', 'legend', 'king', 'queen', 'sir', 'madam', 'maam', 'lad', 'lads', 'lass',
    // Common pronouns, determiners, prepositions, verbs, adjectives, nouns
    'i', 'me', 'my', 'mine', 'myself', 'you', 'your', 'yours', 'yourself', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'we', 'us', 'our', 'ours', 'ourselves', 'they', 'them', 'their', 'theirs', 'themselves',
    'the', 'a', 'an', 'this', 'that', 'these', 'those', 'some', 'any', 'no', 'none', 'every', 'each', 'either', 'neither', 'both', 'many', 'much', 'more', 'most', 'few', 'little', 'other', 'another', 'such', 'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how',
    'and', 'or', 'but', 'nor', 'for', 'yet', 'so', 'if', 'then', 'else', 'because', 'since', 'while', 'whilst', 'although', 'though', 'unless', 'until', 'till', 'before', 'after', 'once', 'whether',
    'in', 'on', 'at', 'to', 'from', 'by', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'above', 'below', 'under', 'over', 'again', 'further', 'here', 'there', 'out', 'off', 'up', 'down', 'away', 'back', 'near', 'around', 'across', 'behind', 'beside', 'beyond', 'inside', 'outside', 'within', 'without',
    'be', 'am', 'is', 'are', 'was', 'were', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'done', 'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must', 'need', 'needs', 'dare', 'ought', 'used',
    'get', 'gets', 'got', 'gotten', 'getting', 'go', 'goes', 'went', 'gone', 'going', 'come', 'comes', 'came', 'coming', 'make', 'makes', 'made', 'making', 'take', 'takes', 'took', 'taken', 'taking', 'see', 'sees', 'saw', 'seen', 'seeing', 'know', 'knows', 'knew', 'known', 'think', 'thinks', 'thought', 'feel', 'feels', 'felt', 'look', 'looks', 'looked', 'want', 'wants', 'wanted', 'give', 'gives', 'gave', 'given', 'use', 'uses', 'find', 'finds', 'found', 'tell', 'tells', 'told', 'ask', 'asks', 'asked', 'work', 'works', 'worked', 'working', 'seem', 'seems', 'try', 'tries', 'tried', 'leave', 'leaves', 'left', 'call', 'calls', 'called', 'keep', 'keeps', 'kept', 'let', 'lets', 'begin', 'begins', 'help', 'helps', 'talk', 'talks', 'turn', 'turns', 'start', 'starts', 'show', 'shows', 'hear', 'hears', 'heard', 'play', 'plays', 'run', 'runs', 'move', 'moves', 'live', 'lives', 'believe', 'believes', 'hold', 'holds', 'bring', 'brings', 'happen', 'happens', 'write', 'writes', 'provide', 'provides', 'sit', 'sits', 'stand', 'stands', 'lose', 'loses', 'pay', 'pays', 'meet', 'meets', 'include', 'includes', 'continue', 'continues', 'set', 'sets', 'learn', 'learns', 'change', 'changes', 'lead', 'leads', 'understand', 'understands', 'watch', 'watches', 'follow', 'follows', 'stop', 'stops', 'create', 'creates', 'speak', 'speaks', 'read', 'reads', 'allow', 'allows', 'add', 'adds', 'spend', 'spends', 'grow', 'grows', 'open', 'opens', 'walk', 'walks', 'win', 'wins', 'offer', 'offers', 'remember', 'remembers', 'consider', 'considers', 'appear', 'appears', 'buy', 'buys', 'wait', 'waits', 'serve', 'serves', 'die', 'dies', 'send', 'sends', 'expect', 'expects', 'build', 'builds', 'stay', 'stays', 'cut', 'cuts', 'reach', 'reaches', 'kill', 'kills', 'remain', 'remains', 'suggest', 'suggests', 'raise', 'raises', 'pass', 'passes', 'sell', 'sells', 'require', 'requires', 'report', 'reports', 'decide', 'decides', 'pull', 'pulls', 'check', 'checks', 'book', 'books', 'booked', 'booking', 'cancel', 'fixed', 'packing', 'grabbing', 'running', 'leaving', 'starving', 'deserve', 'plan', 'plans', 'save', 'saves', 'eat', 'eats', 'ate', 'drink', 'drinks', 'drank', 'sleep', 'sleeps', 'slept', 'wake', 'wakes', 'woke', 'drive', 'drives', 'drove', 'fly', 'flies', 'flew', 'ride', 'rides', 'rode', 'miss', 'misses', 'missed', 'hate', 'hates', 'hated', 'like', 'likes', 'liked', 'love', 'loves', 'loved', 'hope', 'hopes', 'wish', 'wishes', 'guess', 'suppose', 'mean', 'means', 'meant', 'pick', 'picks', 'picked', 'drop', 'drops', 'dropped', 'catch', 'catches', 'caught', 'throw', 'throws', 'threw', 'wear', 'wears', 'wore', 'wash', 'clean', 'cook', 'cooks', 'bake', 'order', 'ordered', 'deliver', 'delivered', 'share', 'shared', 'post', 'posted', 'text', 'texted', 'reply', 'replied', 'message', 'messaged', 'join', 'joined', 'visit', 'visited', 'travel', 'landed', 'arrived', 'say', 'says', 'said', 'tour', 'tours', 'chat', 'chats', 'list', 'guide', 'notes', 'trip', 'trips',
    'good', 'great', 'best', 'better', 'nice', 'fine', 'cool', 'awesome', 'amazing', 'wonderful', 'fantastic', 'brilliant', 'lovely', 'perfect', 'happy', 'glad', 'excited', 'fun', 'funny', 'cute', 'sweet', 'pretty', 'beautiful', 'hot', 'cold', 'warm', 'bad', 'worse', 'worst', 'sad', 'mad', 'angry', 'tired', 'busy', 'free', 'ready', 'sure', 'true', 'false', 'real', 'fake', 'right', 'wrong', 'fair', 'easy', 'hard', 'fast', 'quick', 'slow', 'early', 'late', 'long', 'short', 'big', 'small', 'large', 'huge', 'tiny', 'tall', 'high', 'low', 'old', 'young', 'fresh', 'clean', 'dirty', 'full', 'empty', 'open', 'closed', 'same', 'different', 'next', 'last', 'first', 'second', 'third', 'only', 'just', 'still', 'already', 'even', 'also', 'too', 'very', 'really', 'quite', 'pretty', 'super', 'totally', 'actually', 'basically', 'literally', 'seriously', 'honestly', 'definitely', 'probably', 'maybe', 'perhaps', 'almost', 'nearly', 'always', 'never', 'ever', 'often', 'sometimes', 'usually', 'soon', 'now', 'today', 'tomorrow', 'yesterday', 'tonight', 'weekend', 'week', 'month', 'hour', 'hours', 'minute', 'minutes', 'second', 'seconds', 'time', 'times', 'day', 'days', 'years',
    'yes', 'not', 'dont', 'cant', 'wont', 'didnt', 'doesnt', 'isnt', 'arent', 'wasnt', 'werent', 'hasnt', 'havent', 'hadnt', 'wouldnt', 'couldnt', 'shouldnt', 'im', 'ive', 'id', 'ill', 'youre', 'youve', 'youd', 'youll', 'hes', 'shes', 'its', 'were', 'weve', 'wed', 'well', 'theyre', 'theyve', 'theyd', 'theyll', 'thats', 'whats', 'whos', 'heres', 'theres', 'lets',
    'home', 'house', 'flat', 'apartment', 'room', 'office', 'work', 'school', 'uni', 'college', 'gym', 'shop', 'store', 'market', 'cafe', 'coffee', 'tea', 'pub', 'bar', 'club', 'restaurant', 'hotel', 'hostel', 'airport', 'station', 'train', 'bus', 'tube', 'metro', 'taxi', 'car', 'bike', 'flight', 'flights', 'trip', 'holiday', 'vacation', 'beach', 'park', 'city', 'town', 'village', 'street', 'road', 'area', 'place', 'spot', 'party', 'dinner', 'lunch', 'breakfast', 'brunch', 'drinks', 'food', 'pizza', 'ramen', 'tacos', 'sushi', 'curry', 'burger', 'pasta', 'salad', 'cake', 'bread', 'cheese', 'wine', 'beer', 'water', 'milk', 'espresso', 'latte', 'matcha', 'croissant', 'movie', 'film', 'show', 'series', 'music', 'song', 'album', 'concert', 'gig', 'game', 'match', 'ticket', 'tickets', 'book', 'phone', 'laptop', 'computer', 'email', 'link', 'photo', 'pic', 'pics', 'picture', 'video', 'file', 'doc', 'money', 'cash', 'card', 'bank', 'rent', 'bill', 'bills', 'tax', 'price', 'cost', 'deal', 'plan', 'plans', 'idea', 'news', 'update', 'story', 'joke', 'thing', 'things', 'stuff', 'way', 'part', 'kind', 'sort', 'type', 'bit', 'lot', 'lots', 'bunch', 'couple', 'half', 'whole', 'rest', 'end', 'start', 'top', 'bottom', 'side', 'front', 'back', 'middle', 'center', 'centre', 'point', 'line', 'word', 'words', 'name', 'names', 'number', 'date', 'weather', 'rain', 'sun', 'snow', 'wind', 'dog', 'cat', 'pet', 'god', 'jesus', 'christ', 'lord', 'hell', 'damn', 'crap', 'shit', 'fuck', 'bitch', 'ass',
    // WhatsApp system boilerplate words
    'media', 'omitted', 'attached', 'deleted', 'edited', 'message', 'messages', 'calls', 'encrypted', 'whatsapp', 'group', 'subject', 'icon', 'description', 'invite', 'admin', 'security', 'code', 'changed', 'created', 'added', 'removed', 'joined', 'using', 'this', 'live', 'location', 'shared', 'missed', 'voice', 'video', 'call', 'audio', 'sticker', 'image', 'document', 'contact', 'vcard', 'poll', 'null',
  ]);

  // Fake realistic stand-in pools (distinct, natural, never overlapping)
  const FAKE_PEOPLE = [
    'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Skyler', 'Rowan', 'Cameron',
    'Jamie', 'Devon', 'Kendall', 'Reese', 'Sage', 'Hayden', 'Parker', 'Emerson', 'Finley', 'Blake',
    'Dakota', 'Harper', 'Marley', 'Peyton', 'Remy', 'Sawyer', 'Tatum', 'Wren', 'Ellis', 'Frankie',
    'Jules', 'Kit', 'Nico', 'Sasha', 'Val', 'Robin', 'Sammy', 'Charlie', 'Alexi', 'Kerry',
    'Drew', 'Rory', 'Shay', 'Toby', 'Bryn', 'Ash', 'Corey', 'Darcy', 'Eden', 'Glen',
    'Hollis', 'Indigo', 'Joss', 'Kieran', 'Lane', 'Micah', 'Noel', 'Oakley', 'Perry', 'Quincy',
  ];

  const FAKE_PLACES = [
    'Riverton', 'Oakvale', 'Westbrook', 'Pinecrest', 'Ashford', 'Meadowbrook', 'Silverton', 'Clearwater',
    'Northgate', 'Mapleton', 'Cedar Falls', 'Harborview', 'Brookside', 'Lakewood', 'Fairview', 'Millbrook',
    'Stonebridge', 'Sunridge', 'Crestwood', 'Alderney', 'Briarwood', 'Glenhaven', 'Redcliff', 'Eastport',
    'Willowby', 'Highfield', 'Foxborough', 'Bayview', 'Elmwood', 'Fernvale', 'Larkspur', 'Thornhill',
  ];

  const FAKE_STREETS = [
    '14 Maple Street', '28 Cedar Lane', '7 Oak Avenue', '42 Birch Road', '19 Willow Close',
    '83 Pine Drive', '5 Elm Terrace', '61 Brook Way', '30 Meadow Court', '12 Ash Gardens',
  ];

  const FAKE_ORGS = [
    'Northstar', 'Meridian', 'Crestline', 'Alderbrook', 'Solstice', 'Bluepine', 'Keystone', 'Redwood',
    'Horizon', 'Summit', 'Beacon', 'Vanguardia', 'Clearpath', 'Ironwood', 'Lumen', 'Vertex',
    'Cobalt', 'Halcyon', 'Stratos', 'Evergreen', 'Kestrel', 'Oakridge', 'Silverline', 'Wayfarer',
  ];

  const FAKE_GROUPS = [
    'The Group Chat', 'Weekend Crew', 'Side Quest', 'Main Chat', 'Planning Thread', 'Random Chat',
    'Catch-Up Crew', 'Late Night Chat', 'Squad Chat', 'Good Vibes Only',
  ];

  // Build fast lookup sets once at module load
  const AMBIGUOUS_NAMES = new Set(NAMES.AMBIGUOUS || []);
  // Add a few extra ambiguous words from our expanded lists so prose stays safe
  [
    'Ash', 'Bay', 'Bo', 'Cam', 'Connie', 'Dale', 'Dean', 'Drew', 'Em', 'Eve', 'Faye', 'Finn',
    'Glen', 'Gus', 'Han', 'He', 'Hu', 'In', 'Iva', 'Jack', 'Jan', 'Jay', 'Jin', 'Jude', 'Kai',
    'Kay', 'Kit', 'Lan', 'Lane', 'Le', 'Lee', 'Lei', 'Li', 'Lin', 'Long', 'Lou', 'Lu', 'Ma',
    'Mai', 'Max', 'Mel', 'Min', 'Mo', 'Nat', 'Noel', 'Page', 'Pam', 'Park', 'Pat', 'Penny',
    'Phil', 'Ping', 'Poppy', 'Quinn', 'Ray', 'Reed', 'Ren', 'Rich', 'Rob', 'Robin', 'Rose',
    'Roy', 'Ruby', 'Russ', 'Sage', 'Sal', 'Sandy', 'Sen', 'Shan', 'Shin', 'Shun', 'Sid', 'Sky',
    'Sora', 'Sue', 'Summer', 'Sun', 'Sunny', 'Tao', 'Ted', 'Thu', 'Tran', 'Uma', 'Val', 'Van',
    'Vic', 'Vu', 'Wade', 'Ward', 'Way', 'Wei', 'Wen', 'Will', 'Wim', 'Wren', 'Wu', 'Xin',
    'Xu', 'Yan', 'Yang', 'Yi', 'Young', 'Yu',
  ].forEach((n) => AMBIGUOUS_NAMES.add(n));

  const FIRST_NAME_SET = new Set();
  const SURNAME_SET = new Set();
  const ALL_NAME_CANON = new Map(); // lowercase -> canonical

  for (const n of (NAMES.FIRST_NAMES || []).concat(EXTRA_FIRST_NAMES)) {
    const lo = n.toLowerCase();
    FIRST_NAME_SET.add(lo);
    if (!ALL_NAME_CANON.has(lo)) ALL_NAME_CANON.set(lo, n);
  }
  for (const n of (NAMES.SURNAMES || []).concat(EXTRA_SURNAMES)) {
    const lo = n.toLowerCase();
    SURNAME_SET.add(lo);
    if (!ALL_NAME_CANON.has(lo)) ALL_NAME_CANON.set(lo, n);
  }

  // Nickname lookup: lower -> Set<lower> of related nicknames/formals
  const NICKNAME_MAP = new Map();
  for (const grp of NICKNAME_GROUPS) {
    for (const a of grp) {
      if (!NICKNAME_MAP.has(a)) NICKNAME_MAP.set(a, new Set());
      for (const b of grp) {
        if (b !== a) NICKNAME_MAP.get(a).add(b);
      }
    }
  }

  // Place lookups (single-word & multi-word)
  const PLACE_SINGLE = new Map(); // lower -> canonical
  const PLACE_MULTI = [];         // canonical multi-word places
  for (const p of PLACES_UNAMBIGUOUS) {
    if (/\s/.test(p)) PLACE_MULTI.push(p);
    else if (!PLACE_SINGLE.has(p.toLowerCase())) PLACE_SINGLE.set(p.toLowerCase(), p);
  }
  const PLACE_AMBIG_LOWER = new Set(Array.from(PLACES_AMBIGUOUS).map((p) => p.toLowerCase()));

  // Org lookups
  const ORG_SINGLE = new Map();
  const ORG_MULTI = [];
  for (const o of ORGS_UNAMBIGUOUS) {
    if (/\s/.test(o)) ORG_MULTI.push(o);
    else if (!ORG_SINGLE.has(o.toLowerCase())) ORG_SINGLE.set(o.toLowerCase(), o);
  }
  const ORG_CONTEXT_LOWER = new Set(Array.from(ORGS_CONTEXT_ONLY).map((o) => o.toLowerCase()));

  /* ========================================================================
   * 2. STRUCTURED REGEX PATTERNS
   * ======================================================================== */

  const RE_URL = /\b(?:https?:\/\/|www\.)[^\s<>()"'\]\[]+(?<![.,;:!?)\]])|\b(?:maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google\.[a-z.]+|maps\.apple\.com|bit\.ly|tinyurl\.com|wa\.me|t\.me|youtu\.be|instagram\.com|linkedin\.com|facebook\.com|fb\.com|x\.com|twitter\.com|tiktok\.com|github\.com|airbnb\.[a-z.]+|booking\.com)\/[^\s<>()"'\]\[]+(?<![.,;:!?)\]])/gi;
  const RE_MAP_URL = /(?:maps\.app\.goo\.gl|goo\.gl\/maps|google\.[a-z.]+\/maps|maps\.google\.|maps\.apple\.com|waze\.com|openstreetmap\.org|what3words\.com)/i;
  const RE_EMAIL = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  // International & local formatted phones (8-15 digits, rejects dates like 12/05/2025 or 2025-05-12)
  const RE_PHONE = /(?<![\p{L}\p{N}_/.-])(?:\+\d{1,3}[\s.-]?(?:\(\d{1,4}\)[\s.-]?)?(?:\d[\s.-]?){7,13}\d|\(\d{2,5}\)[\s.-]?\d{3,4}[\s.-]?\d{3,5}|07\d{3}[\s.-]?\d{6}|0\d{2,4}[\s.-]\d{3,4}[\s.-]\d{3,4}|(?:\d{3}[-.\s]\d{3}[-.\s]\d{4}))(?![\p{L}\p{N}_/.-])/gu;
  // WhatsApp @phone mentions like @447700900123 or @14155550199
  const RE_WA_PHONE_MENTION = /(?<![\p{L}\p{N}_])@\d{8,15}\b/gu;
  // Social @handles (not part of email, starts with letter, >=2 chars)
  const RE_HANDLE = /(?<![\p{L}\p{N}_.%+-])@[A-Za-z][A-Za-z0-9._-]{1,29}(?<![._-])(?![\p{L}\p{N}_])/gu;
  // UK postcode (e.g. SW1A 1AA, E1 6AN, M1 1AE, EC2A 4NE)
  const RE_UK_POSTCODE = /\b(?:[A-PR-UWYZ][A-HK-Y]?\d[A-Z\d]?)\s?\d[ABD-HJLNP-UW-Z]{2}\b/g;
  // Canadian postcode (e.g. M5V 3L9)
  const RE_CA_POSTCODE = /\b[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\s?\d[ABCEGHJ-NPRSTV-Z]\d\b/g;
  // US State + 5-digit ZIP (e.g. CA 94107, NY 10001-1234)
  const RE_US_ZIP = /\b(?:AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC)\s+\d{5}(?:-\d{4})?\b/g;
  // GPS coordinates (e.g. 51.5074, -0.1278)
  const RE_COORDS = /(?<![\d.-])-?(?:[1-8]?\d\.\d{4,7})\s*,\s*-?(?:1[0-7]\d|[1-9]?\d)\.\d{4,7}\b/g;
  // Street addresses (number + 1-3 capitalized words + street suffix)
  const RE_STREET_ADDR = /\b(?:(?:Flat|Apt|Apartment|Suite|Unit|Room)\s+[A-Z0-9-]+,?\s*)?\d{1,5}[A-Za-z]?\s+(?:[A-Z][A-Za-z'’-]+\s+){1,3}(?:Street|St\.?|Road|Rd\.?|Avenue|Ave\.?|Lane|Ln\.?|Drive|Dr\.?|Close|Crescent|Cres\.?|Terrace|Place|Pl\.?|Square|Sq\.?|Gardens|Gdns\.?|Way|Court|Ct\.?|Boulevard|Blvd\.?|Parkway|Pkwy\.?|Row|Mews|Walk|Rise|Hill|Grove|Circus|Parade|Broadway|Embankment)\b/g;
  // Auto-generated WhatsApp media filenames (grouped into one clean pattern rule so 5,000 IMG-* files don't clutter the UI)
  const RE_WA_AUTO_FILENAME = /\b(?:(?:IMG|VID|PTT|AUD|DOC|STK|PHOTO|VIDEO|AUDIO)[-_]\d[A-Za-z0-9._-]{2,}|\d{6,10}-(?:PHOTO|VIDEO|AUDIO|STICKER|DOCUMENT)-[A-Za-z0-9._-]{4,})\.(?:jpe?g|png|gif|webp|heic|heif|mp4|mov|mkv|avi|webm|3gp|mp3|wav|m4a|ogg|opus|aac|pdf|docx?|xlsx?|pptx?|vcf|zip)\b/gi;
  // Custom / user-named attachment filenames (no greedy spaces so preceding words like "and " are never swallowed)
  const RE_FILENAME = /(?<![/\w@])([A-Za-z0-9][A-Za-z0-9._-]{1,60}\.(?:jpe?g|png|gif|webp|heic|heif|bmp|svg|mp4|mov|mkv|avi|webm|3gp|mp3|wav|m4a|ogg|opus|aac|flac|pdf|docx?|xlsx?|pptx?|csv|txt|rtf|odt|vcf|zip|rar|7z|tar|gz))\b/gi;
  // Sensitive numeric IDs: SSN, UK NINO, IBAN, 16-digit card, UK sort code + account
  const RE_SENSITIVE_ID = /\b(?:\d{3}-\d{2}-\d{4}|[A-CEGHJ-PR-TW-Z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]|[A-Z]{2}\d{2}\s?(?:[A-Z0-9]{4}\s?){3,6}[A-Z0-9]{1,4}|\d{4}[\s-]\d{4}[\s-]\d{4}[\s-]\d{4}|\d{2}-\d{2}-\d{2}\s+\d{8})\b/g;

  // Protected WhatsApp boilerplate (never redacted so re-parsing stays 100% faithful)
  const RE_WA_PROTECTED = /<Media omitted>|<This message was edited>|This message was deleted|You deleted this message|Messages and calls are end-to-end encrypted\.[^\n]*|\(file attached\)|<attached:[^>]+>/gi;

  // Group subject lines in WhatsApp system entries
  const RE_GROUP_SUBJECT_CHANGE = /(?:changed the subject|changed the group name)(?:\s+from\s+["“](.+?)["”])?\s+to\s+["“](.+?)["”]/i;
  const RE_GROUP_CREATED = /created group\s+["“](.+?)["”]/i;
  // System line person actions: "Alex added Sam", "Sam removed Priya", "Priya left"
  const RE_SYS_ACTION = /^(.+?)\s+(?:added|removed)\s+(.+?)\.?$/i;
  const RE_SYS_SINGLE = /^(.+?)\s+(?:left|joined using this group['’]s invite link|changed the subject|changed the group|created group|changed this group['’]s icon|deleted this group['’]s icon|is now an admin)/i;

  // Contextual NER patterns
  const RE_HONORIFIC = /\b(?:Mr\.?|Mrs\.?|Ms\.?|Miss|Dr\.?|Prof\.?|Professor|Sir|Lady|Uncle|Aunt|Auntie|Aunty|Cousin|Grandma|Grandpa|Nana|Babu)\s+([A-Z][\p{L}'’-]{1,24}(?:\s+[A-Z][\p{L}'’-]{1,24})?)/gu;
  const RE_RELATIONSHIP = /\b(?:my|our|his|her|their)\s+(?:friend|bestie|boss|manager|colleague|coworker|co-worker|flatmate|roommate|housemate|partner|boyfriend|girlfriend|bf|gf|husband|wife|fianc[eé]e?|brother|sister|dad|mum|mom|therapist|doctor|dentist|landlord|landlady|neighbou?r|cousin|tutor|teacher|coach|mentor|ex)\s+([A-Z][\p{L}'’-]{2,22}(?:\s+[A-Z][\p{L}'’-]{2,22})?)/gu;
  const RE_PLACE_CONTEXT = /\b(?:live|living|lived|moved|moving|stay|staying|stayed|based|born|grew up|fly|flying|flew|drive|driving|drove|head|heading|headed|go|going|went|trip|holiday|vacation|visit|visiting|visited|arrived|landing|landed|meet|meeting|met|dinner|lunch|drinks|coffee|pub|gym|office|flat|house|apartment|hotel|hostel|train|flight|bus|near|around|outside)\s+(?:in|to|at|near|from|around|by|outside)\s+(?:the\s+)?([A-Z][\p{L}'’-]{2,22}(?:\s+(?:of|the|on|in|de|la|du|St\.?)\s+[A-Z][\p{L}'’-]{2,22}|\s+[A-Z][\p{L}'’-]{2,22}){0,2})/gu;
  const RE_VENUE_SUFFIX = /\b((?:St\.?\s+)?[A-Z][\p{L}'’-]{1,20}(?:\s+[A-Z][\p{L}'’-]{1,20}){0,2}\s+(?:Airport|Station|Terminal|Park|Bridge|Pier|Beach|Hospital|Clinic|Surgery|Pharmacy|Hotel|Hostel|Resort|Mall|Centre|Center|Market|Plaza|Tower|Gardens|Square|Museum|Gallery|Theatre|Theater|Cinema|Stadium|Arena|Cathedral|Church|Mosque|Temple|Pub|Bar|Cafe|Café|Bistro|Bakery|Kitchen|Grill|Restaurant|Club|Gym|Fitness|Harbour|Harbor|Bay|Island|Lake|River|Mountain|Valley|Heights|Village))\b/gu;
  const RE_ORG_SUFFIX = /\b([A-Z][\p{L}0-9&'’-]{1,20}(?:\s+[A-Z&][\p{L}0-9&'’-]{0,20}){0,3}\s+(?:Ltd\.?|LLC|Inc\.?|Corp\.?|PLC|GmbH|AG|LLP|Group|Holdings|Technologies|Tech|Labs|Studios|Consulting|Partners|Capital|Ventures|Bank|Airlines|Airways|University|College|School|Academy|Institute|Foundation|Trust|Council|Authority|Department|Ministry|Agency|Media|Press|Solutions|Systems|Networks|Global|International))\b/gu;
  const RE_ORG_CONTEXT = /\b(?:work|working|worked|job|interview|interviewing|offer|intern|internship|hired|fired|quit|joined|study|studying|studied|graduated)\s+(?:at|for|from)\s+([A-Z][\p{L}0-9&'’-]{2,22}(?:\s+[A-Z][\p{L}0-9&'’-]{2,22}){0,2})/gu;

  const RE_WORD_TOKEN = /[\p{L}\p{N}_'’-]+/gu;

  /* ========================================================================
   * 3. HELPERS
   * ======================================================================== */

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function letterLabel(i) {
    let s = '';
    for (i += 1; i > 0; i = Math.floor((i - 1) / 26)) {
      s = String.fromCharCode(65 + ((i - 1) % 26)) + s;
    }
    return 'Person ' + s;
  }

  function stripEmojiAndTags(name) {
    return String(name || '')
      .replace(/^~\s*/, '')
      .replace(/\([^)]*\)/g, ' ')
      .replace(/\[[^\]]*\]/g, ' ')
      .replace(/[^\p{L}\p{N}'’.\s-]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function isPhoneLikeSender(s) {
    const digits = String(s || '').replace(/\D/g, '');
    return digits.length >= 8 && /^[\s+\-().0-9~]+$/.test(String(s || ''));
  }

  function isAllCaps(s) {
    return s.length >= 2 && s === s.toUpperCase() && s !== s.toLowerCase();
  }

  function isTitleCaseWord(w) {
    return /^[A-Z][\p{Ll}'’-]{1,}$/u.test(w);
  }

  function normalizeTermKey(t) {
    return String(t || '').trim().toLowerCase();
  }

  function cleanSnippet(text, maxLen) {
    const s = String(text || '').replace(/\s+/g, ' ').trim();
    return s.length > (maxLen || 140) ? s.slice(0, (maxLen || 140) - 1) + '…' : s;
  }

  function isVenueOrg(text) {
    return /\b(?:Hospital|Clinic|Surgery|Pharmacy|School|College|University|Academy|Institute|Bank|Airlines|Airways|Ltd\.?|LLC|Inc\.?|Corp\.?|PLC|GmbH|Consulting|Partners|Technologies|Labs|Studios)\b/i.test(text);
  }

  function looksLikeDateOrTime(str) {
    // Reject dates (12/05/2025, 2025-05-12) or times
    if (/^\d{1,4}[/.-]\d{1,2}[/.-]\d{2,4}$/.test(str.trim())) return true;
    if (/^\d{4}\s*[-–]\s*\d{4}$/.test(str.trim())) return true; // year ranges like 2024-2025
    return false;
  }

  function countDigits(s) {
    let n = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      if (c >= 48 && c <= 57) n++;
    }
    return n;
  }

  function isValidPhone(raw) {
    if (looksLikeDateOrTime(raw)) return false;
    const digits = countDigits(raw);
    if (digits < 8 || digits > 15) return false;
    // Reject obvious timestamps or long decimal numbers
    if (/^\d+\.\d+$/.test(raw.trim())) return false;
    return true;
  }

  function seededPick(pool, index, seed, forbiddenLower) {
    const len = pool.length;
    if (!len) return 'Item ' + (index + 1);
    const start = ((index * 7 + (seed || 0) * 13) % len + len) % len;
    for (let step = 0; step < len; step++) {
      const candidate = pool[(start + step) % len];
      if (!forbiddenLower.has(candidate.toLowerCase())) {
        forbiddenLower.add(candidate.toLowerCase());
        return candidate;
      }
    }
    return pool[start] + ' ' + (index + 1);
  }

  /* ========================================================================
   * 4. PLAN CREATION (MULTI-STAGE LOCAL PII PIPELINE)
   * ======================================================================== */

  function createPlan(result, opts) {
    opts = opts || {};
    const entries = (result && result.entries) || [];
    const messages = (result && result.messages) || [];

    // Fast corpus index for lookups, counts & snippets
    const exactWords = new Set();
    const lowerWords = new Set();
    const firstSeenIndex = new Map(); // lowercase token -> first entry index

    for (let ei = 0; ei < entries.length; ei++) {
      const text = entries[ei].text;
      if (!text) continue;
      // Strip WhatsApp encryption / boilerplate strings so "WhatsApp" in the E2EE banner isn't flagged as an Org
      const scanText = text.replace(RE_WA_PROTECTED, ' ');
      for (const m of scanText.matchAll(RE_WORD_TOKEN)) {
        const w = m[0];
        const lo = w.toLowerCase();
        exactWords.add(w);
        lowerWords.add(lo);
        if (!firstSeenIndex.has(lo)) firstSeenIndex.set(lo, ei);
      }
    }

    const entities = [];
    let nextEntityId = 1;
    // Maps lowercase term -> entity for deduplication & fast lookup
    const termOwner = new Map();

    function makeEntity(spec) {
      const ent = {
        id: 'ent_' + (nextEntityId++),
        type: spec.type,
        subType: spec.subType || spec.type,
        primary: spec.primary,
        terms: [],
        patternRe: spec.patternRe || null,
        senderKeys: spec.senderKeys ? spec.senderKeys.slice() : [],
        isSender: Boolean(spec.isSender),
        typedLabel: '',
        fakeLabel: '',
        customLabel: '',
        enabled: spec.enabled !== false,
        source: spec.source || 'dictionary',
        firstIdx: spec.firstIdx !== undefined ? spec.firstIdx : entries.length,
        count: 0,
        samples: [],
      };
      entities.push(ent);
      if (spec.terms) {
        for (const t of spec.terms) attachTerm(ent, t.text, t);
      } else if (spec.primary) {
        attachTerm(ent, spec.primary, {
          caseSensitive: Boolean(spec.caseSensitive),
          kind: spec.kind || 'word',
        });
      }
      return ent;
    }

    function attachTerm(ent, text, tOpts) {
      const clean = String(text || '').trim();
      if (!clean) return false;
      const kind = (tOpts && tOpts.kind) || 'word';
      if (kind === 'word' && clean.length < 2) return false;
      const key = clean.toLowerCase();
      if (ent.terms.some((x) => x.text.toLowerCase() === key)) return false;
      if (termOwner.has(key) && termOwner.get(key) !== ent) return false;
      ent.terms.push({
        text: clean,
        caseSensitive: Boolean(tOpts && tOpts.caseSensitive),
        kind,
      });
      termOwner.set(key, ent);
      return true;
    }

    /* ----- STAGE 1: Senders, name parts, phone senders & nickname linking ----- */
    const senderOrder = [];
    const senderSeen = new Set();
    for (const m of messages) {
      if (!senderSeen.has(m.sender)) {
        senderSeen.add(m.sender);
        senderOrder.push(m.sender);
      }
    }

    // Track token frequencies across senders so shared surnames (e.g. "Alex Smith" + "Sam Smith")
    // don't get falsely collapsed into just the first sender.
    const senderPartFreq = new Map();
    const senderPartsList = senderOrder.map((raw) => {
      const clean = stripEmojiAndTags(raw);
      const parts = clean ? clean.split(/\s+/).filter((p) => p.length >= 2 && !/^(?:mr|mrs|ms|miss|dr|prof)\.?$/i.test(p)) : [];
      for (const p of parts) {
        const lo = p.toLowerCase();
        senderPartFreq.set(lo, (senderPartFreq.get(lo) || 0) + 1);
      }
      return { raw, clean, parts };
    });

    const senderEntities = [];
    const sharedSenderSurnames = new Set();
    for (const [part, freq] of senderPartFreq) {
      if (freq > 1) sharedSenderSurnames.add(part);
    }

    for (let si = 0; si < senderPartsList.length; si++) {
      const { raw, clean, parts } = senderPartsList[si];
      const isPhone = isPhoneLikeSender(raw);
      const ent = makeEntity({
        type: 'person',
        subType: 'sender',
        primary: raw,
        senderKeys: [raw],
        isSender: true,
        source: 'sender',
        firstIdx: si,
        terms: [],
      });
      senderEntities.push(ent);

      if (isPhone) {
        attachTerm(ent, raw, { kind: 'literal', caseSensitive: false });
        const stripped = raw.replace(/^~\s*/, '').trim();
        if (stripped && stripped !== raw) attachTerm(ent, stripped, { kind: 'literal', caseSensitive: false });
        // Also match digits-only version if mentioned as @<digits>
        const digitsOnly = raw.replace(/\D/g, '');
        if (digitsOnly.length >= 8) {
          if (lowerWords.has(digitsOnly)) attachTerm(ent, digitsOnly, { kind: 'literal', caseSensitive: false });
        }
      } else {
        if (raw.length >= 2) attachTerm(ent, raw, { kind: 'word', caseSensitive: false });
        if (clean && clean !== raw && clean.length >= 2) {
          attachTerm(ent, clean, { kind: 'word', caseSensitive: false });
        }
        // Register unique name parts (first name, unique surname) under this sender
        for (const p of parts) {
          const lo = p.toLowerCase();
          if (COMMON_WORDS.has(lo) && !FIRST_NAME_SET.has(lo) && !SURNAME_SET.has(lo)) continue;
          if (sharedSenderSurnames.has(lo)) continue;
          // If the part is an ambiguous everyday word (like "Will" or "May") and NOT the full sender name,
          // keep it case-sensitive unless it's the sender's sole name.
          const isOnlyPart = parts.length === 1;
          const isAmbig = !isOnlyPart && AMBIGUOUS_NAMES.has(p);
          attachTerm(ent, p, { kind: 'word', caseSensitive: isAmbig });
        }
      }
    }

    // Shared surnames across senders (e.g. "Smith" shared by Alex Smith & Sam Smith):
    // still scrub standalone "Smith" as its own Person entity so family name never leaks!
    for (const sharedLo of sharedSenderSurnames) {
      if (termOwner.has(sharedLo)) continue;
      if (lowerWords.has(sharedLo)) {
        const canon = ALL_NAME_CANON.get(sharedLo) || (sharedLo[0].toUpperCase() + sharedLo.slice(1));
        makeEntity({
          type: 'person',
          subType: 'name',
          primary: canon,
          source: 'sender',
          firstIdx: firstSeenIndex.get(sharedLo) ?? entries.length,
          caseSensitive: AMBIGUOUS_NAMES.has(canon),
        });
      }
    }

    // Auto-link common nicknames / diminutives of senders that actually appear in the chat
    // (only when the nickname doesn't belong to another sender!)
    for (let si = 0; si < senderPartsList.length; si++) {
      const ent = senderEntities[si];
      const { parts } = senderPartsList[si];
      for (const p of parts) {
        const related = NICKNAME_MAP.get(p.toLowerCase());
        if (!related) continue;
        for (const nickLo of related) {
          if (termOwner.has(nickLo)) continue;
          if (!lowerWords.has(nickLo)) continue;
          const canonNick = ALL_NAME_CANON.get(nickLo) || (nickLo[0].toUpperCase() + nickLo.slice(1));
          const isAmbig = AMBIGUOUS_NAMES.has(canonNick) || COMMON_WORDS.has(nickLo);
          // For very short/common diminutives like "al", "ed", "em", "han", "mo", "will", require capitalized presence
          if (isAmbig || nickLo.length <= 2) {
            if (!exactWords.has(canonNick) && !exactWords.has(canonNick.toUpperCase())) continue;
            attachTerm(ent, canonNick, { kind: 'word', caseSensitive: true });
          } else {
            attachTerm(ent, canonNick, { kind: 'word', caseSensitive: false });
          }
        }
      }
    }

    /* ----- STAGE 2: Structured Digital, Contact, Address, Filename & Group PII ----- */
    // Pre-scan entries for high-precision structured patterns
    const seenStructured = new Map(); // lower -> entity

    function registerStructured(rawMatch, type, subType, entryIdx, kind) {
      const clean = String(rawMatch || '').trim();
      if (!clean) return null;
      const key = clean.toLowerCase();
      if (termOwner.has(key)) return termOwner.get(key);
      if (seenStructured.has(key)) return seenStructured.get(key);
      const ent = makeEntity({
        type,
        subType,
        primary: clean,
        source: 'pattern',
        firstIdx: entryIdx,
        kind: kind || 'literal',
        caseSensitive: false,
      });
      seenStructured.set(key, ent);
      return ent;
    }

    // Track auto-generated WhatsApp media filenames in one grouped pattern entity
    let waAutoFileEnt = null;

    // Also collect people & groups from WhatsApp system lines
    for (let ei = 0; ei < entries.length; ei++) {
      const e = entries[ei];
      const text = e.text;
      if (!text) continue;

      const hasAt = text.indexOf('@') !== -1;
      const hasDot = text.indexOf('.') !== -1;
      const hasDigit = /\d/.test(text);
      const hasUpper = /[A-Z]/.test(text);

      // Fast skip: if it's a normal message with no @, no ., no digits, nothing structured can match
      if (e.kind !== 'note' && !hasAt && !hasDot && !hasDigit) continue;

      // Strip protected WhatsApp boilerplate before scanning structured PII
      const scanText = text.replace(RE_WA_PROTECTED, ' ');

      // 2a. System lines: group subjects + actor/target people
      if (e.kind === 'note') {
        const subM = RE_GROUP_SUBJECT_CHANGE.exec(text);
        if (subM) {
          if (subM[1] && subM[1].trim().length >= 2) {
            registerStructured(subM[1].trim(), 'group', 'group', ei, 'literal');
          }
          if (subM[2] && subM[2].trim().length >= 2) {
            registerStructured(subM[2].trim(), 'group', 'group', ei, 'literal');
          }
        }
        const crM = RE_GROUP_CREATED.exec(text);
        if (crM && crM[1] && crM[1].trim().length >= 2) {
          registerStructured(crM[1].trim(), 'group', 'group', ei, 'literal');
        }
        const actM = RE_SYS_ACTION.exec(text);
        if (actM) {
          for (const rawPerson of [actM[1], actM[2]]) {
            const p = rawPerson.trim();
            if (p && p.toLowerCase() !== 'you' && !termOwner.has(p.toLowerCase()) && p.length >= 2 && p.length <= 40) {
              makeEntity({ type: 'person', subType: 'name', primary: p, source: 'context', firstIdx: ei, kind: isPhoneLikeSender(p) ? 'literal' : 'word' });
            }
          }
        } else {
          const singleM = RE_SYS_SINGLE.exec(text);
          if (singleM) {
            const p = singleM[1].trim();
            if (p && p.toLowerCase() !== 'you' && !termOwner.has(p.toLowerCase()) && p.length >= 2 && p.length <= 40) {
              makeEntity({ type: 'person', subType: 'name', primary: p, source: 'context', firstIdx: ei, kind: isPhoneLikeSender(p) ? 'literal' : 'word' });
            }
          }
        }
      }

      // 2b. URLs (Maps links -> place, other URLs -> contact)
      let masked = scanText;
      if (hasDot && (masked.indexOf('://') !== -1 || masked.indexOf('www.') !== -1 || masked.indexOf('/') !== -1)) {
        for (const m of scanText.matchAll(RE_URL)) {
          const url = m[0];
          const isMap = RE_MAP_URL.test(url);
          registerStructured(url, isMap ? 'place' : 'contact', isMap ? 'map_link' : 'url', ei, 'literal');
          masked = masked.replace(url, ' ');
        }
      }

      // 2c. Emails
      if (hasAt && hasDot) {
        for (const m of masked.matchAll(RE_EMAIL)) {
          const email = m[0];
          registerStructured(email, 'contact', 'email', ei, 'literal');
          masked = masked.replace(email, ' ');
        }
      }

      // 2d. Auto-generated WA media filenames (grouped into one clean pattern entity) + custom identifying filenames
      if (hasDot) {
        RE_WA_AUTO_FILENAME.lastIndex = 0;
        if (RE_WA_AUTO_FILENAME.test(masked)) {
          if (!waAutoFileEnt) {
            waAutoFileEnt = makeEntity({
              type: 'file',
              subType: 'wa_media_file',
              primary: 'WhatsApp media filenames (IMG-*, VID-*, …)',
              source: 'pattern',
              firstIdx: ei,
              terms: [],
              patternRe: RE_WA_AUTO_FILENAME,
            });
          }
          masked = masked.replace(RE_WA_AUTO_FILENAME, ' ');
        }
        for (const m of masked.matchAll(RE_FILENAME)) {
          const fname = m[1].trim();
          if (fname.length >= 5) {
            registerStructured(fname, 'file', 'file', ei, 'literal');
            masked = masked.replace(fname, ' ');
          }
        }
      }

      // 2e. Sensitive numeric IDs (SSN, NINO, IBAN, card, sort+account)
      if (hasDigit) {
        for (const m of masked.matchAll(RE_SENSITIVE_ID)) {
          registerStructured(m[0], 'contact', 'id', ei, 'literal');
          masked = masked.replace(m[0], ' ');
        }

        // 2f. GPS coordinates
        if (hasDot && masked.indexOf(',') !== -1) {
          for (const m of masked.matchAll(RE_COORDS)) {
            registerStructured(m[0], 'place', 'coords', ei, 'literal');
            masked = masked.replace(m[0], ' ');
          }
        }

        // 2g. WhatsApp @phone mentions (@447700900123)
        if (hasAt) {
          for (const m of masked.matchAll(RE_WA_PHONE_MENTION)) {
            const digits = m[0].slice(1);
            const matchedSender = senderEntities.find((se) => se.senderKeys.some((k) => k.replace(/\D/g, '') === digits));
            if (matchedSender) {
              attachTerm(matchedSender, m[0], { kind: 'literal', caseSensitive: false });
            } else {
              registerStructured(m[0], 'contact', 'phone', ei, 'literal');
            }
            masked = masked.replace(m[0], ' ');
          }
        }

        // 2h. Phone numbers
        for (const m of masked.matchAll(RE_PHONE)) {
          const ph = m[0].trim();
          if (!isValidPhone(ph)) continue;
          const digits = ph.replace(/\D/g, '');
          const matchedSender = senderEntities.find((se) => se.senderKeys.some((k) => {
            const kd = k.replace(/\D/g, '');
            return kd.length >= 8 && (kd === digits || kd.endsWith(digits.slice(-9)) || digits.endsWith(kd.slice(-9)));
          }));
          if (matchedSender) {
            attachTerm(matchedSender, ph, { kind: 'literal', caseSensitive: false });
          } else {
            registerStructured(ph, 'contact', 'phone', ei, 'literal');
          }
          masked = masked.replace(ph, ' ');
        }
      }

      // 2i. Social @handles
      if (hasAt) {
        for (const m of masked.matchAll(RE_HANDLE)) {
          const handle = m[0];
          const bare = handle.slice(1).toLowerCase();
          const owner = termOwner.get(bare);
          if (owner && owner.type === 'person') {
            attachTerm(owner, handle, { kind: 'literal', caseSensitive: false });
          } else {
            registerStructured(handle, 'contact', 'handle', ei, 'literal');
          }
          masked = masked.replace(handle, ' ');
        }
      }

      // 2j. Street addresses & postcodes
      if (hasDigit && hasUpper) {
        for (const m of masked.matchAll(RE_STREET_ADDR)) {
          registerStructured(m[0].trim(), 'place', 'address', ei, 'literal');
          masked = masked.replace(m[0], ' ');
        }
        for (const m of masked.matchAll(RE_UK_POSTCODE)) {
          registerStructured(m[0].trim(), 'place', 'postcode', ei, 'literal');
        }
        for (const m of masked.matchAll(RE_CA_POSTCODE)) {
          registerStructured(m[0].trim(), 'place', 'postcode', ei, 'literal');
        }
        for (const m of masked.matchAll(RE_US_ZIP)) {
          registerStructured(m[0].trim(), 'place', 'postcode', ei, 'literal');
        }
      }
    }

    /* ----- STAGE 3: Contextual Multi-Word Entities (Honorifics, Full Names, Venues, Orgs, Places) ----- */
    // Build a full joined corpus for fast multi-word gazetteer checks
    const fullText = entries.map((e) => e.text).join('\n');
    const fullLower = fullText.toLowerCase();

    // 3a. Multi-word Places & Orgs from curated gazetteers
    for (const mp of PLACE_MULTI) {
      const lo = mp.toLowerCase();
      if (termOwner.has(lo) || !fullLower.includes(lo)) continue;
      const re = new RegExp('(?<![\\p{L}\\p{N}_])' + escapeRegExp(mp) + '(?![\\p{L}\\p{N}_])', 'iu');
      const hit = re.exec(fullText);
      if (hit) {
        makeEntity({ type: 'place', subType: 'city', primary: mp, source: 'dictionary', firstIdx: firstSeenIndex.get(lo.split(' ')[0]) ?? 0 });
      }
    }
    for (const mo of ORG_MULTI) {
      const lo = mo.toLowerCase();
      if (termOwner.has(lo) || !fullLower.includes(lo)) continue;
      const re = new RegExp('(?<![\\p{L}\\p{N}_])' + escapeRegExp(mo) + '(?![\\p{L}\\p{N}_])', 'iu');
      const hit = re.exec(fullText);
      if (hit) {
        makeEntity({ type: 'org', subType: 'org', primary: mo, source: 'dictionary', firstIdx: firstSeenIndex.get(lo.split(' ')[0]) ?? 0 });
      }
    }

    // 3b. Contextual pattern extraction per entry (skip lines with no uppercase letters!)
    for (let ei = 0; ei < entries.length; ei++) {
      const text = entries[ei].text;
      if (!text || !/[A-Z]/.test(text)) continue;
      const clean = text.replace(RE_WA_PROTECTED, ' ');

      // Honorifics: "Dr. Patel", "Mr. O'Connor", "Auntie Maya"
      for (const m of clean.matchAll(RE_HONORIFIC)) {
        const fullPhrase = m[0].trim();
        const namePart = m[1].trim();
        if (COMMON_WORDS.has(namePart.toLowerCase())) continue;
        const owner = termOwner.get(namePart.toLowerCase()) || termOwner.get(namePart.split(' ')[0].toLowerCase());
        if (owner && owner.type === 'person') {
          attachTerm(owner, fullPhrase, { kind: 'word', caseSensitive: false });
          attachTerm(owner, namePart, { kind: 'word', caseSensitive: false });
        } else if (!termOwner.has(fullPhrase.toLowerCase())) {
          const ent = makeEntity({ type: 'person', subType: 'name', primary: fullPhrase, source: 'context', firstIdx: ei });
          if (namePart.length >= 3 && !COMMON_WORDS.has(namePart.toLowerCase())) {
            attachTerm(ent, namePart, { kind: 'word', caseSensitive: AMBIGUOUS_NAMES.has(namePart) });
          }
        }
      }

      // Relationship cues: "my flatmate Rohan", "my boss Claire Jenkins"
      for (const m of clean.matchAll(RE_RELATIONSHIP)) {
        const cand = m[1].trim();
        const words = cand.split(/\s+/);
        if (words.every((w) => COMMON_WORDS.has(w.toLowerCase()))) continue;
        if (COMMON_WORDS.has(words[0].toLowerCase())) continue;
        if (!termOwner.has(cand.toLowerCase())) {
          const existing = termOwner.get(words[0].toLowerCase());
          if (existing && existing.type === 'person') {
            attachTerm(existing, cand, { kind: 'word', caseSensitive: false });
          } else {
            makeEntity({ type: 'person', subType: 'name', primary: cand, source: 'context', firstIdx: ei, caseSensitive: AMBIGUOUS_NAMES.has(cand) });
          }
        }
      }

      // Organization suffix patterns: "Acme Consulting", "St Thomas Hospital", "Kings College"
      for (const m of clean.matchAll(RE_ORG_SUFFIX)) {
        const phrase = m[1].trim();
        const firstWord = phrase.split(/\s+/)[0].toLowerCase();
        if (COMMON_WORDS.has(firstWord) && phrase.split(/\s+/).length <= 2) continue;
        if (!termOwner.has(phrase.toLowerCase())) {
          makeEntity({ type: 'org', subType: 'org', primary: phrase, source: 'context', firstIdx: ei });
        }
      }

      // Venue suffix patterns: "Hyde Park", "Heathrow Airport", "Bluebird Cafe"
      for (const m of clean.matchAll(RE_VENUE_SUFFIX)) {
        const phrase = m[1].trim();
        const words = phrase.split(/\s+/);
        if (words.length === 2 && COMMON_WORDS.has(words[0].toLowerCase())) continue;
        if (!termOwner.has(phrase.toLowerCase())) {
          const t = isVenueOrg(phrase) ? 'org' : 'place';
          makeEntity({ type: t, subType: t === 'org' ? 'org' : 'venue', primary: phrase, source: 'context', firstIdx: ei });
        }
      }

      // Work/study org context: "working at Monzo", "interview at Apple", "graduated from UCL"
      for (const m of clean.matchAll(RE_ORG_CONTEXT)) {
        const phrase = m[1].trim();
        const words = phrase.split(/\s+/);
        if (words.every((w) => COMMON_WORDS.has(w.toLowerCase()))) continue;
        if (COMMON_WORDS.has(words[0].toLowerCase())) continue;
        // Skip if it's already a known place or person
        const lo = phrase.toLowerCase();
        if (PLACE_SINGLE.has(lo) || termOwner.has(lo)) continue;
        makeEntity({
          type: 'org',
          subType: 'org',
          primary: phrase,
          source: 'context',
          firstIdx: ei,
          caseSensitive: ORG_CONTEXT_LOWER.has(lo),
        });
      }

      // Place context: "flying to Lisbon", "living in Shoreditch", "meeting at Dishoom", "in Bath"
      for (const m of clean.matchAll(RE_PLACE_CONTEXT)) {
        const phrase = m[1].trim();
        const words = phrase.split(/\s+/);
        if (words.every((w) => COMMON_WORDS.has(w.toLowerCase()))) continue;
        if (COMMON_WORDS.has(words[0].toLowerCase())) continue;
        const lo = phrase.toLowerCase();
        if (termOwner.has(lo)) continue;
        // Avoid misclassifying known single-word first names unless it's also a place
        if (words.length === 1 && FIRST_NAME_SET.has(lo) && !PLACE_SINGLE.has(lo) && !PLACE_AMBIG_LOWER.has(lo)) continue;
        makeEntity({
          type: 'place',
          subType: PLACE_SINGLE.has(lo) || PLACE_AMBIG_LOWER.has(lo) ? 'city' : 'venue',
          primary: phrase,
          source: 'context',
          firstIdx: ei,
          caseSensitive: PLACE_AMBIG_LOWER.has(lo) || AMBIGUOUS_NAMES.has(phrase),
        });
      }
    }

    /* ----- STAGE 4: Single-Word Gazetteers (Places, Orgs, People + Full-Name Merging) ----- */
    // 4a. Unambiguous single-word Places
    for (const [lo, canon] of PLACE_SINGLE) {
      if (termOwner.has(lo) || !lowerWords.has(lo)) continue;
      // Short acronyms like UK/USA/NYC must appear uppercase
      const mustCap = canon.length <= 3 && canon === canon.toUpperCase();
      if (mustCap && !exactWords.has(canon)) continue;
      makeEntity({
        type: 'place',
        subType: 'city',
        primary: canon,
        source: 'dictionary',
        firstIdx: firstSeenIndex.get(lo) ?? entries.length,
        caseSensitive: mustCap,
      });
    }

    // 4b. Unambiguous single-word Orgs
    for (const [lo, canon] of ORG_SINGLE) {
      if (termOwner.has(lo) || !lowerWords.has(lo)) continue;
      const mustCap = canon.length <= 3 && canon === canon.toUpperCase();
      if (mustCap && !exactWords.has(canon)) continue;
      makeEntity({
        type: 'org',
        subType: 'org',
        primary: canon,
        source: 'dictionary',
        firstIdx: firstSeenIndex.get(lo) ?? entries.length,
        caseSensitive: mustCap,
      });
    }

    // 4c. Adjacent FirstName + Surname full-name detection (e.g. "Sarah Jenkins" -> ONE person!)
    const RE_TWO_CAP = /\b([A-Z][\p{Ll}'’-]{1,20})\s+([A-Z][\p{Ll}'’-]{1,20})\b/gu;
    const fullNameFirstCount = new Map(); // firstLo -> Set<fullLo>
    const foundFullNames = [];
    for (let ei = 0; ei < entries.length; ei++) {
      const e = entries[ei];
      const text = e.text;
      if (!text || !/[A-Z]/.test(text)) continue;
      // Strip quoted group subjects on system lines so Title-Case group titles aren't parsed as "FirstName Surname"
      const scan = e.kind === 'note' ? text.replace(/["“][^"”]+["”]/g, ' ') : text;
      for (const m of scan.matchAll(RE_TWO_CAP)) {
        const w1 = m[1], w2 = m[2];
        const l1 = w1.toLowerCase(), l2 = w2.toLowerCase();
        if (COMMON_WORDS.has(l1) || COMMON_WORDS.has(l2)) continue;
        if (PLACE_SINGLE.has(l1) || PLACE_SINGLE.has(l2) || ORG_SINGLE.has(l1) || ORG_SINGLE.has(l2)) continue;
        if (FIRST_NAME_SET.has(l1) && (SURNAME_SET.has(l2) || (!COMMON_WORDS.has(l2) && w2.length >= 3 && !PLACE_AMBIG_LOWER.has(l2)))) {
          const full = w1 + ' ' + w2;
          const fullLo = full.toLowerCase();
          if (!fullNameFirstCount.has(l1)) fullNameFirstCount.set(l1, new Set());
          fullNameFirstCount.get(l1).add(fullLo);
          foundFullNames.push({ full, w1, w2, l1, l2, ei });
        }
      }
    }
    for (const fn of foundFullNames) {
      const fullLo = fn.full.toLowerCase();
      if (termOwner.has(fullLo)) continue;
      // If w1 already belongs to a sender, only merge if w2 isn't a different sender
      const w1Owner = termOwner.get(fn.l1);
      if (w1Owner && w1Owner.isSender) {
        attachTerm(w1Owner, fn.full, { kind: 'word', caseSensitive: false });
        continue;
      }
      const ent = makeEntity({
        type: 'person',
        subType: 'name',
        primary: fn.full,
        source: 'dictionary',
        firstIdx: fn.ei,
      });
      // If only one person has this first name in the chat, alias the standalone first name to this same person!
      if (fullNameFirstCount.get(fn.l1).size === 1 && !termOwner.has(fn.l1)) {
        attachTerm(ent, fn.w1, { kind: 'word', caseSensitive: AMBIGUOUS_NAMES.has(fn.w1) });
      }
      if (SURNAME_SET.has(fn.l2) && !termOwner.has(fn.l2)) {
        attachTerm(ent, fn.w2, { kind: 'word', caseSensitive: AMBIGUOUS_NAMES.has(fn.w2) || COMMON_WORDS.has(fn.l2) });
      }
    }

    // 4d. Standalone dictionary People (first names + surnames)
    for (const [lo, canon] of ALL_NAME_CANON) {
      if (termOwner.has(lo) || !lowerWords.has(lo)) continue;
      if (PLACE_SINGLE.has(lo) || ORG_SINGLE.has(lo)) continue;
      const isAmbig = AMBIGUOUS_NAMES.has(canon) || COMMON_WORDS.has(lo);
      if (isAmbig) {
        if (!exactWords.has(canon) && !exactWords.has(canon.toUpperCase())) continue;
      }
      makeEntity({
        type: 'person',
        subType: 'name',
        primary: canon,
        source: 'dictionary',
        firstIdx: firstSeenIndex.get(lo) ?? entries.length,
        caseSensitive: isAmbig,
      });
    }

    // 4e. Extra user-supplied names (from legacy "also hide…" input or opts.extraNames)
    const extraList = (opts.extraNames || []).map((s) => String(s).trim()).filter((s) => s.length >= 2);
    for (const ex of extraList) {
      const lo = ex.toLowerCase();
      if (termOwner.has(lo)) continue;
      makeEntity({
        type: 'person',
        subType: 'name',
        primary: ex,
        source: 'custom',
        firstIdx: firstSeenIndex.get(lo) ?? entries.length,
        caseSensitive: false,
        kind: /[^\p{L}\p{N}_'’\s-]/u.test(ex) ? 'literal' : 'word',
      });
    }

    // Sort entities cleanly: senders first in appearance order, then by firstIdx
    entities.sort((a, b) => {
      if (a.isSender !== b.isSender) return a.isSender ? -1 : 1;
      return a.firstIdx - b.firstIdx || a.primary.localeCompare(b.primary);
    });

    /* ----- STAGE 5: Scan for Unrecognized Proper Nouns ("Potential Leaks" queue) ----- */
    const suspects = scanSuspects(entries, termOwner);

    const plan = {
      mode: opts.mode === 'realistic' ? 'realistic' : 'typed',
      seed: opts.seed || 1,
      categories: {
        person: true,
        place: true,
        org: true,
        contact: true,
        file: true,
        group: true,
      },
      entities,
      suspects,
      _entries: entries,
      _lowerWords: lowerWords,
      _compiled: null,
    };

    recountEntities(plan);
    recomputeLabels(plan);
    return plan;
  }

  /* ========================================================================
   * 5. SUSPECT / POTENTIAL LEAK SCANNER
   * ======================================================================== */

  function scanSuspects(entries, termOwner) {
    // Look for mid-sentence Title-Case single words & 2-word phrases that aren't
    // common English words and weren't already claimed by any detected entity.
    const counts = new Map(); // lower -> { term, count, samples, placeVotes, orgVotes, personVotes }
    const RE_SENTENCE_SPLIT = /(?:^|[.!?\n\r]+[\s"'“”(\[]*)/g;

    for (let ei = 0; ei < entries.length; ei++) {
      const e = entries[ei];
      const text = e.text;
      if (!text || !/[A-Z]/.test(text)) continue;
      // Remove WhatsApp boilerplate, quoted group subjects, auto-filenames & URLs so they aren't flagged as leaks
      let clean = text.replace(RE_WA_PROTECTED, ' ').replace(RE_WA_AUTO_FILENAME, ' ').replace(RE_URL, ' ').replace(RE_EMAIL, ' ');
      if (e.kind === 'note') clean = clean.replace(/["“][^"”]+["”]/g, ' ');

      // Find indices that are sentence starts (skip single words right at sentence start)
      const sentenceStarts = new Set([0]);
      for (const sm of clean.matchAll(RE_SENTENCE_SPLIT)) {
        sentenceStarts.add(sm.index + sm[0].length);
      }

      // Match Title-Case & CamelCase proper nouns (e.g. Zorgon, KwikMart, O'Connor), skipping ALL-CAPS shouting
      const RE_CAP_TOKEN = /\b([A-Z][\p{L}'’-]{2,24})\b/gu;
      const tokens = [];
      for (const m of clean.matchAll(RE_CAP_TOKEN)) {
        const raw = m[1].replace(/['’]s$/i, '');
        if (raw.length < 3 || isAllCaps(raw) || !/\p{Ll}/u.test(raw)) continue;
        tokens.push({ word: raw, index: m.index, end: m.index + m[0].length });
      }

      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        const lo = tok.word.toLowerCase();
        // Skip sentence-initial single words unless followed by another capitalized word
        const isStart = sentenceStarts.has(tok.index);
        const nextTok = tokens[i + 1];
        const isTwoWord = nextTok && clean.slice(tok.end, nextTok.index) === ' ' && !COMMON_WORDS.has(nextTok.word.toLowerCase());

        let candidate = tok.word;
        let candLo = lo;
        if (isTwoWord && !COMMON_WORDS.has(lo)) {
          candidate = tok.word + ' ' + nextTok.word;
          candLo = candidate.toLowerCase();
          i++; // consume pair
        } else if (isStart) {
          continue;
        }

        if (COMMON_WORDS.has(candLo)) continue;
        if (termOwner.has(candLo)) continue;
        // Skip if every word in a 2-word candidate is already owned
        if (candidate.includes(' ') && candidate.split(' ').every((w) => termOwner.has(w.toLowerCase()))) continue;
        // Skip if a single word is part of a multi-word owned entity
        if (!candidate.includes(' ') && termOwner.has(lo)) continue;

        let rec = counts.get(candLo);
        if (!rec) {
          rec = { term: candidate, count: 0, samples: [], placeVotes: 0, orgVotes: 0, personVotes: 0 };
          counts.set(candLo, rec);
        }
        rec.count++;
        if (rec.samples.length < 2) {
          rec.samples.push({ entryIdx: ei, sender: e.sender || '', text: cleanSnippet(text, 120) });
        }

        // Context voting for suggestedType
        const before = clean.slice(Math.max(0, tok.index - 24), tok.index).toLowerCase();
        if (/\b(?:in|to|at|from|near|around|outside|visit|visiting|moved to|living in)\s+(?:the\s+)?$/.test(before)) {
          rec.placeVotes++;
        } else if (/\b(?:work at|working at|worked at|job at|interview at|joined|study at)\s+$/.test(before)) {
          rec.orgVotes++;
        } else if (/\b(?:with|told|asked|met|saw|texted|called|hey|hi|hello|dear|thanks|sorry|happy birthday)\s+$/.test(before)) {
          rec.personVotes++;
        }
      }
    }

    const list = [];
    for (const rec of counts.values()) {
      let suggestedType = 'person';
      if (rec.orgVotes > rec.placeVotes && rec.orgVotes > rec.personVotes) suggestedType = 'org';
      else if (rec.placeVotes > rec.personVotes) suggestedType = 'place';
      list.push({
        term: rec.term,
        count: rec.count,
        suggestedType,
        dismissed: false,
        samples: rec.samples,
      });
    }
    list.sort((a, b) => b.count - a.count || a.term.localeCompare(b.term));
    return list.slice(0, 120);
  }

  /* ========================================================================
   * 6. LABELS, COUNTS & PLAN MUTATIONS
   * ======================================================================== */

  function recomputeLabels(plan) {
    // Forbidden words for realistic fake names = every real lowercase word in the chat
    // + every custom label already chosen, so fake names NEVER collide with real text.
    const forbidden = new Set(plan._lowerWords || []);
    for (const ent of plan.entities) {
      if (ent.customLabel) forbidden.add(ent.customLabel.toLowerCase());
      for (const t of ent.terms) forbidden.add(t.text.toLowerCase());
    }

    let personIdx = 0;
    let placeIdx = 0;
    let addressIdx = 0;
    let postcodeIdx = 0;
    let mapLinkIdx = 0;
    let coordsIdx = 0;
    let orgIdx = 0;
    let groupIdx = 0;
    let phoneIdx = 0;
    let emailIdx = 0;
    let urlIdx = 0;
    let handleIdx = 0;
    let idIdx = 0;
    let fileIdx = 0;

    for (const ent of plan.entities) {
      if (ent.type === 'person') {
        ent.typedLabel = letterLabel(personIdx);
        ent.fakeLabel = seededPick(FAKE_PEOPLE, personIdx, plan.seed, forbidden);
        personIdx++;
      } else if (ent.type === 'place') {
        if (ent.subType === 'address') {
          addressIdx++;
          ent.typedLabel = 'Address ' + addressIdx;
          ent.fakeLabel = seededPick(FAKE_STREETS, addressIdx - 1, plan.seed, forbidden);
        } else if (ent.subType === 'postcode') {
          postcodeIdx++;
          ent.typedLabel = 'Postcode ' + postcodeIdx;
          ent.fakeLabel = 'ZZ' + postcodeIdx + ' 9AA';
        } else if (ent.subType === 'map_link') {
          mapLinkIdx++;
          ent.typedLabel = '[Map Link ' + mapLinkIdx + ']';
          ent.fakeLabel = 'https://maps.example/place-' + mapLinkIdx;
        } else if (ent.subType === 'coords') {
          coordsIdx++;
          ent.typedLabel = '[Coords ' + coordsIdx + ']';
          ent.fakeLabel = '0.0000, 0.0000';
        } else {
          placeIdx++;
          ent.typedLabel = 'Place ' + placeIdx;
          ent.fakeLabel = seededPick(FAKE_PLACES, placeIdx - 1, plan.seed, forbidden);
        }
      } else if (ent.type === 'org') {
        orgIdx++;
        ent.typedLabel = 'Org ' + orgIdx;
        ent.fakeLabel = seededPick(FAKE_ORGS, orgIdx - 1, plan.seed, forbidden);
      } else if (ent.type === 'group') {
        groupIdx++;
        ent.typedLabel = 'Group ' + groupIdx;
        ent.fakeLabel = seededPick(FAKE_GROUPS, groupIdx - 1, plan.seed, forbidden);
      } else if (ent.type === 'file') {
        if (ent.subType === 'wa_media_file') {
          ent.typedLabel = '[Media File]';
          ent.fakeLabel = 'media-attachment.jpg';
        } else {
          fileIdx++;
          const extMatch = /\.([a-z0-9]{2,5})$/i.exec(ent.primary);
          const ext = extMatch ? extMatch[1].toLowerCase() : 'file';
          ent.typedLabel = '[File ' + fileIdx + ']';
          ent.fakeLabel = 'attachment-' + fileIdx + '.' + ext;
        }
      } else {
        // contact
        if (ent.subType === 'phone') {
          phoneIdx++;
          ent.typedLabel = '[Phone ' + phoneIdx + ']';
          ent.fakeLabel = '555-01' + String(phoneIdx).padStart(2, '0');
        } else if (ent.subType === 'email') {
          emailIdx++;
          ent.typedLabel = '[Email ' + emailIdx + ']';
          ent.fakeLabel = 'contact' + emailIdx + '@example.com';
        } else if (ent.subType === 'handle') {
          handleIdx++;
          ent.typedLabel = '@user' + handleIdx;
          ent.fakeLabel = '@handle_' + handleIdx;
        } else if (ent.subType === 'id') {
          idIdx++;
          ent.typedLabel = '[ID ' + idIdx + ']';
          ent.fakeLabel = 'ID-0000-' + idIdx;
        } else {
          urlIdx++;
          ent.typedLabel = '[Link ' + urlIdx + ']';
          ent.fakeLabel = 'https://example.com/link-' + urlIdx;
        }
      }
    }
    plan._compiled = null;
  }

  function getLabel(plan, ent) {
    if (!ent) return '';
    if (ent.customLabel && ent.customLabel.trim()) return ent.customLabel.trim();
    return plan.mode === 'realistic' ? ent.fakeLabel : ent.typedLabel;
  }

  function isEntityActive(plan, ent) {
    if (!ent || !ent.enabled) return false;
    return plan.categories[ent.type] !== false;
  }

  function recountEntities(plan) {
    const entries = plan._entries || [];
    for (const ent of plan.entities) {
      ent.count = 0;
      ent.samples = [];
    }

    // Count sender message hits
    const senderEntMap = new Map();
    for (const ent of plan.entities) {
      for (const sk of ent.senderKeys) senderEntMap.set(sk, ent);
    }

    // Build quick matchers per entity (only called on createPlan / edit, fast even on 100k)
    const compiled = compilePlan(plan, { includeDisabled: true });
    for (let ei = 0; ei < entries.length; ei++) {
      const e = entries[ei];
      if (e.kind === 'message') {
        const se = senderEntMap.get(e.sender);
        if (se) {
          se.count++;
          if (se.samples.length < 2) {
            se.samples.push({ entryIdx: ei, sender: e.sender, text: cleanSnippet(e.text, 110) });
          }
        }
      }
      if (!e.text) continue;
      const hits = findEntityHitsInString(e.text, compiled);
      for (const ent of hits) {
        ent.count++;
        if (ent.samples.length < 3) {
          if (!ent.samples.some((s) => s.entryIdx === ei)) {
            ent.samples.push({ entryIdx: ei, sender: e.sender || '', text: cleanSnippet(e.text, 110) });
          }
        }
      }
    }
  }

  function setMode(plan, mode) {
    plan.mode = mode === 'realistic' ? 'realistic' : 'typed';
    plan._compiled = null;
    return plan;
  }

  function rerollFakeNames(plan) {
    plan.seed = (plan.seed || 1) + 1;
    recomputeLabels(plan);
    return plan;
  }

  function setCategoryEnabled(plan, cat, enabled) {
    plan.categories[cat] = Boolean(enabled);
    plan._compiled = null;
    return plan;
  }

  function toggleEntity(plan, id, enabled) {
    const ent = plan.entities.find((e) => e.id === id);
    if (!ent) return false;
    ent.enabled = Boolean(enabled);
    plan._compiled = null;
    return true;
  }

  function setEntityType(plan, id, newType) {
    const ent = plan.entities.find((e) => e.id === id);
    if (!ent) return false;
    if (!['person', 'place', 'org', 'contact', 'file', 'group'].includes(newType)) return false;
    ent.type = newType;
    if (newType === 'place' && !['address', 'postcode', 'map_link', 'coords', 'venue', 'city'].includes(ent.subType)) ent.subType = 'city';
    else if (newType === 'person' && !ent.isSender) ent.subType = 'name';
    else if (newType === 'org') ent.subType = 'org';
    else if (newType === 'group') ent.subType = 'group';
    else if (newType === 'file') ent.subType = 'file';
    else if (newType === 'contact' && !['phone', 'email', 'url', 'handle', 'id'].includes(ent.subType)) ent.subType = 'url';
    recomputeLabels(plan);
    return true;
  }

  function setEntityCustomLabel(plan, id, label) {
    const ent = plan.entities.find((e) => e.id === id);
    if (!ent) return false;
    ent.customLabel = String(label || '').trim();
    plan._compiled = null;
    return true;
  }

  function mergeEntities(plan, sourceId, targetId) {
    if (sourceId === targetId) return false;
    const srcIdx = plan.entities.findIndex((e) => e.id === sourceId);
    const tgt = plan.entities.find((e) => e.id === targetId);
    if (srcIdx < 0 || !tgt) return false;
    const src = plan.entities[srcIdx];

    // Transfer terms
    for (const t of src.terms) {
      if (!tgt.terms.some((x) => x.text.toLowerCase() === t.text.toLowerCase())) {
        tgt.terms.push(Object.assign({}, t));
      }
    }
    // Transfer sender keys if any
    for (const sk of src.senderKeys) {
      if (!tgt.senderKeys.includes(sk)) tgt.senderKeys.push(sk);
    }
    if (src.isSender) tgt.isSender = true;
    tgt.count += src.count;
    for (const s of src.samples) {
      if (tgt.samples.length < 3 && !tgt.samples.some((x) => x.entryIdx === s.entryIdx)) {
        tgt.samples.push(s);
      }
    }
    plan.entities.splice(srcIdx, 1);
    recomputeLabels(plan);
    return true;
  }

  function addAlias(plan, targetId, termText, opts) {
    const clean = String(termText || '').trim();
    if (clean.length < 2) return false;
    const tgt = plan.entities.find((e) => e.id === targetId);
    if (!tgt) return false;
    const lo = clean.toLowerCase();

    // If term belongs to another entity, remove it from there or merge
    for (const ent of plan.entities) {
      if (ent === tgt) continue;
      const idx = ent.terms.findIndex((t) => t.text.toLowerCase() === lo);
      if (idx >= 0) {
        if (ent.terms.length === 1 && !ent.isSender) {
          return mergeEntities(plan, ent.id, tgt.id);
        }
        ent.terms.splice(idx, 1);
      }
    }
    if (!tgt.terms.some((t) => t.text.toLowerCase() === lo)) {
      const kind = (opts && opts.kind) || (/[^\p{L}\p{N}_'’\s-]/u.test(clean) ? 'literal' : 'word');
      tgt.terms.push({
        text: clean,
        caseSensitive: Boolean(opts && opts.caseSensitive),
        kind,
      });
    }
    // Mark matching suspect as dismissed
    for (const s of plan.suspects) {
      if (s.term.toLowerCase() === lo) s.dismissed = true;
    }
    plan._compiled = null;
    recountSingleEntity(plan, tgt);
    return true;
  }

  function removeAlias(plan, entityId, termText) {
    const ent = plan.entities.find((e) => e.id === entityId);
    if (!ent) return false;
    const lo = String(termText || '').trim().toLowerCase();
    // Don't delete the last remaining term unless it's a sender (which still has senderKeys)
    if (ent.terms.length <= 1 && !ent.isSender) return false;
    const idx = ent.terms.findIndex((t) => t.text.toLowerCase() === lo);
    if (idx < 0) return false;
    ent.terms.splice(idx, 1);
    if (ent.primary.toLowerCase() === lo && ent.terms.length) {
      ent.primary = ent.terms[0].text;
    }
    plan._compiled = null;
    recountSingleEntity(plan, ent);
    return true;
  }

  function addCustomEntity(plan, termText, type, opts) {
    const clean = String(termText || '').trim();
    if (clean.length < 2) return null;
    const lo = clean.toLowerCase();
    // Check if already exists
    for (const ent of plan.entities) {
      if (ent.terms.some((t) => t.text.toLowerCase() === lo)) {
        ent.enabled = true;
        plan._compiled = null;
        return ent;
      }
    }
    const safeType = ['person', 'place', 'org', 'contact', 'file', 'group'].includes(type) ? type : 'person';
    const kind = (opts && opts.kind) || (/[^\p{L}\p{N}_'’\s-]/u.test(clean) ? 'literal' : 'word');
    const ent = {
      id: 'ent_custom_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
      type: safeType,
      subType: safeType === 'person' ? 'name' : safeType === 'place' ? 'city' : safeType,
      primary: clean,
      terms: [{ text: clean, caseSensitive: Boolean(opts && opts.caseSensitive), kind }],
      senderKeys: [],
      isSender: false,
      typedLabel: '',
      fakeLabel: '',
      customLabel: '',
      enabled: true,
      source: 'custom',
      firstIdx: (plan._entries || []).length,
      count: 0,
      samples: [],
    };
    plan.entities.push(ent);
    for (const s of plan.suspects) {
      if (s.term.toLowerCase() === lo) s.dismissed = true;
    }
    recomputeLabels(plan);
    recountSingleEntity(plan, ent);
    return ent;
  }

  function promoteSuspect(plan, term, action) {
    const lo = String(term || '').trim().toLowerCase();
    const s = plan.suspects.find((x) => x.term.toLowerCase() === lo);
    if (s) s.dismissed = true;
    if (action === 'dismiss') return true;
    if (action && typeof action === 'object' && action.mergeInto) {
      return addAlias(plan, action.mergeInto, term);
    }
    return Boolean(addCustomEntity(plan, term, action || 'person'));
  }

  function recountSingleEntity(plan, ent) {
    const entries = plan._entries || [];
    ent.count = 0;
    ent.samples = [];
    const skSet = new Set(ent.senderKeys);
    const literalParts = [];
    const wordParts = [];
    for (const t of ent.terms) {
      if (t.kind === 'literal') literalParts.push(escapeRegExp(t.text));
      else if (t.text.length >= 2) wordParts.push(escapeRegExp(t.text));
    }
    const reLit = literalParts.length ? new RegExp(literalParts.join('|'), 'gi') : null;
    const reWord = wordParts.length
      ? new RegExp('(?<![\\p{L}\\p{N}_])(?:' + wordParts.join('|') + ')(?![\\p{L}\\p{N}_])', 'giu')
      : null;

    for (let ei = 0; ei < entries.length; ei++) {
      const e = entries[ei];
      let matched = false;
      if (e.kind === 'message' && skSet.has(e.sender)) {
        ent.count++;
        matched = true;
      }
      if (e.text) {
        if (reLit) {
          const m = e.text.match(reLit);
          if (m) { ent.count += m.length; matched = true; }
        }
        if (reWord) {
          const m = e.text.match(reWord);
          if (m) { ent.count += m.length; matched = true; }
        }
      }
      if (matched && ent.samples.length < 3) {
        ent.samples.push({ entryIdx: ei, sender: e.sender || '', text: cleanSnippet(e.text, 110) });
      }
    }
  }

  /* ========================================================================
   * 7. SINGLE-PASS NON-CASCADING REPLACER ENGINE
   * ======================================================================== */

  function compilePlan(plan, opts) {
    const includeDisabled = Boolean(opts && opts.includeDisabled);
    if (!includeDisabled && plan._compiled) return plan._compiled;

    const patternRules = []; // { re, entity }
    const literalRules = []; // { text, lower, entity, caseSensitive }
    const wordRules = [];    // { text, lower, upper, entity, caseSensitive }
    const literalByLower = new Map();
    const wordByLower = new Map();

    for (const ent of plan.entities) {
      if (!includeDisabled && !isEntityActive(plan, ent)) continue;
      if (ent.patternRe) {
        patternRules.push({ re: new RegExp(ent.patternRe.source, ent.patternRe.flags), entity: ent });
      }
      for (const t of ent.terms) {
        if (!t.text) continue;
        const lo = t.text.toLowerCase();
        if (t.kind === 'literal') {
          if (!literalByLower.has(lo)) {
            const rule = { text: t.text, lower: lo, upper: t.text.toUpperCase(), entity: ent, caseSensitive: Boolean(t.caseSensitive) };
            literalByLower.set(lo, rule);
            literalRules.push(rule);
          }
        } else {
          if (t.text.length < 2) continue;
          if (!wordByLower.has(lo)) {
            const rule = { text: t.text, lower: lo, upper: t.text.toUpperCase(), entity: ent, caseSensitive: Boolean(t.caseSensitive) };
            wordByLower.set(lo, rule);
            wordRules.push(rule);
          }
        }
      }
    }

    // Longest-first ordering so multi-word names & full URLs always beat substrings
    literalRules.sort((a, b) => b.text.length - a.text.length);
    wordRules.sort((a, b) => b.text.length - a.text.length);

    const literalRe = literalRules.length
      ? new RegExp('(' + literalRules.map((r) => escapeRegExp(r.text)).join('|') + ')', 'gi')
      : null;

    const wordRe = wordRules.length
      ? new RegExp('(?<![\\p{L}\\p{N}_])(' + wordRules.map((r) => escapeRegExp(r.text)).join('|') + ')(?![\\p{L}\\p{N}_])', 'giu')
      : null;

    const compiled = {
      plan,
      patternRules,
      literalRe,
      literalByLower,
      wordRe,
      wordByLower,
    };
    if (!includeDisabled) plan._compiled = compiled;
    return compiled;
  }

  function findEntityHitsInString(text, compiled) {
    const hits = [];
    let work = String(text || '').replace(RE_WA_PROTECTED, ' ');
    if (compiled.patternRules && compiled.patternRules.length) {
      for (const pr of compiled.patternRules) {
        pr.re.lastIndex = 0;
        work = work.replace(pr.re, () => {
          hits.push(pr.entity);
          return ' ';
        });
      }
    }
    if (compiled.literalRe) {
      compiled.literalRe.lastIndex = 0;
      work = work.replace(compiled.literalRe, (whole) => {
        const rule = compiled.literalByLower.get(whole.toLowerCase());
        if (rule) hits.push(rule.entity);
        return ' ';
      });
    }
    if (compiled.wordRe) {
      compiled.wordRe.lastIndex = 0;
      for (const m of work.matchAll(compiled.wordRe)) {
        const whole = m[1];
        const rule = compiled.wordByLower.get(whole.toLowerCase());
        if (!rule) continue;
        if (rule.caseSensitive && whole !== rule.text && whole !== rule.upper) continue;
        hits.push(rule.entity);
      }
    }
    return hits;
  }

  // Uses Private Use Area sentinels (\uE000idx\uE001) so replaced spans are
  // immune to subsequent passes (zero cascading, ever!).
  function runReplacer(text, plan, wantSegments) {
    const str = String(text || '');
    if (!str) return wantSegments ? { text: '', segments: [] } : '';
    const compiled = compilePlan(plan);
    const tokens = []; // { kind: 'protected' | 'replaced', text, original, entity }

    function stash(entry) {
      const idx = tokens.length;
      tokens.push(entry);
      return '\uE000' + idx + '\uE001';
    }

    // Phase A: Protect WhatsApp standard system/media markers
    let work = str.replace(RE_WA_PROTECTED, (whole) => stash({ kind: 'protected', text: whole }));

    // Phase A2: Pattern entities (e.g. grouped WhatsApp auto-generated IMG-*/VID-* filenames)
    if (compiled.patternRules && compiled.patternRules.length) {
      for (const pr of compiled.patternRules) {
        pr.re.lastIndex = 0;
        work = work.replace(pr.re, (whole) => stash({
          kind: 'replaced',
          text: getLabel(plan, pr.entity),
          original: whole,
          entity: pr.entity,
        }));
      }
    }

    // Phase B: Replace literal structured tokens (URLs, emails, phones, files, addresses, group names, handles)
    if (compiled.literalRe) {
      compiled.literalRe.lastIndex = 0;
      work = work.replace(compiled.literalRe, (whole) => {
        const rule = compiled.literalByLower.get(whole.toLowerCase());
        if (!rule) return whole;
        if (rule.caseSensitive && whole !== rule.text && whole !== rule.upper) return whole;
        return stash({
          kind: 'replaced',
          text: getLabel(plan, rule.entity),
          original: whole,
          entity: rule.entity,
        });
      });
    }

    // Phase C: Replace word/phrase entities (longest-first, Unicode boundaries)
    if (compiled.wordRe) {
      compiled.wordRe.lastIndex = 0;
      work = work.replace(compiled.wordRe, (whole) => {
        const rule = compiled.wordByLower.get(whole.toLowerCase());
        if (!rule) return whole;
        if (rule.caseSensitive && whole !== rule.text && whole !== rule.upper) return whole;
        return stash({
          kind: 'replaced',
          text: getLabel(plan, rule.entity),
          original: whole,
          entity: rule.entity,
        });
      });
    }

    const RE_SENTINEL = /\uE000(\d+)\uE001/g;

    if (!wantSegments) {
      return work.replace(RE_SENTINEL, (_, n) => tokens[Number(n)].text);
    }

    const segments = [];
    let last = 0;
    let out = '';
    for (const m of work.matchAll(RE_SENTINEL)) {
      if (m.index > last) {
        const plain = work.slice(last, m.index);
        segments.push({ text: plain, replaced: false });
        out += plain;
      }
      const tok = tokens[Number(m[1])];
      if (tok.kind === 'replaced') {
        segments.push({
          text: tok.text,
          replaced: true,
          original: tok.original,
          entityId: tok.entity.id,
          type: tok.entity.type,
          label: tok.text,
        });
      } else {
        segments.push({ text: tok.text, replaced: false });
      }
      out += tok.text;
      last = m.index + m[0].length;
    }
    if (last < work.length) {
      const tail = work.slice(last);
      segments.push({ text: tail, replaced: false });
      out += tail;
    }
    return { text: out, segments };
  }

  function anonymizeString(text, plan) {
    return runReplacer(text, plan, false);
  }

  function anonymizeStringWithDiff(text, plan) {
    return runReplacer(text, plan, true);
  }

  /* ========================================================================
   * 8. MAPS FOR APP / WORD-GAMES INTEGRATION & FULL .TXT EXPORT
   * ======================================================================== */

  function senderLabelMap(plan) {
    const map = new Map();
    if (!plan) return map;
    for (const ent of plan.entities) {
      if (!ent.senderKeys || !ent.senderKeys.length) continue;
      const lbl = isEntityActive(plan, ent) ? getLabel(plan, ent) : ent.primary;
      for (const sk of ent.senderKeys) {
        map.set(sk, lbl);
      }
    }
    return map;
  }

  // Token lookup for words.js (lowercase single words -> active anonymized label)
  function wordTokenMap(plan) {
    const map = new Map();
    if (!plan) return map;
    for (const ent of plan.entities) {
      if (!isEntityActive(plan, ent)) continue;
      const lbl = getLabel(plan, ent);
      for (const t of ent.terms) {
        if (t.text.length >= 2 && !/\s/.test(t.text)) {
          const lo = t.text.toLowerCase();
          if (!map.has(lo)) map.set(lo, lbl);
        }
      }
    }
    return map;
  }

  function exportText(result, plan) {
    const sMap = senderLabelMap(plan);
    const lines = [];
    for (const e of result.entries) {
      const ts = e.bracketed ? '[' + e.ts + ']' : e.ts;
      if (e.kind === 'message') {
        const sender = sMap.get(e.sender) || e.sender;
        const baseText = anonymizeString(e.text, plan);
        const text = e.edited
          ? (baseText ? baseText + ' <This message was edited>' : '<This message was edited>')
          : baseText;
        lines.push(e.bracketed ? ts + ' ' + sender + ': ' + text : ts + ' - ' + sender + ': ' + text);
      } else {
        const text = anonymizeString(e.text, plan);
        lines.push(e.bracketed ? ts + ' ' + text : ts + ' - ' + text);
      }
    }
    return lines.length ? lines.join('\n') + '\n' : '';
  }

  /* ========================================================================
   * 9. PRE-EXPORT LEAK AUDIT
   * ======================================================================== */

  function auditLeaks(result, plan) {
    const entries = (result && result.entries) || [];
    const byType = { person: 0, place: 0, org: 0, contact: 0, file: 0, group: 0 };
    let messagesChanged = 0;
    let totalReplacements = 0;

    // Collect sender name fragments >= 3 alphabetic chars (skip pure-digit chunks of phone senders)
    const senderFragments = [];
    for (const ent of plan.entities) {
      if (!ent.isSender) continue;
      for (const sk of ent.senderKeys) {
        if (isPhoneLikeSender(sk)) continue;
        const clean = stripEmojiAndTags(sk);
        for (const p of clean.split(/\s+/)) {
          if (p.length >= 3 && /\p{L}/u.test(p) && !COMMON_WORDS.has(p.toLowerCase())) {
            senderFragments.push({ raw: p, lower: p.toLowerCase(), label: getLabel(plan, ent) });
          }
        }
      }
    }
    const senderFragRe = senderFragments.length
      ? new RegExp('(?<![\\p{L}\\p{N}_])(' + senderFragments.map((f) => escapeRegExp(f.raw)).join('|') + ')(?![\\p{L}\\p{N}_])', 'giu')
      : null;

    // Active fake/typed labels (so audit never flags our own fake emails/URLs like contact1@example.com)
    const ownLabels = new Set();
    for (const ent of plan.entities) {
      if (isEntityActive(plan, ent)) {
        ownLabels.add(getLabel(plan, ent).toLowerCase());
      }
    }

    const leakBuckets = new Map(); // kind|term -> finding
    function addLeak(severity, kind, term, sample) {
      const k = kind + '|' + term.toLowerCase();
      if (ownLabels.has(term.toLowerCase())) return;
      let f = leakBuckets.get(k);
      if (!f) {
        f = { severity, kind, term, count: 0, sample };
        leakBuckets.set(k, f);
      }
      f.count++;
    }

    const compiled = compilePlan(plan);
    const activeEntities = plan.entities.filter((e) => isEntityActive(plan, e)).length;

    // For very large chats (>15k entries), audit all stats fast and run regex leak checks across every entry
    for (let ei = 0; ei < entries.length; ei++) {
      const e = entries[ei];
      if (!e.text) continue;
      const hits = findEntityHitsInString(e.text, compiled);
      if (hits.length) {
        messagesChanged++;
        totalReplacements += hits.length;
        for (const h of hits) byType[h.type] = (byType[h.type] || 0) + 1;
      }
      const out = anonymizeString(e.text, plan);
      const scanOut = out.replace(RE_WA_PROTECTED, ' ');

      if (senderFragRe) {
        senderFragRe.lastIndex = 0;
        for (const m of scanOut.matchAll(senderFragRe)) {
          addLeak('high', 'sender_fragment', m[1], cleanSnippet(out, 110));
        }
      }
      for (const m of scanOut.matchAll(RE_EMAIL)) {
        if (!/@example\.com$/i.test(m[0])) addLeak('high', 'email', m[0], cleanSnippet(out, 110));
      }
      for (const m of scanOut.matchAll(RE_PHONE)) {
        if (isValidPhone(m[0]) && !/^555-01\d{2}$/.test(m[0])) {
          addLeak('high', 'phone', m[0].trim(), cleanSnippet(out, 110));
        }
      }
      for (const m of scanOut.matchAll(RE_URL)) {
        if (!/example\.com\/link-|maps\.example\/place-/i.test(m[0])) {
          addLeak('medium', 'url', m[0], cleanSnippet(out, 110));
        }
      }
      for (const m of scanOut.matchAll(RE_UK_POSTCODE)) {
        if (!/^ZZ\d+\s+9AA$/i.test(m[0])) {
          addLeak('high', 'postcode', m[0], cleanSnippet(out, 110));
        }
      }
    }

    // Include top unreviewed suspects as low-severity review items
    const activeSuspects = plan.suspects.filter((s) => !s.dismissed);
    const findings = Array.from(leakBuckets.values());
    findings.sort((a, b) => {
      const sev = { high: 0, medium: 1, low: 2 };
      return sev[a.severity] - sev[b.severity] || b.count - a.count;
    });

    const highCount = findings.filter((f) => f.severity === 'high').length;
    const medCount = findings.filter((f) => f.severity === 'medium').length;
    let score = 100 - highCount * 18 - medCount * 8 - Math.min(20, activeSuspects.length * 2);
    score = Math.max(0, Math.min(100, score));

    const status = highCount > 0 ? 'warning' : (medCount > 0 || activeSuspects.length > 0) ? 'review' : 'clean';

    return {
      score,
      status,
      stats: {
        totalMessages: result.total || 0,
        messagesChanged,
        totalReplacements,
        byType,
        activeEntities,
        unreviewedSuspects: activeSuspects.length,
      },
      findings,
    };
  }

  return {
    createPlan,
    getLabel,
    isEntityActive,
    setMode,
    rerollFakeNames,
    setCategoryEnabled,
    toggleEntity,
    setEntityType,
    setEntityCustomLabel,
    mergeEntities,
    addAlias,
    removeAlias,
    addCustomEntity,
    promoteSuspect,
    recomputeLabels,
    compilePlan,
    anonymizeString,
    anonymizeStringWithDiff,
    senderLabelMap,
    wordTokenMap,
    exportText,
    auditLeaks,
  };
});
