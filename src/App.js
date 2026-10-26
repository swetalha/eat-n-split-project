import { useState } from "react";

// CHANGED: Every person now has a unique ID and a defined balance.
const initialPeople = [
  { id: "1", name: "Daim", balance: -300 },
  { id: "2", name: "Maryam", balance: -100 },
  { id: "3", name: "Talal", balance: 200 },
  { id: "4", name: "Shehla", balance: -500 },
];

// Reusable button component.
function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-lg bg-orange-400 px-4 py-2 font-semibold
        transition-colors hover:bg-orange-500 ${className}`}
    >
      {children}
    </button>
  );
}

// Displays an individual person and their balance.
function Person({ person, isSelected, onSelect }) {
  const { name, balance } = person;

  return (
    <div
      className={`flex w-full items-center gap-4 rounded-xl p-3
        ${isSelected ? "bg-orange-100" : ""}`}
    >
      <img
        src="/profile-picture.jpg"
        alt=""
        className="h-12 w-12 rounded-full object-cover"
      />

      <div className="flex-1">
        <h3 className="text-xl font-semibold">{name}</h3>

        {balance > 0 ? (
          <p className="font-medium text-green-600">
            {name} owes you ${balance.toFixed(2)}
          </p>
        ) : balance < 0 ? (
          <p className="font-medium text-red-600">
            You owe ${Math.abs(balance).toFixed(2)} to {name}
          </p>
        ) : (
          <p className="font-medium text-gray-500">You're all settled up</p>
        )}
      </div>

      <Button onClick={() => onSelect(person.id)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </div>
  );
}

// Handles adding a new person.
function AddPerson({ onAddPerson, onCancel }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();

    // ADDED: Prevent empty names.
    if (!trimmedName) {
      setError("Please enter a name.");
      return;
    }

    // CHANGED: Parent handles the actual state update.
    onAddPerson({
      id: crypto.randomUUID(),
      name: trimmedName,
      balance: 0,
    });

    setName("");
    setError("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex flex-col gap-4 rounded-xl bg-orange-100 p-6"
    >
      <label htmlFor="person-name" className="font-medium">
        Person's name
      </label>

      <input
        id="person-name"
        type="text"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          setError("");
        }}
        placeholder="Enter name"
        className="rounded-lg border border-gray-300 bg-white p-3"
      />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit">Add Person</Button>

        <Button onClick={onCancel} className="bg-gray-200 hover:bg-gray-300">
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Handles splitting a bill with the selected person.
function BillSplit({ person, onSplit, onCancel }) {
  // CHANGED: Store input values as strings.
  // This allows users to clear fields without issues.
  const [bill, setBill] = useState("");
  const [selfExpense, setSelfExpense] = useState("");
  const [payee, setPayee] = useState("me");
  const [error, setError] = useState("");

  // CHANGED: Derive the other person's expense instead
  // of storing it in another useState variable.
  const billAmount = Number(bill);
  const myExpense = Number(selfExpense);

  const personExpense =
    bill === "" || selfExpense === "" ? null : billAmount - myExpense;

  function handleSubmit(event) {
    event.preventDefault();

    // ADDED: Validate all monetary inputs.
    if (
      bill.trim() === "" ||
      selfExpense.trim() === "" ||
      !Number.isFinite(billAmount) ||
      !Number.isFinite(myExpense) ||
      billAmount <= 0 ||
      myExpense < 0 ||
      myExpense > billAmount
    ) {
      setError("Please enter valid bill and expense amounts.");
      return;
    }

    // ADDED: Calculate the balance change.
    // Positive means the person owes you.
    // Negative means you owe the person.
    const balanceChange = payee === "me" ? personExpense : -myExpense;

    // CHANGED: Pass only the balance change to App.
    onSplit(balanceChange);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-5 rounded-xl bg-orange-100 p-6 md:w-[450px]"
    >
      <h2 className="text-2xl font-bold uppercase">
        Split a bill with {person.name}
      </h2>

      <div className="flex flex-col gap-2">
        <label htmlFor="bill-amount" className="font-medium">
          Total bill
        </label>

        <input
          id="bill-amount"
          type="number"
          min="0"
          step="0.01"
          value={bill}
          onChange={(event) => {
            setBill(event.target.value);
            setError("");
          }}
          placeholder="Enter bill amount"
          className="rounded-lg border border-gray-300 bg-white p-3"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="self-expense" className="font-medium">
          Your expense
        </label>

        <input
          id="self-expense"
          type="number"
          min="0"
          step="0.01"
          value={selfExpense}
          onChange={(event) => {
            setSelfExpense(event.target.value);
            setError("");
          }}
          placeholder="Enter your share"
          className="rounded-lg border border-gray-300 bg-white p-3"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="person-expense" className="font-medium">
          {person.name}'s expense
        </label>

        <input
          id="person-expense"
          type="text"
          value={
            personExpense === null
              ? ""
              : personExpense >= 0
                ? personExpense.toFixed(2)
                : "Invalid amount"
          }
          readOnly
          className="rounded-lg border border-gray-300 bg-gray-100 p-3"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="payee" className="font-medium">
          Who paid the bill?
        </label>

        <select
          id="payee"
          value={payee}
          onChange={(event) => setPayee(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white p-3"
        >
          <option value="me">Me</option>
          <option value="person">{person.name}</option>
        </select>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit">Split Bill</Button>

        <Button onClick={onCancel} className="bg-gray-200 hover:bg-gray-300">
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Main application component.
function App() {
  const [people, setPeople] = useState(initialPeople);

  // CHANGED: Store only the selected person's ID.
  const [selectedPersonId, setSelectedPersonId] = useState(null);

  const [showAddPerson, setShowAddPerson] = useState(false);

  // CHANGED: Derive selectedPerson from the current people array.
  const selectedPerson = people.find(
    (person) => person.id === selectedPersonId,
  );

  function handleSelectPerson(id) {
    // Select the person, or close the form if already selected.
    setSelectedPersonId((currentId) => (currentId === id ? null : id));

    setShowAddPerson(false);
  }

  function handleAddPerson(newPerson) {
    // Immutable array update.
    setPeople((currentPeople) => [...currentPeople, newPerson]);

    setShowAddPerson(false);
  }

  function handleSplit(balanceChange) {
    if (selectedPersonId === null) return;

    // CHANGED: Identify people by unique ID, not name.
    setPeople((currentPeople) =>
      currentPeople.map((person) =>
        person.id === selectedPersonId
          ? {
              ...person,
              balance: person.balance + balanceChange,
            }
          : person,
      ),
    );

    // Close the form after splitting.
    setSelectedPersonId(null);
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-6 md:flex-row">
      <section className="w-full md:w-[450px]">
        <h1 className="mb-6 text-3xl font-bold">Split Expenses</h1>

        <div className="flex flex-col gap-3">
          {people.map((person) => (
            <Person
              key={person.id}
              person={person}
              isSelected={person.id === selectedPersonId}
              onSelect={handleSelectPerson}
            />
          ))}
        </div>

        <div className="mt-6">
          <Button
            onClick={() => {
              setShowAddPerson((current) => !current);
              setSelectedPersonId(null);
            }}
          >
            {showAddPerson ? "Close" : "Add Person"}
          </Button>
        </div>

        {showAddPerson && (
          <AddPerson
            onAddPerson={handleAddPerson}
            onCancel={() => setShowAddPerson(false)}
          />
        )}
      </section>

      {/* CHANGED: The selected person determines form visibility. */}
      {selectedPerson && (
        <section className="w-full md:w-auto">
          <BillSplit
            // ADDED: Reset form state when switching people.
            key={selectedPerson.id}
            person={selectedPerson}
            onSplit={handleSplit}
            onCancel={() => setSelectedPersonId(null)}
          />
        </section>
      )}
    </main>
  );
}

export default App;
