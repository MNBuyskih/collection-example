type TSourceCollection<T> = BaseCollection<T, any> | T[];

export abstract class BaseCollection<TItem, TResolved = TItem> {
  private readonly _items: TItem[];

  constructor(source: TSourceCollection<TItem> = []) {
    this._items = Array.isArray(source) ? source : source._items;
  }

  // Single item

  public get first(): Maybe<TResolved> {
    if (this.areAny) {
      return this.resolve(this._items[0]);
    }
  }

  public get firstOrThrow(): TResolved {
    return this.first ?? this.throw("Unable to get first item from empty source");
  }

  public get last(): Maybe<TResolved> {
    if (this.areAny) {
      return this.resolve(this._items[this._items.length - 1]);
    }
  }

  public get lastOrThrow(): TResolved {
    return this.last ?? this.throw("Unable to get last item from empty source");
  }

  public find(predicate: (item: TItem) => boolean): Maybe<TResolved> {
    let item = this._items.find(predicate);
    if (item) {
      return this.resolve(item);
    }
  }

  public findOrThrow(predicate: (item: TItem) => boolean): TResolved {
    return this.find(predicate) ?? this.throw("Unable to find item");
  }

  public get(index: number): Maybe<TResolved> {
    const item = this._items[index];

    return item && this.resolve(item);
  }

  public getOrThrow(index: number): TResolved {
    return this.get(index) ?? this.throw("Unable to get item by index");
  }

  // Many items

  public skip(count: number): this {
    return this.slice(count);
  }

  public take(count: number): this {
    return this.slice(0, count);
  }

  public slice(startIndex: number, endIndex?: number): this {
    return this.subset(this._items.slice(startIndex, endIndex));
  }

  public select(predicate: (item: TItem) => boolean): this {
    return this.subset(this._items.filter(predicate));
  }

  public sort(comparator: (a: TItem, b: TItem) => number): this {
    return this.subset([...this._items].sort(comparator));
  }

  public reverse(): this {
    return this.subset([...this._items].reverse());
  }

  public concat(array: BaseCollection<TItem, any>): this {
    return this.subset([...this._items, ...array._items]);
  }

  public update(index: number, value: TItem): this {
    const nextItems = [...this._items];

    nextItems[index] = value;

    return this.subset(nextItems);
  }

  public prepend(item: TItem): this {
    return this.subset([item, ...this._items]);
  }

  public append(item: TItem): this {
    return this.subset([...this._items, item]);
  }

  public remove(index: number): this {
    const nextItems = [...this._items];
    nextItems.splice(index, 1);

    return this.subset(nextItems);
  }

  public map<TResult>(mapFn: (item: TResolved, index: number) => TResult): TResult[] {
    return this.toArray().map(mapFn);
  }

  public reduce<TResult>(initial: TResult, reduceFn: (memo: TResult, item: TItem) => TResult): TResult {
    return this._items.reduce(reduceFn, initial);
  }

  // Helpers

  public get length(): number {
    return this._items.length;
  }

  public get areMissing(): boolean {
    return this.length === 0;
  }

  public get areAny(): boolean {
    return this.length > 0;
  }

  public get areMany(): boolean {
    return this.length > 1;
  }

  public findIndex(predicate: (item: TItem) => boolean): number {
    return this._items.findIndex(predicate);
  }

  public isSome(predicate: (item: TItem) => boolean): boolean {
    return this._items.some(predicate);
  }

  public isEvery(predicate: (item: TItem) => boolean): boolean {
    return this._items.every(predicate);
  }

  public toArray(): TResolved[] {
    return this._items.map((item) => this.resolve(item)!);
  }

  protected abstract subset(items: TItem[]): this;

  protected abstract resolve(item: TItem): TResolved;

  protected abstract toCollection(): BaseCollection<TResolved>;

  private throw(message: string): never {
    throw new CollectionError(message);
  }
}

export class CollectionError extends Error {
  constructor(message: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CollectionError.prototype);
  }
}
