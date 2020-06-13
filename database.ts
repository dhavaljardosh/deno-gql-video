import Dex from "https://deno.land/x/dex/mod.ts";
import Dexecutor from "https://deno.land/x/dexecutor/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

const client = "sqlite3";

let dex = new Dex({
  client: client,
});

// Creating the query executor
let dexecutor = new Dexecutor({
  client: client,
  connection: {
    filename: "database.db",
  },
});

export const addEntry = async ({ input }: any) => {
  // Opening the connection
  await dexecutor.connect();

  let sqlQuery;

  //We have the uuid here
  const uuid = UUID();

  // Check if table exists
  let check_if_exists = dex
    .select("name")
    .from("sqlite_master")
    .where({ type: "table", name: "budget" })
    .toString();

  let entryTableExist = await dexecutor.execute(check_if_exists);

  if (entryTableExist.length) {
    //Insert new here
    // INSERT Query
    sqlQuery = dex
      .queryBuilder()
      .insert([{ id: uuid, amount: input.amount, type: input.type }])
      .into("budget")
      .toString();

    await dexecutor.execute(sqlQuery);
  } else {
    // Create DB
    // CREATE TABLE Query
    sqlQuery = dex.schema
      .createTable("budget", (table: any) => {
        table.string("id");
        table.string("amount");
        table.string("type");
      })
      .toString();

    await dexecutor.execute(sqlQuery);
    // INSERT Query
    sqlQuery = dex
      .queryBuilder()
      .insert([{ id: uuid, amount: input.amount, type: input.type }])
      .into("budget")
      .toString();

    await dexecutor.execute(sqlQuery);
  }

  // SELECT Query
  let result = await dexecutor.execute(
    dex.queryBuilder().select("*").from("budget").toString()
  );

  // Closing the connection
  await dexecutor.close();

  let finalItem = readableJSON(result);

  return finalItem[finalItem.length - 1];
};

// Get Running Total
export const getTotal = async () => {
  // Opening the connection
  await dexecutor.connect();

  let sqlQuery;

  // Check if table exists
  let check_if_exists = dex
    .select("name")
    .from("sqlite_master")
    .where({ type: "table", name: "budget" })
    .toString();

  let entryTableExist = await dexecutor.execute(check_if_exists);

  if (entryTableExist.length === 0) {
    return;
  }

  // SELECT Query
  let result = await dexecutor.execute(
    dex.queryBuilder().select("*").from("budget").toString()
  );

  await dexecutor.close();
  const getAllEntries: any[] = readableJSON(result);

  return calculateTotal(getAllEntries);
};

// Delete Entry
export const deleteEntry = async (id: any) => {
  // Opening the connection
  await dexecutor.connect();

  let sqlQuery;

  // Check if the entry with id is in the DB
  let check_if_exists = dex.select("*").from("budget").where({ id }).toString();

  let entryTableExist = await dexecutor.execute(check_if_exists);

  if (entryTableExist.length) {
    try {
      // Delete Query
      sqlQuery = dex.delete("*").from("budget").where({ id }).toString();

      await dexecutor.execute(sqlQuery);
    } catch (error) {
      return new Error(error.message);
    }
  } else {
    return new Error("Record with given ID not present");
  }

  // SELECT Query
  let result = await dexecutor.execute(
    dex.queryBuilder().select("*").from("budget").toString()
  );

  await dexecutor.close();

  var jsonResult = readableJSON(entryTableExist);
  console.log(jsonResult);
  return jsonResult[0];
};

// Helper Function

const UUID = () => {
  return v4.generate();
};

const readableJSON = (rawData: any) => {
  let newArray = [];
  for (let i = 0; i < rawData.length; i++) {
    newArray.push({
      id: rawData[i][0],
      amount: rawData[i][1],
      type: rawData[i][2],
    });
  }
  return newArray;
};

const calculateTotal = (list: any) => {
  console.log(list);
  let total = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i].type === "expense") {
      total -= Number(list[i].amount);
      console.log(total);
    } else {
      total += Number(list[i].amount);
    }
  }
  console.log(total);
  return total.toFixed(2);
};
