import Dexie from "dexie";
import { AbstractList } from "../Storage";
import { ResultType, intoResult } from "../Result";

interface IListItem {
  id?: number;
  listID: string;
  value: string;
}
export class LocalList extends AbstractList {
  private table: Dexie.Table<IListItem, [string, number]>;
  constructor(
    namespace_identifiers: string[],
    key: string,
    table: Dexie.Table<IListItem, [string, number]>
  ) {
    super(namespace_identifiers, key);
    this.table = table;
  }

  async push(value: string): Promise<ResultType<void>> {
    return intoResult(async () => {
      await this.table.add({ listID: this.key, value });
    });
  }
  async pop(): Promise<ResultType<string | null>> {
    return intoResult(async () => {
      const lastItem = await this.table
        .where("[listID+id]")
        .between([this.key, Dexie.minKey], [this.key, Dexie.maxKey])
        .last();
      if (lastItem) {
        await this.table.delete([this.key, lastItem.id!]);
        return lastItem.value;
      }
      return null;
    });
  }
  async shift(): Promise<ResultType<string | null>> {
    return intoResult(async () => {
      const firstItem = await this.table
        .where("[listID+id]")
        .between([this.key, Dexie.minKey], [this.key, Dexie.maxKey])
        .first();
      if (firstItem) {
        await this.table.delete([this.key, firstItem.id!]);
        return firstItem.value;
      }
      return null;
    });
  }
  async unshift(value: string): Promise<ResultType<void>> {
    return intoResult(async () => {
      // This is more complex due to the need to reindex existing items.
      const allItems = await this.getAllItems();
      await this.clear();
      await this.table.add({ listID: this.key, value });
      for (const item of allItems) {
        await this.push(item.value);
      }
    });
  }
  async get(index: number): Promise<ResultType<string>> {
    return intoResult(async () => {
      const item = await this.table.get([this.key, index + 1]); // +1 because our auto-increment starts from 1
      return item?.value;
    }, new Error("Index out of bounds"));
  }
  async set(index: number, value: string): Promise<ResultType<void>> {
    return intoResult(async () => {
      await this.table.update([this.key, index + 1], { value });
    });
  }
  async length(): Promise<ResultType<number>> {
    return intoResult(async () => {
      return await this.table.where("listID").equals(this.key).count();
    });
  }
  async getAll(): Promise<ResultType<string[]>> {
    return intoResult(async () => {
      const items = await this.getAllItems();
      return items.map((item) => item.value);
    });
  }
  async pushMany(values: string[]): Promise<ResultType<void>> {
    return intoResult(async () => {
      const items = values.map((value) => ({ listID: this.key, value }));
      await this.table.bulkAdd(items);
    });
  }
  async clear(): Promise<ResultType<void>> {
    return intoResult(async () => {
      await this.table.where("listID").equals(this.key).delete();
    });
  }
  private async getAllItems(): Promise<IListItem[]> {
    return await this.table.where("listID").equals(this.key).toArray();
  }
  subscribe(callback: (value: ResultType<string[]>) => any): void {
    throw new Error("Method not implemented."); //TODO: Implement
  }
  notify(callback: () => any): void {
    throw new Error("Method not implemented."); //TODO: Implement
  }
  max(): Promise<ResultType<string>> {
    throw new Error("Method not implemented."); //TODO: Implement
  }
  min(): Promise<ResultType<string>> {
    throw new Error("Method not implemented."); //TODO: Implement
  }
  sum(): Promise<ResultType<number>> {
    throw new Error("Method not implemented."); //TODO: Implement
  }
  avg(): Promise<ResultType<number>> {
    throw new Error("Method not implemented."); //TODO: Implement
  }
}
interface ISetItem {
  setID: string;
  value: string;
}
