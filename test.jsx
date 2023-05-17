db.Movies.insertMany([
  {
    Title: "The Godfather",
    Description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    Genre: {
      Name: "Crime",
      Description:
        "A crime film is a genre that focuses on the criminal activities of characters.",
    },
    Director: {
      Name: "Francis Ford Coppola",
      Bio: "Francis Ford Coppola is an American film director, producer, and screenwriter.",
      Birth: "1939",
    },
    ImagePath: "thegodfather.jpg",
    Featured: true,
    Actors: ["Marlon Brando", "Al Pacino", "James Caan"],
  },
  {
    Title: "The Dark Knight",
    Description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    Genre: {
      Name: "Action",
      Description:
        "An action film is a genre that emphasizes physical action and stunts.",
    },
    Director: {
      Name: "Christopher Nolan",
      Bio: "Christopher Nolan is a British-American film director, producer, and screenwriter.",
      Birth: "1970",
    },
    ImagePath: "thedarkknight.jpg",
    Featured: false,
    Actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
  },
  {
    Title: "Schindler's List",
    Description:
      "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
    Genre: {
      Name: "Drama",
      Description:
        "A drama film is a genre that focuses on realistic characters and emotional themes.",
    },
    Director: {
      Name: "Steven Spielberg",
      Bio: "Steven Spielberg is an American film director, producer, and screenwriter.",
      Birth: "1946",
    },
    ImagePath: "schindlerslist.jpg",
    Featured: true,
    Actors: ["Liam Neeson", "Ben Kingsley", "Ralph Fiennes"],
  },
  {
    Title: "The Lord of the Rings: The Fellowship of the Ring",
    Description:
      "A young hobbit, Frodo, who has found the One Ring that belongs to the Dark Lord Sauron, begins his journey with eight companions to Mount Doom, the only place where it can be destroyed.",
    Genre: {
      Name: "Fantasy",
      Description:
        "A fantasy film is a genre that uses magic and supernatural elements as a primary plot or setting.",
    },
    Director: {
      Name: "Peter Jackson",
      Bio: "Peter Jackson is a New Zealand film director, producer, and screenwriter.",
      Birth: "1961",
    },
    ImagePath: "thelordoftherings.jpg",
    Featured: false,
    Actors: ["Elijah Wood", "Ian McKellen", "Viggo Mortensen"],
  },
  {
    Title: "Kill Bill: Vol. 1",
    Description:
      "After awakening from a four-year coma, a former assassin wreaks vengeance on the team of assassins who betrayed her.",
    Genre: {
      Name: "Action",
      Description:
        "Action films involve a lot of physical action and often include high-stakes, chase scenes, fights, and rescues.",
    },
    Director: {
      Name: "Quentin Tarantino",
      Bio: "Quentin Jerome Tarantino is an American filmmaker and actor.",
      Birth: "1963",
      Death: "",
    },
    ImagePath: "killbillvol1.png",
    Featured: false,
    Actors: ["Uma Thurman", "Lucy Liu", "Vivica A. Fox", "Daryl Hannah"],
  },
  {
    Title: "Se7en",
    Description:
      "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.",
    Genre: {
      Name: "Thriller",
      Description:
        "Thriller film, also known as suspense film or suspense thriller, is a broad film genre that involves excitement and suspense in the audience.",
    },
    Director: {
      Name: "David Fincher",
      Bio: "David Andrew Leo Fincher is an American film director.",
      Birth: "1962",
      Death: "",
    },
    ImagePath: "se7en.png",
    Featured: false,
    Actors: ["Brad Pitt", "Morgan Freeman", "Gwyneth Paltrow"],
  },
  {
    Title: "Forrest Gump",
    Description:
      "The presidencies of Kennedy and Johnson, the Vietnam War, and the civil rights movement shape the events of a man named Forrest Gump.",
    Genre: {
      Name: "Drama",
      Description:
        "Dramatic films are intended to be serious presentations or stories with settings or life situations that portray realistic characters in conflict with either themselves, others, or forces of nature.",
    },
    Director: {
      Name: "Robert Zemeckis",
      Bio: "Robert Lee Zemeckis is an American film director, producer, and screenwriter.",
      Birth: "1952",
      Death: "",
    },
    ImagePath: "forrestgump.png",
    Featured: true,
    Actors: ["Tom Hanks", "Robin Wright", "Gary Sinise"],
  },
  {
    Title: "Back to the Future",
    Description:
      "Marty McFly, a 17-year-old high school student, is accidentally sent 30 years into the past in a time-traveling DeLorean invented by his close friend, the eccentric scientist Doc Brown.",
    Genre: {
      Name: "Adventure",
      Description:
        "Films that involve a journey, often to a distant or exotic location, and often involving danger or exciting experiences.",
    },
    Director: {
      Name: "Robert Zemeckis",
      Bio: "Robert Lee Zemeckis is an American film director, producer, and screenwriter.",
      Birth: "1952",
      Death: "",
    },
    ImagePath: "backtothefuture.png",
    Featured: true,
    Actors: ["Michael J. Fox", "Christopher Lloyd", "Lea Thompson"],
  },
  {
    Title: "The Hunger Games",
    Description:
      "In a dystopian future, the totalitarian nation of Panem is divided into 12 districts and the Capitol. Each year two young representatives from each district are selected by lottery to participate in The Hunger Games. Part entertainment, part brutal retribution for a past rebellion, the televised games are broadcast throughout Panem. The 24 participants are forced to eliminate their competitors while the citizens of Panem are required to watch.",
    Genre: {
      Name: "Action",
      Description:
        "Action films usually include high-energy, big-budget physical stunts and chases, possibly with rescues, battles, fights, escapes, destructive crises (floods, explosions, natural disasters, fires, etc.), non-stop motion, spectacular rhythm and pacing, and adventurous, often two-dimensional 'good-guy' heroes (or recently, heroines) battling 'bad guys' - all designed for pure audience escapism.",
    },
    Director: {
      Name: "Gary Ross",
      Bio: "Gary Ross is an American film director, writer, and producer.",
      Birth: "1956",
      Death: null,
    },
    ImagePath: "hungergames.jpg",
    Featured: false,
    Actors: [
      "Jennifer Lawrence",
      "Josh Hutcherson",
      "Liam Hemsworth",
      "Woody Harrelson",
      "Elizabeth Banks",
      "Donald Sutherland",
    ],
  },
]);

db.users.insertMany([
  {
    Username: "johnsmith",
    Password: "password123",
    Email: "johnsmith@example.com",
    Birth_date: new Date("1985-06-10"),
    Favourite_movies: [
      ObjectId("645aa5364ac45099a7ce1abd"),
      ObjectId("645abd06d75c9e7b7b687897"),
      ObjectId("645abd06d75c9e7b7b687898"),
    ],
  },
  {
    Username: "janedoe",
    Password: "letmein456",
    Email: "janedoe@example.com",
    Birth_date: new Date("1990-02-14"),
    Favourite_movies: [
      ObjectId("645abd06d75c9e7b7b687899"),
      ObjectId("645abd06d75c9e7b7b68789a"),
      ObjectId("645abd06d75c9e7b7b68789b"),
    ],
  },
  {
    Username: "bobross",
    Password: "happytrees",
    Email: "bobross@example.com",
    Birth_date: new Date("1942-10-29"),
    Favourite_movies: [
      ObjectId("645abd06d75c9e7b7b68789c"),
      ObjectId("645abd06d75c9e7b7b68789d"),
      ObjectId("645abd06d75c9e7b7b68789e"),
    ],
  },
  {
    Username: "alicecooper",
    Password: "blackwidow69",
    Email: "alicecooper@example.com",
    Birth_date: new Date("1970-02-04"),
    Favourite_movies: [
      ObjectId("645aa5364ac45099a7ce1abd"),
      ObjectId("645abd06d75c9e7b7b687897"),
      ObjectId("645abd06d75c9e7b7b687898"),
    ],
  },
  {
    Username: "davidsilver",
    Password: "redsoxrule",
    Email: "davidsilver@example.com",
    Birth_date: new Date("1983-09-02"),
    Favourite_movies: [
      ObjectId("645abd06d75c9e7b7b68789c"),
      ObjectId("645abd06d75c9e7b7b68789d"),
      ObjectId("645abd06d75c9e7b7b68789e"),
    ],
  },
]);

db.movies.updateOne(
  { _id: ObjectId("645abd06d75c9e7b7b68789e") },{ _id: ObjectId("645abd06d75c9e7b7b68789d") },
  {
    $set: {
      Death:
        "Still Alive",
    }
  }
);
