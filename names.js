/*
 * names.js — a small built-in list of common personal names, used to anonymize
 * names mentioned INSIDE message texts (not just the chat's senders) when an
 * export is re-exported with the anonymize switch on. See parser.js's
 * detectNames() / replaceNames().
 *
 *   FIRST_NAMES — common first names, canonical capitalization.
 *   SURNAMES    — common surnames, canonical capitalization.
 *   AMBIGUOUS   — names that are also ordinary English words ("Will", "Grace",
 *                 "Cook"…). Those are only replaced when capitalized (or
 *                 ALL-CAPS), so normal prose like "will you come?" or
 *                 "the cook" is left alone. Unambiguous names are replaced in
 *                 any capitalization.
 *
 * The list is deliberately best-effort: it catches common names automatically;
 * anything it misses can be added by hand via the "also hide names" box in the
 * app (parser.js's detectNames accepts extraNames for exactly that).
 *
 * Works in the browser (window.WhatsAppNames) and in node (module.exports).
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.WhatsAppNames = api;
})(typeof self !== 'undefined' ? self : globalThis, function () {
  'use strict';

  const FIRST_NAMES = [
    'Aaron', 'Abigail', 'Ada', 'Adam', 'Adrian', 'Ahmed', 'Alan', 'Albert', 'Alberto', 'Alex',
    'Alexander', 'Alexandra', 'Alfred', 'Ali', 'Alice', 'Alicia', 'Alison', 'Allison', 'Alma',
    'Alyssa', 'Amanda', 'Amber', 'Amelia', 'Amina', 'Amira', 'Amy', 'Ana', 'Anastasia',
    'Andrea', 'Angela', 'Angelica', 'Anita', 'Anna', 'Anne', 'Annie', 'Anthony', 'Antonio',
    'April', 'Aria', 'Ariana', 'Ariel', 'Art', 'Arthur', 'Ashley', 'Austin', 'August', 'Ava',
    'Avery',
    'Barbara', 'Beatrice', 'Beatriz', 'Ben', 'Benjamin', 'Bernard', 'Bill', 'Billy', 'Blanche',
    'Bobby', 'Bonnie', 'Bradley', 'Brenda', 'Bridget', 'Brian', 'Brittany', 'Brooke', 'Bruce',
    'Bryan', 'Caleb', 'Camila', 'Camille', 'Carl', 'Carla', 'Carlos', 'Carmen', 'Carol',
    'Caroline', 'Carolyn', 'Carrie', 'Carson', 'Catherine', 'Cecilia', 'Celia', 'Cesar', 'Chad',
    'Charles', 'Charlie', 'Charlotte', 'Chase', 'Chelsea', 'Chloe', 'Chris', 'Christian', 'Christina',
    'Chip', 'Christine', 'Christopher', 'Claire', 'Clara', 'Clarence', 'Clark', 'Claudia', 'Clay', 'Cody',
    'Colin', 'Connor', 'Cora', 'Courtney', 'Craig', 'Crystal', 'Curtis', 'Cynthia', 'Daisy',
    'Dale', 'Dan', 'Dana', 'Daniel', 'Danielle', 'Danny', 'Daphne', 'Dave', 'David',
    'Dawn', 'Dean', 'Debra', 'Delia', 'Denise', 'Dennis', 'Derek', 'Devin', 'Diana', 'Diane',
    'Fern',
    'Diego', 'Dominic', 'Don', 'Donald', 'Dora', 'Doris', 'Dorothy', 'Doug', 'Dylan',
    'Earl', 'Eden', 'Eddie', 'Edgar', 'Edith', 'Edmond', 'Edmund', 'Edna', 'Edward', 'Edwin',
    'Elaine', 'Eleanor', 'Elena', 'Elisa', 'Eliza', 'Elizabeth', 'Ella', 'Ellen', 'Elliot',
    'Ellie', 'Elsa', 'Elsie', 'Emily', 'Emma', 'Eric', 'Erica', 'Erik', 'Erin', 'Ernest',
    'Esther', 'Ethan', 'Eugene', 'Eva', 'Evan', 'Eve', 'Evelyn', 'Faith', 'Felix', 'Fernando', 'Fiona',
    'Flora', 'Floyd', 'Frances', 'Francis', 'Frank', 'Fred', 'Gabriel', 'Gail', 'Gale',
    'Gary', 'Gavin', 'Gay', 'Gemma', 'George', 'Georgia', 'Gerald', 'Geraldine', 'Gina', 'Ginger',
    'Gladys', 'Glenn', 'Gloria', 'Gordon', 'Grace', 'Graham', 'Grant', 'Greg', 'Gregory',
    'Greta', 'Gwen', 'Hailey', 'Hannah', 'Harold', 'Harper', 'Harry', 'Harvey', 'Hazel',
    'Heather', 'Hector', 'Heidi', 'Helen', 'Helena', 'Henry', 'Herbert', 'Herman', 'Holly', 'Hope',
    'Howard',
    'Hugh', 'Hunter', 'Ian', 'Ida', 'Irene', 'Iris', 'Irma', 'Isaac', 'Isabel', 'Isabella',
    'Isabelle', 'Ivan', 'Ivy', 'Jack', 'Jackson', 'Jacqueline', 'Jacob', 'Jade', 'Jake',
    'James', 'Jamie', 'Jane', 'Janet', 'Janice', 'Jasmine', 'Jason', 'Javier', 'Jay', 'Jean',
    'Jeanette', 'Jeff', 'Jeffrey', 'Jena', 'Jennifer', 'Jeremy', 'Jerome', 'Jesse', 'Jessica', 'Jill',
    'Jim', 'Jimmy', 'Joan', 'Joanna', 'Joanne', 'Joe', 'Joel', 'John', 'Johnny', 'Johnson',
    'Jonathan', 'Jordan', 'Jorge', 'Jose', 'Joseph', 'Josephine', 'Joshua', 'Joy', 'Joyce', 'Juan',
    'June',
    'Judith', 'Judy', 'Julia', 'Julie', 'Justin', 'Kara', 'Karen', 'Karina', 'Karl', 'Kate',
    'Katherine', 'Kathleen', 'Kathryn', 'Katie', 'Kayla', 'Keith', 'Kelly', 'Ken', 'Kenneth',
    'Kevin', 'Kim', 'Kimberly', 'Kira', 'Kristen', 'Kyle', 'Lance', 'Laura', 'Lauren', 'Laurel',
    'Laverne', 'Lawrence', 'Leah', 'Leda', 'Lee', 'Lelia', 'Leo', 'Leon', 'Leonard', 'Leroy',
    'Leslie', 'Lewis', 'Lila', 'Lillian', 'Lily', 'Linda', 'Lisa', 'Liza', 'Lloyd', 'Lois',
    'Lola', 'Logan', 'Loretta', 'Lori', 'Lorraine', 'Louis', 'Lucia', 'Lucy', 'Lydia', 'Mabel',
    'Mae', 'Maggie', 'Manuel', 'Mara', 'Margaret', 'Maria', 'Mariana', 'Marie', 'Marilyn', 'Marina',
    'Mark', 'Mario', 'Marion', 'Marjorie', 'Marlene', 'Martha', 'Martin', 'Marvin', 'Mary',
    'Maryam', 'May',
    'Matt', 'Matthew', 'Maurice', 'Maureen', 'Max', 'Megan', 'Melanie', 'Melissa', 'Michael', 'Michelle',
    'Miguel', 'Mike', 'Mildred', 'Milan', 'Milton', 'Miranda', 'Mitchell', 'Molly', 'Monica', 'Mona',
    'Nancy', 'Naomi', 'Natalie', 'Nathan', 'Neil', 'Nelly', 'Nelson', 'Nicholas', 'Nick', 'Nicole',
    'Nina', 'Noah', 'Noel', 'Nora', 'Norman', 'Olive', 'Oliver', 'Olivia', 'Omar', 'Oscar', 'Owen',
    'Pablo', 'Pamela', 'Pat', 'Patricia', 'Patrick', 'Patsy', 'Paul', 'Paula', 'Pauline', 'Pearl',
    'Peggy', 'Penelope', 'Percy', 'Peter', 'Philip', 'Philippa', 'Phoebe', 'Phyllis', 'Pierre', 'Polly',
    'Priscilla', 'Rachael', 'Rachel', 'Rafael', 'Ralph', 'Ramona', 'Ramon', 'Randall', 'Randy', 'Raquel',
    'Ray', 'Raymond', 'Rebecca', 'Regina', 'Renee', 'Richard', 'Rick', 'Rita', 'Rob', 'Robert',
    'Roberto',
    'Roberta', 'Robin', 'Rochelle', 'Rodney', 'Roger', 'Roland', 'Ron', 'Ronald', 'Rosa', 'Rosalie',
    'Rose', 'Rosemary', 'Ross', 'Roxanne', 'Roy', 'Ruby', 'Russell', 'Ruth', 'Ryan', 'Sabrina',
    'Sadie', 'Sally', 'Sam', 'Samantha', 'Samuel', 'Sandra', 'Sandy', 'Sara', 'Sarah', 'Saul',
    'Scott', 'Sean', 'Sebastian', 'Selena', 'Serena', 'Seth', 'Shane', 'Shannon', 'Shaun', 'Shawn',
    'Sheila', 'Sheldon', 'Shirley', 'Sidney', 'Silvia', 'Simon', 'Sonia', 'Sophia', 'Sophie',
    'Spencer', 'Stacy', 'Stan', 'Stanley', 'Stella', 'Stephanie', 'Stephen', 'Steve', 'Steven', 'Stuart',
    'Susan', 'Sven', 'Sylvia', 'Tamara', 'Tanya', 'Teresa', 'Terry', 'Tess', 'Tessa', 'Thelma',
    'Theresa', 'Thomas', 'Theodore', 'Tiffany', 'Tim', 'Timothy', 'Tina', 'Todd', 'Tom', 'Tomas',
    'Tommy', 'Tony', 'Tracy', 'Travis', 'Trevor', 'Troy', 'Tyler', 'Valerie', 'Vanessa', 'Vera',
    'Veronica', 'Victor', 'Victoria', 'Vincent', 'Viola', 'Violet', 'Virginia', 'Vivian', 'Wade', 'Walter',
    'Warren',
    'Wayne', 'Wendy', 'Wesley', 'Whitney', 'Will', 'Wilfred', 'Wilma', 'Winifred', 'Yvette', 'Yvonne',
    'Zach', 'Zack', 'Zara', 'Zoe',
  ];

  const SURNAMES = [
    'Adams', 'Allen', 'Alvarez', 'Anderson', 'Archer', 'Bailey', 'Baker', 'Bennett', 'Bird', 'Bishop',
    'Brooks', 'Brown', 'Campbell', 'Carter', 'Castillo', 'Chavez', 'Clark', 'Collins', 'Cook', 'Cooper',
    'Cox', 'Cruz', 'Farmer', 'Fisher', 'Fox', 'Hawk', 'Knight', 'Lamb', 'Mason', 'Page', 'Porter',
    'Queen', 'Weaver', 'Wolf',
    'Davis', 'Diaz', 'Edwards', 'Evans', 'Flores', 'Foster', 'Garcia', 'Gomez', 'Gonzalez', 'Gray',
    'Green', 'Gutierrez', 'Hall', 'Harris', 'Hernandez', 'Hill', 'Howard', 'Hughes', 'Jackson', 'James',
    'Jenkins', 'Jimenez', 'Johnson', 'Jones', 'Kelly', 'King', 'Lee', 'Lewis', 'Long', 'Lopez',
    'Martin', 'Martinez', 'Mendoza', 'Miller', 'Mitchell', 'Moore', 'Morgan', 'Morales', 'Morris', 'Morphy',
    'Murphy', 'Myers', 'Nelson', 'Nguyen', 'Ortiz', 'Parker', 'Patel', 'Perez', 'Peterson', 'Phillips',
    'Price', 'Reed', 'Reyes', 'Richardson', 'Rivera', 'Roberts', 'Robinson', 'Rodriguez', 'Rogers', 'Ross',
    'Ramos', 'Russell', 'Sanders', 'Sanchez', 'Scott', 'Smith', 'Stewart', 'Taylor', 'Thomas', 'Thompson',
    'Torres', 'Turner', 'Walker', 'Ward', 'Watson', 'White', 'Williams', 'Wilson', 'Wood', 'Wright',
    'Young',
  ];

  // Names that double as ordinary English words. These are only replaced when
  // they appear capitalized ("Will") or in ALL-CAPS ("WILL") — never as the
  // lowercase everyday word ("will"), so sentences aren't mangled.
  const AMBIGUOUS = new Set([
    'April', 'Archer', 'Art', 'August', 'Baker', 'Bill', 'Bird', 'Bishop', 'Chase', 'Chip',
    'Clay', 'Cook', 'Crystal', 'Daisy', 'Dawn', 'Faith', 'Farmer', 'Fern', 'Fisher', 'Flora',
    'Fox', 'Frank', 'Gale', 'Gay', 'Grace', 'Hawk', 'Hazel', 'Hope', 'Hunter', 'Ivy',
    'Jade', 'Joy', 'June', 'King', 'Knight', 'Lamb', 'Lily', 'Mark', 'Mason', 'May',
    'Olive', 'Page', 'Pat', 'Pearl', 'Porter', 'Queen', 'Rob', 'Rose', 'Ruby', 'Violet',
    'Weaver', 'Will', 'Wolf', 'Wood',
  ]);

  return { FIRST_NAMES, SURNAMES, AMBIGUOUS };
});
