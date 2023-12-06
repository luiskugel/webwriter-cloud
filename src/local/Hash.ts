import Dexie from "dexie";
import { ResultType, intoResult } from "../Result";
import { AbstractHash } from "../Storage";

interface IHashItem {
  hashID: string;
  field: string;
  value: string;
}

export class LocalHash extends AbstractHash {
  private table: Dexie.Table<IHashItem, [string, string]>;
  constructor(
    namespace_identifiers: string[],
    key: string,
    table: Dexie.Table<IHashItem, [string, string]>
  ) {
    super(namespace_identifiers, key);
    this.table = table;
  }

  set(field: string, value: string): Promise<ResultType<void>> {
    return intoResult(async () => {
      await this.table.put({ hashID: this.key, field, value });
    });
  }
  get(field: string): Promise<ResultType<string>> {
    return intoResult(async () => {
      const item = await this.table.get([this.key, field]);
      return item?.value;
    }, new Error("Field not found"));
  }
  getAll(): Promise<ResultType<Record<string, string>>> {
    return intoResult(async () => {
      const items = await this.table.where("hashID").equals(this.key).toArray();
      return items.reduce((acc, item) => {
        acc[item.field] = item.value;
        return acc;
      }, {} as Record<string, string>);
    });
  }
  remove(field: string): Promise<ResultType<void>> {
    return intoResult(async () => {
      await this.table.delete([this.key, field]);
    });
  }
  has(field: string): Promise<ResultType<boolean>> {
    return intoResult(async () => {
      const item = await this.table.get([this.key, field]);
      return !!item;
    });
  }
  fromObject(object: Record<string, string>): Promise<ResultType<void>> {
    return intoResult(async () => {
      const items: IHashItem[] = [];
      for (const [field, value] of Object.entries(object)) {
        items.push({ hashID: this.key, field, value });
      }
      await this.table.bulkPut(items);
    });
  }
  increment(field: string, value: number): Promise<ResultType<number>> {
    return intoResult(async () => {
      const current = Number((await this.get(field)) || "0");
      if (isNaN(current)) throw new Error("Field is not a number");
      const newValue = current + value;
      await this.set(field, String(newValue));
      return newValue;
    });
  }
  clear(): Promise<ResultType<void>> {
    return intoResult(async () => {
      await this.table.where("hashID").equals(this.key).delete();
    });
  }
  keys(): Promise<ResultType<string[]>> {
    throw new Error("Method not implemented."); //TODO: Implement
  }
  values(): Promise<ResultType<string[]>> {
    throw new Error("Method not implemented."); //TODO: Implement
  }
  entries(): Promise<ResultType<[string, string][]>> {
    throw new Error("Method not implemented."); //TODO: Implement
  }
  subscribe(
    callback: (value: ResultType<Record<string, string>>) => any
  ): void {
    throw new Error("Method not implemented."); //TODO: Implement
  }
  notify(callback: () => any): void {
    throw new Error("Method not implemented."); //TODO: Implement
  }
}
