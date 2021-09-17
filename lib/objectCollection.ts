import {CollectionError} from "lib/baseCollection";

type TSourceCollection<T> = ObjectCollection<T> | T[];

export class ObjectCollection<TItem> {
  private readonly _items: Record<string, TItem>;
  private readonly _sourceItems: TItem[];

  constructor(items: TSourceCollection<TItem>, objectKey: keyof TItem) {
    this._sourceItems = Array.isArray(items) ? items : items._sourceItems;
    this._items = this._sourceItems.reduce<Record<string | number, TItem>>((memo, item) => {
      let index = item[objectKey] as any;
      memo[index] = item;

      return memo;
    }, {});
  }

  public get(key: string): Maybe<TItem> {
    return this._items[key];
  }

  public getOrThrow(key: string): TItem {
    return this.get(key) || this.throw(`Unable to get item by key "${key}"`);
  }

  private throw(message: string): never {
    throw new CollectionError(message);
  }
}
