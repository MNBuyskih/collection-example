import {BaseCollection} from "lib/baseCollection";

export class Collection<TItem> extends BaseCollection<TItem> {
  protected subset(items: TItem[]): this {
    return new Collection(items) as this;
  }

  protected resolve(item: TItem): TItem {
    return item;
  }

  protected toCollection(): Collection<TItem> {
    return new Collection<TItem>(this.toArray());
  }
}
