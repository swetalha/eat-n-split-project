import { useState } from "react";

const arrPeople = [
  {
    name: "Daim",
    balance: -300,
  },
  {
    name: "Talal",
    balance: 50,
  },
  {
    name: "Maryam",
    balance: -100,
  },
  {
    name: "Meerab",
    balance: -100,
  },
];

function Button({ children }) {
  return (
    <button className="font-[600] bg-orange-400 px-3 py-1 rounded-xl ml-auto">
      {children}
    </button>
  );
}

function Person({ name, balance }) {
  return (
    <div className="flex gap-4 w-full items-center">
      <img
        src="/profile-picture.jpg"
        alt="profile-picture"
        className="w-12 rounded-full"
      />
      <div>
        <h2 className="text-[24px] font-[500]">{name}</h2>
        {balance > 0 ? (
          <p className="text-[16px] text-red-400 font-[500]">
            {name} owes you ${balance}
          </p>
        ) : (
          <p className="text-[16px] text-green-400 font-[500]">
            You owe ${Math.abs(balance)} to {name}
          </p>
        )}
      </div>
      <Button>Select</Button>
    </div>
  );
}

function AddPerson() {
  return (
    <div className="box-add-people w-[400px] h-auto flex flex-col gap-6 my-8 bg-orange-200 p-6 rounded-xl">
      <form>
        <label>
          <span className="text-[18px] font-[500]">Enter name</span>
          <input
            type="text"
            name="name"
            placeholder="Name"
            id="text-name"
            className="input"
          />
        </label>
      </form>
      <Button>Add</Button>
    </div>
  );
}

function BillSplit({ name }) {
  return (
    <div className="box-bill-split w-[450px] bg-orange-200 rounded-2xl flex flex-col gap-6 h-auto p-6 m-8">
      <h1 className="font-[600] text-3xl uppercase">
        Split a Bill with {name}
      </h1>
      <form className="flex flex-col gap-4">
        <label>
          <span>Bill Amount</span>
          <input
            type="text"
            name="bill-value"
            id="text-bill-value"
            placeholder="Amount"
          ></input>
        </label>
        <label>
          <span>Your Expense</span>
          <input
            type="text"
            name="self-value"
            id="text-self-value"
            placeholder="Amount"
          ></input>
        </label>
        <label>
          <span>{name}'s Amount</span>
          <input
            type="text"
            name="person-value"
            id="text-person-value"
            placeholder="Amount"
          ></input>
        </label>
        <label>
          <span>Who's paying?</span>
          <select>
            <option value="me">Me</option>
            <option value={name}>{name}</option>
          </select>
        </label>
      </form>
      <Button>Split Bill</Button>
    </div>
  );
}

function App() {
  return (
    <div className="container flex gap-6">
      <div className="w-[450px]">
        <div className="box-people w-full flex flex-col gap-6 my-8">
          {arrPeople.map((person, i) => (
            <Person name={person.name} balance={person.balance} key={i + 1} />
          ))}
        </div>
        <AddPerson />
      </div>
      <BillSplit name="Sarah" />
    </div>
  );
}

export default App;
