import Dexie from "dexie";
import { AbstractSet } from "../Storage";
import { Result, ResultType, intoResult } from "../Result";

interface ISetItem {
  setID: string;
  value: string;
}

export class LocalSet extends AbstractSet {
  private table: Dexie.Table<ISetItem, [string, string]>;
  constructor(
    namespace_identifiers: string[],
    key: string,
    table: Dexie.Table<ISetItem, [string, string]>
  ) {
    super(namespace_identifiers, key);
    this.table = table;
  }

  async add(value: string): Promise<ResultType<void>> {
    const has = await this.has(value);
    if (!has.isOk()) return new Result.Err(has.unwrapErr());
    if (has.unwrap()) return new Result.Ok(undefined);
    return intoResult(async () => {
      await this.table.add({ setID: this.key, value });
    });
  }
  async has(value: string): Promise<ResultType<boolean>> {
    try {
      const item = await this.table.get([this.key, value]);
      return new Result.Ok(item !== undefined);
    } catch (error) {
      return new Result.Err(error);
    }
  }
  async remove(value: string): Promise<ResultType<void>> {
    return intoResult(async () => {
      await this.table.delete([this.key, value]);
    });
  }
  async getAll(): Promise<ResultType<Set<string>>> {
    return intoResult(async () => {
      const items = await this.table.where("setID").equals(this.key).toArray();
      const result = new Set<string>();
      for (const item of items) {
        result.add(item.value);
      }
      return result;
    });
  }
  async length(): Promise<ResultType<number>> {
    return intoResult(async () => {
      return await this.table.where("setID").equals(this.key).count();
    });
  }
  async clear(): Promise<ResultType<void>> {
    return intoResult(async () => {
      await this.table.where("setID").equals(this.key).delete();
    });
  }
  subscribe(callback: (value: ResultType<Set<string>>) => any): void {
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
