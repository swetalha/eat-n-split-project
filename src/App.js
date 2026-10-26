import { useState } from "react";

const arrPeople = [
  {
    name: "Daim",
    balance: -300,
  },
  {
    name: "Maryam",
    balance: -100,
  },
  {
    name: "Talal",
    balance: 200,
  },
  {
    name: "Shehla",
    balance: -500,
  },
];

function Person({ name, balance, handlePersonSelect }) {
  return (
    <div className="box-person flex items-center gap-4 w-[450px]">
      <img
        src="/profile-picture.jpg"
        alt="profile-picture"
        className="w-10 rounded-full"
      />
      <div>
        <h3 className="font-[600] text-[22px]">{name}</h3>
        {balance ? (
          balance > 0 ? (
            <p className="text-[16px] font-[500] text-green-500">
              {name} owes you ${balance}
            </p>
          ) : (
            <p className="text-[16px] font-[500] text-red-500">
              You owe ${balance} to {name}
            </p>
          )
        ) : (
          <p className="text-[16px] font-[500] text-green-400">Clean Slate</p>
        )}
      </div>
      <button
        onClick={() => {
          handlePersonSelect(name);
        }}
      >
        Select
      </button>
    </div>
  );
}

function AddPerson({ setPeople, setAddPerson }) {
  const [name, setName] = useState("");
  return (
    <div className="box-add-person w-[450px] p-6 bg-orange-200 my-6 rounded-xl">
      <div>
        <form>
          <label>
            <input
              type="text"
              name="Name"
              id="text-name"
              placeholder="Enter Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <button
            onClick={(event) => {
              event.preventDefault();
              setPeople((current) => [...current, { name }]);
              setName("");
              setAddPerson(false);
            }}
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [people, setPeople] = useState([...arrPeople]);
  const [addPerson, setAddPerson] = useState(false);

  function handlePersonSelect(name) {
    const person = people.find((person) => person.name === name);
    console.log(person);
  }

  return (
    <div className="container">
      {/* The list of people */}
      <div className="box-people flex flex-col gap-6">
        {people.map((person, index) => (
          <Person
            name={person.name}
            balance={person.balance}
            handlePersonSelect={handlePersonSelect}
            key={index + 1}
          />
        ))}
        <button onClick={() => setAddPerson((current) => !current)}>
          Add Person
        </button>
      </div>
      {/* The add person box */}
      {addPerson ? (
        <AddPerson setPeople={setPeople} setAddPerson={setAddPerson} />
      ) : (
        ``
      )}
      {/* The main bill split box */}
      <div className="box-bill-split"></div>
    </div>
  );
}
export default App;
