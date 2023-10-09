import { ResultType } from "./Result";

export abstract class WWStorage {
  protected namespace_identifiers: string[];
  constructor(namespace_identifiers: string[]) {
    this.namespace_identifiers = namespace_identifiers ?? ["default"];
  }
  abstract namespace(key: string): WWStorage;
  abstract get(key: string): Promise<ResultType<string>>;
  abstract set(key: string, value: string): Promise<ResultType<void>>;
  abstract remove(key: string): Promise<ResultType<void>>;
  abstract clear(): Promise<ResultType<void>>;
  abstract length(key: string): Promise<ResultType<number>>;
  abstract keys(): Promise<ResultType<string[]>>;
  abstract values(): Promise<ResultType<string[]>>;
  abstract entries(): Promise<ResultType<[string, string][]>>;
  abstract has(key: string): Promise<ResultType<boolean>>;
  abstract increase(key: string, value: number): Promise<ResultType<number>>;

  //TODO: subscribe

  abstract List(): WWStorageList;
  abstract Queue(): WWStorageQueue;
  abstract Set(): WWStorageSet;
  abstract Hash(): WWStorageHash;
}

export abstract class WWStorageList {
  constructor(
    protected namespace_identifiers: string[],
    protected key: string
  ) {}
  abstract push(value: string): Promise<ResultType<void>>;
  abstract pop(): Promise<ResultType<string>>;
  abstract shift(): Promise<ResultType<string>>;
  abstract unshift(value: string): Promise<ResultType<void>>;
  abstract get(index: number): Promise<ResultType<string>>;
  abstract set(index: number, value: string): Promise<ResultType<void>>;
  abstract length(): Promise<ResultType<number>>;
  abstract getAll(): Promise<ResultType<string[]>>;
  abstract pushMany(values: string[]): Promise<ResultType<void>>;
  //TODO: subscribe
}

export abstract class WWStorageQueue {
  constructor(
    protected namespace_identifiers: string[],
    protected key: string
  ) {}
  abstract enqueue(value: string): Promise<ResultType<void>>;
  abstract dequeue(type: "FIFO" | "LIFO"): Promise<ResultType<string>>;
  abstract length(): Promise<ResultType<number>>;
}

export abstract class WWStorageSet {
  constructor(
    protected namespace_identifiers: string[],
    protected key: string
  ) {}
  abstract add(value: string): Promise<ResultType<void>>;
  abstract remove(value: string): Promise<ResultType<void>>;
  abstract has(value: string): Promise<ResultType<boolean>>;
  abstract getAll(): Promise<ResultType<string[]>>;
  abstract length(): Promise<ResultType<number>>;
  //TODO: subscribe
}

export abstract class WWStorageHash {
  constructor(
    protected namespace_identifiers: string[],
    protected key: string
  ) {}
  abstract set(field: string, value: string): Promise<ResultType<void>>;
  abstract get(field: string): Promise<ResultType<string>>;
  abstract getAll(): Promise<ResultType<[string, string][]>>;
  abstract remove(field: string): Promise<ResultType<void>>;
  abstract has(field: string): Promise<ResultType<boolean>>;
  abstract fromObject(
    object: Record<string, string>
  ): Promise<ResultType<void>>;
  abstract increment(field: string, value: number): Promise<ResultType<number>>;
  //TODO: subscribe
}
