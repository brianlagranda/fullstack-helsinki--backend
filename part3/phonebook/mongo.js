const mongoose = require("mongoose");

const password = process.argv[2];
const newName = process.argv[3];
const newNumber = process.argv[4];

const url = process.env.MONGODB_URI;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const showPhonebook = () => {
  console.log("phonebook:");

  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
};

mongoose
  .connect(url)
  .then(() => {
    if (process.argv.length < 3) {
      console.log("You need to specify password");
      process.exit(1);
    }

    if (process.argv.length === 3) {
      showPhonebook();
    }

    if (process.argv.length === 4) {
      console.log("Contact's number is missing");
      process.exit(1);
    }

    if (process.argv.length === 5) {
      const person = new Person({
        name: newName,
        number: newNumber,
      });

      person.save().then((result) => {
        console.log(
          `added ${person.name} number ${person.number} to phonebook`
        );
        mongoose.connection.close();
      });
    } else {
      console.log(
        "Too much arguments specified. Try again with less arguments"
      );
      process.exit(1);
    }
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
