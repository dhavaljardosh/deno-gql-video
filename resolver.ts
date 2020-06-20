import { addEntry, getTotal, deleteEntry, getEntries } from "./database.ts";

export default class Resolvers {
  //Add Entry
  async addEntry({ input }: any) {
    return await addEntry({ input });
  }

  // Delete Entry

  async deleteEntry({ id }: any) {
    return await deleteEntry(id);
  }

  // Get Total

  async getTotal() {
    return getTotal();
  }

  //Get Entries
  async getEntries() {
    return await getEntries();
  }
}
