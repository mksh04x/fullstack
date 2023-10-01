import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ message }) => {
  if (message === null || message === '') {
    return null;
  }

  return (
    <div className="message">
      {message}
    </div>
  );
}

const Filter = ({ filterBySearch, clearFilter }) => {
  return (
    <div>
      filter shown with <input onChange={filterBySearch} />
    </div>
  );
};

const AddPersonForm = ({ addPerson, newName, setNewName, newNumber, setNewNumber }) => {
  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <h2>add a new</h2>
        <div>
          name: <input onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number: <input onChange={(e) => setNewNumber(e.target.value)} />
        </div>
        <div>
          <button type="button" onClick={(addPerson)} >add</button>
        </div>
      </form>
    </div>
  );
};

const PersonList = ({ persons, delPerson }) => {
  return (
    <div>
      <h2>numbers</h2>
      {persons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number} <button type="button" onClick={() => delPerson(person.id)} >delete</button>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filteredList, setFilteredList] = new useState(persons)
  const newPerson = { name: newName, number: newNumber }
  const [message, setMessage] = useState('')

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        console.log('response:', response);
        setPersons(response)
        setFilteredList(response);
        console.log('render', persons.length, 'persons')
      })
  }, [])

  const delPerson = id => {
    const ifDel = window.confirm('Are you sure you want to delete this person?')
    if (!ifDel) {
      return;
    }

    personService
      .del(id)
      .then(response => {
        console.log('person deleted')
        console.log(response)
        const updatedPersons = persons.filter(person => person.id !== id);
        setPersons(updatedPersons)
        setFilteredList(updatedPersons)
        setMessage('deleted')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
      )
  }

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      const ifEdit = window.confirm(
        `${newName} is already added to the phonebook, replace the old number with a new one?`
      );

      if (ifEdit) {
        const changedPerson = { ...existingPerson, number: newNumber };
        personService
          .update(existingPerson.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : returnedPerson)
            );

            setNewName('');
            setNewNumber('');
            setFilteredList([
              ...persons.map((person) => person.id !== existingPerson.id ? person : returnedPerson),
            ]);
            setMessage(`number of ${newName} updated`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            console.log('number updated');
          })
          .catch(error => {
            setMessage(
              `this person was already deleted from the server`)
              console.log('this person was already deleted from the server')
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setPersons(persons.filter(n => n.id !== existingPerson.id))
          })
      }
    } else {
      personService
        .create(newPerson)
        .then((response) => {
          setPersons(persons.concat(response));
          setNewName('');
          setNewNumber('');
          setFilteredList([...persons, response]);
          setMessage(`added ${newName}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          console.log('new person added');
        });
    }
  };

  const filterBySearch = (e) => {
    const query = e.target.value.toLowerCase();
    const updatedList = persons.filter((person) =>
      person.name.toLowerCase().includes(query)
    );
    setFilteredList(updatedList);
  };

  return (
    <div>
      <h2>phonebook</h2>
      <Notification message={message} />
      <Filter filterBySearch={filterBySearch} />
      <AddPersonForm
        addPerson={addPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber} />
      <PersonList persons={filteredList} delPerson={delPerson} />
    </div>
  );
}

export default App