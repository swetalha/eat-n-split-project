import { useState } from "react";

const arrPeople = [
  {
    name: "Harry",
    balance: -300,
  },
  {
    name: "Brian",
    balance: -100,
  },
  {
    name: "Sarah",
    balance: 200,
  },
  {
    name: "Jill",
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
              You owe ${Math.abs(balance)} to {name}
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

function BillSplit({ name, handleSplit }) {
  const [bill, setBill] = useState(null);
  const [selfExpense, setSelf] = useState(null);
  const [personExpense, setPerson] = useState(null);
  const [payee, setPayee] = useState("me");
  return (
    <div className="box-bill-split min-w-[450px] bg-orange-200 p-6 flex flex-col gap-4 rounded-xl h-fit">
      <h1 className="uppercase text-2xl font-[600]">
        SPLIT A BILL WITH {name}
      </h1>
      <form className="flex flex-col gap-4">
        <label>
          <input
            type="text"
            name="text-amount"
            id="text-amount"
            placeholder="Bill Amount"
            onChange={(event) => setBill(Number(event.target.value))}
          />
        </label>
        <label>
          <input
            type="text"
            name="text-self-amount"
            id="text-self-amount"
            placeholder="Your Expense"
            onChange={(event) => setSelf(Number(event.target.value))}
          />
        </label>
        <label>
          <input
            type="text"
            name="text-person-amount"
            id="text-person-amount"
            placeholder={`${name}'s Expense`}
            onChange={(event) => setPerson(Number(event.target.value))}
          />
        </label>
        <label>
          Who's Paying?
          <select
            className="spaced-input"
            value={payee}
            onChange={(event) => setPayee(event.target.value)}
          >
            <option value="me">Me</option>
            <option value={name}>{name}</option>
          </select>
        </label>
      </form>
      <button
        onClick={() => {
          handleSplit(bill, selfExpense, personExpense, payee);
        }}
      >
        Split
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
              className="spaced-input"
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
  const [person, setPerson] = useState({});
  const [people, setPeople] = useState([...arrPeople]);
  const [addPerson, setAddPerson] = useState(false);
  const [billSplit, setBillSplit] = useState(false);

  function handlePersonSelect(name) {
    setPerson(people.find((person) => person.name === name));
    setBillSplit(true);
  }

  function handleSplit(amount, selfExpense, personExpense, payee) {
    if (selfExpense + personExpense !== amount) {
      alert("There's a mismatch between the expenses, try again");
      return;
    }

    const balanceChange = payee === "me" ? personExpense : -selfExpense;
    setPeople((currentPeople) =>
      currentPeople.map((currentPerson) =>
        currentPerson.name === person.name
          ? {
              ...currentPerson,
              balance: (currentPerson.balance ?? 0) + balanceChange,
            }
          : currentPerson,
      ),
    );

    setBillSplit(false);
  }

  return (
    <div className="container flex gap-6">
      {/* The list of people */}
      <div>
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
      </div>
      {/* The main bill split box */}
      {billSplit ? (
        <BillSplit name={person.name} handleSplit={handleSplit} />
      ) : (
        ``
      )}
    </div>
  );
}
export default App;
