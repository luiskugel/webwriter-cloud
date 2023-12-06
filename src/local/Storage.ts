import { ResultType, Result, intoResult } from "../Result";
import { AbstractStorage, Visibility } from "../Storage";
import Dexie from "dexie";
import { LocalQueue } from "./Queue";
import { LocalSet } from "./Set";
import { LocalList } from "./List";
import { LocalHash } from "./Hash";

export class LocalStorage extends AbstractStorage {
  private db: Dexie;
  private keyValue: Dexie.Table<{ key: string; value: string }, string>;
  constructor(visibility: Visibility, ...namespace_identifiers: string[]) {
    super(visibility, ...namespace_identifiers);
    this.db = new Dexie(namespace_identifiers.join(":"));

    this.db.version(1).stores({
      keyValue: `key`,
      sets: "[setID+value]",
      queues: "[queueID+id]",
      lists: "[listID+id]",
      hashes: "[hashID+field]",
    });

    this.keyValue = this.db.table("keyValue");
  }
  namespace(key: string): AbstractStorage {
    return new LocalStorage(
      this.visibility,
      ...this.namespace_identifiers,
      key
    );
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
      const val = (await this.keyValue.get(key))?.value ?? "0";
      const current = Number(val);
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
  List(key: string): LocalList {
    return new LocalList(
      this.namespace_identifiers,
      key,
      this.db.table("lists")
    );
  }
  Queue(key: string): LocalQueue {
    return new LocalQueue(
      this.namespace_identifiers,
      key,
      this.db.table("queues")
    );
  }
  Set(key: string): LocalSet {
    return new LocalSet(this.namespace_identifiers, key, this.db.table("sets"));
  }
  Hash(key: string): LocalHash {
    return new LocalHash(
      this.namespace_identifiers,
      key,
      this.db.table("hashes")
    );
  }
  subscribe(
    key: string,
    callback: (value: ResultType<string | null>) => any
  ): void {
    throw new Error("Method not implemented."); //TODO: Implement
  }
  notify(key: string, callback: () => any): void {
    throw new Error("Method not implemented."); //TODO: Implement
  }
}

//TODO: make this atomic -> transaction
//TODO: check all methods for errors
