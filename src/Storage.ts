import { ResultType } from "./Result";

export abstract class AbstractStorage {
  protected namespace_identifiers: string[];
  protected visibility: Visibility;
  constructor(visibility: Visibility, ...namespace_identifiers: string[]) {
    this.visibility = visibility;
    if (namespace_identifiers.length === 0) namespace_identifiers = ["default"];
    this.namespace_identifiers = namespace_identifiers;
  }
  /**
   * Returns a new storage object with the given key as namespace.
   * Namespaces are separated by each other and can not access each other.
   */
  abstract namespace(key: string): AbstractStorage;

  /**
   * Returns the value associated with the given key.
   */
  abstract get(key: string): Promise<ResultType<string>>;
  /**
   * Sets the value associated with the given key.
   */
  abstract set(key: string, value: string): Promise<ResultType<void>>;
  /**
   * Removes the value associated with the given key.
   */
  abstract remove(key: string): Promise<ResultType<void>>;
  /**
   * Removes all values in this namespace.
   */
  abstract clear(): Promise<ResultType<void>>;
  /**
   * Returns the length of the value associated with the given key.
   */
  abstract length(key: string): Promise<ResultType<number>>;
  /**
   * Returns all keys in this namespace.
   */
  abstract keys(): Promise<ResultType<string[]>>; //TODO: iterator? 1
  /**
   * Returns all values in this namespace.
   */
  abstract values(): Promise<ResultType<string[]>>; //TODO: iterator? 1
  /**
   * Returns all entries in this namespace.
   */
  abstract entries(): Promise<ResultType<[string, string][]>>; //TODO: iterator? 1
  /**
   * Returns true if the given key exists in this namespace.
   */
  abstract has(key: string): Promise<ResultType<boolean>>;
  /**
   * Increases the value associated with the given key by the given value.
   * If the key does not exist, it will be set to value.
   * Fails if the value associated with the given key is not a number.
   */
  abstract increase(key: string, value: number): Promise<ResultType<number>>;

  /**
   * Subscribes to changes of the value associated with the given key.
   * @param callback Will be called when the value changes. Returns the new value.
   */
  abstract subscribe(
    key: string,
    callback: (value: ResultType<string | null>) => any
  ): void;

  /**
   * Get notified when the value associated with the given key changes.
   * Does not return the new value. If you need the new value, use subscribe instead.
   * @param callback Will be called when the value changes.
   */
  abstract notify(key: string, callback: () => any): void;

  //TODO: create jsdocs
  abstract List(key: string): AbstractList;
  abstract Queue(key: string): AbstractQueue;
  abstract Set(key: string): AbstractSet;
  abstract Hash(key: string): AbstractHash;
}

export abstract class AbstractList {
  constructor(
    protected namespace_identifiers: string[],
    protected key: string
  ) {}
  /**
   * Adds the given value to the end of the list.
   */
  abstract push(value: string): Promise<ResultType<void>>;
  /**
   * Removes the last value of the list and returns it.
   */
  abstract pop(): Promise<ResultType<string | null>>;
  /**
   * Removes the first value of the list and returns it.
   */
  abstract shift(): Promise<ResultType<string | null>>;
  /**
   * Adds the given value to the beginning of the list.
   */
  abstract unshift(value: string): Promise<ResultType<void>>;
  /**
   * Returns the value at the given index.
   */
  abstract get(index: number): Promise<ResultType<string>>;
  /**
   * Sets the value at the given index.
   */
  abstract set(index: number, value: string): Promise<ResultType<void>>;
  /**
   * Removes the length of the list.
   */
  abstract length(): Promise<ResultType<number>>;
  /**
   * Returns all values of the list as an array. //TODO: change to iterator?
   */
  abstract getAll(): Promise<ResultType<string[]>>; //TODO: iterator? 1
  /**
   * Push multiple values to the end of the list.
   */
  abstract pushMany(values: string[]): Promise<ResultType<void>>;
  /**
   * Clears the list. THIS REMOVES ALL VALUES! USE WITH CAUTION!
   */
  abstract clear(): Promise<ResultType<void>>;
  /**
   * Subscribes to changes of the list.
   * @param callback Will be called when the list changes. Returns the complete list. //TODO: should we do this? -> Server Fehler
   */
  abstract subscribe(callback: (value: ResultType<string[]>) => any): void;
  /**
   * Get notified when the list changes. Does not return the new list.
   * If you need the new list, use subscribe instead.
   * @param callback Will be called when the list changes.
   */
  abstract notify(callback: () => any): void;

  /**
   * Returns the maximum value of the list. Fails if the list is not a list of numbers.
   */
  abstract max(): Promise<ResultType<string>>;
  /**
   * Returns the minimum value of the list. Fails if the list is not a list of numbers.
   */
  abstract min(): Promise<ResultType<string>>;
  /**
   * Returns the sum of all values of the list. Fails if the list is not a list of numbers.
   */
  abstract sum(): Promise<ResultType<number>>;
  /**
   * Returns the average of all values of the list. Fails if the list is not a list of numbers.
   */
  abstract avg(): Promise<ResultType<number>>;
}

export abstract class AbstractQueue {
  constructor(
    protected namespace_identifiers: string[],
    protected key: string
  ) {}
  /**
   * Adds a given value to the queue.
   */
  abstract enqueue(value: string): Promise<ResultType<void>>;
  /**
   * Dequeues a value from the queue.
   * @param type First-In-First-Out or Last-In-First-Out
   */
  abstract dequeue(type: "FIFO" | "LIFO"): Promise<ResultType<string | null>>;
  /**
   * Returns how many values are queued.
   */
  abstract length(): Promise<ResultType<number>>;
  /**
   * Clears the queue. THIS REMOVES ALL VALUES! USE WITH CAUTION!
   */
  abstract clear(): Promise<ResultType<void>>;
}

export abstract class AbstractSet {
  constructor(
    protected namespace_identifiers: string[],
    protected key: string
  ) {}
  /**
   * Adds the given value to the set. Does nothing if the value is already in the set.
   */
  abstract add(value: string): Promise<ResultType<void>>;
  /**
   * Removes the given value from the set. Does nothing if the value is not in the set.
   */
  abstract remove(value: string): Promise<ResultType<void>>;
  /**
   * Checks if the given value is in the set.
   */
  abstract has(value: string): Promise<ResultType<boolean>>;
  /**
   * Returns all values of the set as an js set. //TODO: change to iterator?
   */
  abstract getAll(): Promise<ResultType<Set<string>>>; //TODO: iterator? 1
  /**
   * Returns the length of the set.
   */
  abstract length(): Promise<ResultType<number>>;
  /**
   * Clears the set. THIS REMOVES ALL VALUES! USE WITH CAUTION!
   */
  abstract clear(): Promise<ResultType<void>>;

  /**
   * Returns the maximum value of the set. Fails if the set is not a set of numbers.
   */
  abstract max(): Promise<ResultType<string>>;
  /**
   * Returns the minimum value of the set. Fails if the set is not a set of numbers.
   */
  abstract min(): Promise<ResultType<string>>;
  /**
   * Returns the sum of all values of the set. Fails if the set is not a set of numbers.
   */
  abstract sum(): Promise<ResultType<number>>;
  /**
   * Returns the average of all values of the set. Fails if the set is not a set of numbers.
   */
  abstract avg(): Promise<ResultType<number>>;

  /**
   * Subscribes to changes of the set.
   * @param callback Is called when the set changes. Returns the complete set. //TODO: should we do this?
   */
  abstract subscribe(callback: (value: ResultType<Set<string>>) => any): void;
  /**
   * Get notified when the set changes. Does not return the new set.
   * If you need the new set, use subscribe instead.
   * @param callback Is called when the set changes.
   */
  abstract notify(callback: () => any): void;
}

export abstract class AbstractHash {
  constructor(
    protected namespace_identifiers: string[],
    protected key: string
  ) {}
  /**
   * Sets the given field to the given value.
   * If the field already exists, it will be overwritten.
   */
  abstract set(field: string, value: string): Promise<ResultType<void>>;
  /**
   * Returns the value of the given field.
   */
  abstract get(field: string): Promise<ResultType<string>>;
  /**
   * Returns the hash as js object.
   */
  abstract getAll(): Promise<ResultType<Record<string, string>>>;
  /**
   * Removes the given field from the hash.
   */
  abstract remove(field: string): Promise<ResultType<void>>;
  /**
   * Checks if the given field exists in the hash.
   */
  abstract has(field: string): Promise<ResultType<boolean>>;
  /**
   * Creates a new hash from the given object. Already existing fields will be overwritten but not deleted.
   * If you want to delete fields, use clear() first.
   */
  abstract fromObject(
    object: Record<string, string>
  ): Promise<ResultType<void>>;
  /**
   * Increases the value of the given field by the given value.
   * If the field does not exist, it will be set to value.
   * Fails if the value associated with the given field is not a number.
   */
  abstract increment(field: string, value: number): Promise<ResultType<number>>;
  /**
   * Clears the hash. THIS REMOVES ALL FIELDS! USE WITH CAUTION!
   */
  abstract clear(): Promise<ResultType<void>>;

  abstract keys(): Promise<ResultType<string[]>>; //TODO: iterator?
  abstract values(): Promise<ResultType<string[]>>; //TODO: iterator? 1
  abstract entries(): Promise<ResultType<[string, string][]>>; //TODO: iterator? 1

  /**
   * Subscribes to changes of the hash.
   * @param callback Is called when the hash changes. Returns the complete hash. //TODO: should we do this?
   */
  abstract subscribe(
    callback: (value: ResultType<Record<string, string>>) => any
  ): void;

  /**
   * Get notified when the hash changes. Does not return the new hash.
   * If you need the new hash, use subscribe instead.
   * @param callback Is called when the hash changes.
   */
  abstract notify(callback: () => any): void;
}

export enum Visibility {
  /**
   * Data is shared between all components but separated by user.
   * e.g. Language setting or theme.
   */
  USER = "USER",
  /**
   * Data is shared between all components of a worksheet but separated by users and different worksheets.
   * e.g. Points the user scored in every component of the worksheet -> could be summed up at the end.
   */
  WORKSHEET = "WORKSHEET",
  /**
   * Data is not shared at all. Only the component that created the data can access it.
   * This is the default visibility type.
   */
  PRIVATE = "PRIVATE",
  /**
   * Data is shared between all instances of the same component independent of the user or worksheet.
   * e.g. A counter that counts how often a component was used or a global leaderboard
   * DO NOT STORE ANY SENSITIVE DATA IN THIS VISIBILITY TYPE!
   */
  COMPONENT = "COMPONENT",
}
