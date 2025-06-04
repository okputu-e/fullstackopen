import { useState, useEffect } from "react";
import personService from "./services/persons";
import "./index.css";

const Notifications = ({ message, label }) => {
  if (message === null) {
    return null;
  }

  return <div className={label}>{message}</div>;
};

const Persons = ({ personEl }) => personEl;

const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onChange} />
    </div>
  );
};

const PersonForm = ({
  addName,
  newName,
  handleNameChange,
  newNumber,
  handleNumChange,
}) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number:{" "}
        <input type="tel" value={newNumber} onChange={handleNumChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilterName] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // axios
  useEffect(() => {
    personService.getAll().then((savedPersons) => setPersons(savedPersons));
  }, []);

  // derive state
  const personEl = persons
    .filter((person) =>
      person.name.toLowerCase().includes(filterName.toLowerCase())
    )
    .map((person) => (
      <div key={person.id}>
        {person.name} {person.number}
        <button onClick={() => deleteContact(person)}>delete</button>
      </div>
    ));

  const handleFliterChange = (event) => {
    setFilterName(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumChange = (event) => {
    setNewNumber(event.target.value);
  };

  const addName = (event) => {
    event.preventDefault();

    if (newName === "" || newNumber === "") {
      alert("Name and Number cannot be empty");
      return;
    }

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      if (existingPerson.number === newNumber) {
        alert(`${newName} already has this number in the phonebook.`);
        return;
      }

      const confirm = window.confirm(
        `${existingPerson.name} is already added to Phonebook, replace oldnumber with new one?`
      );

      if (confirm) {
        const newObject = { ...existingPerson, number: newNumber };
        personService
          .update(existingPerson.id, newObject)
          .then((updatePerson) => {
            setPersons(
              persons.map((person) =>
                person.id === existingPerson.id ? updatePerson : person
              )
            );
            setNewName("");
            setNewNumber("");
          });
      }
      return;
    }

    const newPerson = { name: newName, number: newNumber };

    personService
      .create(newPerson)
      .then((returnPerson) => {
        setPersons((prevPersons) => prevPersons.concat(returnPerson));
        setSuccessMessage(`Added ${newPerson.name}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        console.log(error.response.data.error);
        setErrorMessage(error.response.data.error);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const deleteContact = (contact) => {
    const confirmDelete = window.confirm(`Delete ${contact.name}`);
    if (confirmDelete) {
      personService
        .deletePerson(contact.id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== contact.id));
          setSuccessMessage(`Delete ${contact.name}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        })
        .catch(() => {
          setErrorMessage(
            "This person contact has already been removed from db"
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
          setPersons(persons.filter((person) => person.id !== contact.id));
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {successMessage && (
        <Notifications label="success" message={successMessage} />
      )}
      {errorMessage && <Notifications label="error" message={errorMessage} />}
      <Filter value={filterName} onChange={handleFliterChange} />

      <h2>Add New Contact</h2>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumChange={handleNumChange}
      />

      <h2>Numbers</h2>
      <Persons personEl={personEl} />
    </div>
  );
};

export default App;
