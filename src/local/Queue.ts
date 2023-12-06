import Dexie from "dexie";
import { AbstractQueue } from "../Storage";
import { Result, ResultType, intoResult } from "../Result";

interface IQueueItem {
  id?: number;
  queueID: string;
  value: string;
}

export class LocalQueue extends AbstractQueue {
  private table: Dexie.Table<IQueueItem, [string, number]>;
  constructor(
    namespace_identifiers: string[],
    key: string,
    table: Dexie.Table<IQueueItem, [string, number]>
  ) {
    super(namespace_identifiers, key);
    this.table = table;
  }

  async enqueue(value: string): Promise<ResultType<void>> {
    return intoResult(async () => {
      await this.table.add({ queueID: this.key, value });
    });
  }
  async dequeue(type: "FIFO" | "LIFO"): Promise<ResultType<string | null>> {
    try {
      let item: IQueueItem | undefined;
      if (type === "FIFO") {
        item = await this.table
          .where("[queueID+id]")
          .between([this.key, Dexie.minKey], [this.key, Dexie.maxKey])
          .first();
      } else if (type === "LIFO") {
        item = await this.table
          .where("[queueID+id]")
          .between([this.key, Dexie.minKey], [this.key, Dexie.maxKey])
          .last();
      }

      if (!item) return new Result.Ok(null);

      await this.table.delete([this.key, item.id!]);
      return new Result.Ok(item.value);
    } catch (error) {
      return new Result.Err(error);
    }
  }
  async length(): Promise<ResultType<number>> {
    return intoResult(async () => {
      return await this.table.where("queueID").equals(this.key).count();
    });
  }
  async clear(): Promise<ResultType<void>> {
    return intoResult(async () => {
      await this.table.where("queueID").equals(this.key).delete();
    });
  }
}
