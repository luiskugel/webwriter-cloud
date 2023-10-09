import { ResultType, Result, intoResult } from "./Result";
import {
  WWStorage,
  WWStorageHash,
  WWStorageList,
  WWStorageQueue,
  WWStorageSet,
} from "./Storage";
import Dexie from "dexie";

export class WWLocalStorage extends WWStorage {
  private db: Dexie;
  private keyValue: Dexie.Table<{ key: string; value: string }, string>;
  constructor(namespace_identifiers: string[]) {
    super(namespace_identifiers);
    this.db = new Dexie(namespace_identifiers.join(":"));

    this.db.version(1).stores({
      keyValue: `key`,
      lists: `key`,
      sets: `key, entry`,
      queues: `key, entry`,
    });

    this.keyValue = this.db.table("keyValue");
  }
  namespace(key: string): WWStorage {
    return new WWLocalStorage([...this.namespace_identifiers, key]);
  }
  async get(key: string): Promise<ResultType<string>> {
    return intoResult(
      async () => (await this.keyValue.get(key))?.value,
      new Error("Key not found")
    );
  }
  async set(key: string, value: string): Promise<ResultType<void>> {
    return intoResult(async () => {
      await this.keyValue.put({ key, value });
    });
  }
  async remove(key: string): Promise<ResultType<void>> {
    return intoResult(async () => {
      await this.keyValue.delete(key);
    });
  }
  async clear(): Promise<ResultType<void>> {
    return intoResult(async () => {
      await this.keyValue.clear();
    });
  }
  async length(key: string): Promise<ResultType<number>> {
    return intoResult(async () => {
      return (await this.keyValue.get(key))?.value.length;
    }, new Error("Key not found"));
  }
  async keys(): Promise<ResultType<string[]>> {
    return intoResult(async () => {
      return (await this.keyValue.toArray()).map((kv) => kv.key);
    });
  }
  async values(): Promise<ResultType<string[]>> {
    return intoResult(async () => {
      return (await this.keyValue.toArray()).map((kv) => kv.value);
    });
  }
  async entries(): Promise<ResultType<[string, string][]>> {
    return intoResult(async () => {
      return (await this.keyValue.toArray()).map((kv) => [kv.key, kv.value]);
    });
  }
  async has(key: string): Promise<ResultType<boolean>> {
    return intoResult(async () => {
      return (await this.keyValue.get(key)) !== undefined;
    });
  }
  async increase(key: string, value: number): Promise<ResultType<number>> {
    try {
      //TODO: make this atomic -> transaction
      const res = await this.keyValue.get(key);
      if (res === undefined) return new Result.Err(new Error("Key not found"));
      const current = Number(res.value);
      if (isNaN(current))
        return new Result.Err(new Error("Value is not a number"));

      const newValue = current + value;

      await this.keyValue.put({
        key,
        value: newValue.toString(),
      });

      return new Result.Ok(newValue);
    } catch (error) {
      return new Result.Err(error);
    }
  }
  List(): WWStorageList {
    throw new Error("Method not implemented.");
  }
  Queue(): WWStorageQueue {
    throw new Error("Method not implemented.");
  }
  Set(): WWStorageSet {
    throw new Error("Method not implemented.");
  }
  Hash(): WWStorageHash {
    throw new Error("Method not implemented.");
  }
}

class WWLocalSet extends WWStorageSet {
  private table: Dexie.Table<{ key: string; value: string }, string>;
  constructor(
    namespace_identifiers: string[],
    key: string,
    table: Dexie.Table<{ key: string; value: string }, string>
  ) {
    super(namespace_identifiers, key);
    this.table = table;
  }

  add(value: string): Promise<ResultType<void>> {
    throw new Error("Method not implemented.");
  }
  remove(value: string): Promise<ResultType<void>> {
    throw new Error("Method not implemented.");
  }
  has(value: string): Promise<ResultType<boolean>> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<ResultType<string[]>> {
    throw new Error("Method not implemented.");
  }
  length(): Promise<ResultType<number>> {
    throw new Error("Method not implemented.");
  }
}
