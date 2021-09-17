import {BaseCollection} from "lib/baseCollection";
import {Collection} from "lib/collection";
import {ObjectCollection} from "lib/objectCollection";

interface IProduct {
  averageRating: number,
  baseOptions?: IOptions[]
}

interface IOptions {
  options?: [];
  selected?: ISelectedOption;
}

interface ISelectedOption {
  code?: string;
  priceData?: {},
  stock?: {},
  url?: string;
  variantOptionQualifiers?: IQualifiers[]
}

interface IQualifiers {
  image: {},
  imageFull: {},
  name: string;
  qualifier: string;
  value: string;
}

class Product {
  private readonly _product: IProduct;

  constructor(product: IProduct) {
    this._product = product;
  }

  private _baseOptions: Maybe<OptionsCollection>;

  get baseOptions(): OptionsCollection {
    return this._baseOptions ||= new OptionsCollection(this._product.baseOptions);
  }
}

class OptionsCollection extends BaseCollection<IOptions, Options> {
  protected subset(items: IOptions[]): this {
    return new OptionsCollection(items) as this;
  }

  protected toCollection(): BaseCollection<Options> {
    return new Collection(this.toArray());
  }

  protected resolve(item: IOptions): Options {
    return new Options(item);
  }
}

class Options {
  private _selectedOption: Maybe<SelectedOption>;

  constructor(options: IOptions) {
    this._options = options;
  }

  private _options: IOptions;

  get options(): [] {
    return this._options.options || [];
  }

  get selected(): SelectedOption {
    return this._selectedOption ||= new SelectedOption(this._options.selected || {});
  }
}

class SelectedOption implements ISelectedOption {
  code?: string;
  priceData?: {};
  stock?: {};
  url?: string;
  variantOptionQualifiers: IQualifiers[];
  qualifiers: ObjectCollection<IQualifiers>;

  constructor(selected: ISelectedOption) {
    this.code = selected.code;
    this.priceData = selected.priceData;
    this.stock = selected.stock;
    this.url = selected.url;
    this.variantOptionQualifiers = selected.variantOptionQualifiers || [];
    this.qualifiers = new ObjectCollection(this.variantOptionQualifiers, "qualifier");
  }
}

const product = new Product({
  averageRating: 5.0,
  baseOptions: [
    {
      options: [],
      selected: {
        code: "GSR...",
        priceData: {},
        stock: {},
        url: "http://google.com",
        variantOptionQualifiers: [
          {
            image: {},
            imageFull: {},
            name: "Цвет",
            qualifier: "color",
            value: "белый"
          }
        ]
      }
    }
  ]
});

const maybeName: Maybe<string> = product.baseOptions.first?.selected.qualifiers.get("color")?.name;
const name: string = product.baseOptions.firstOrThrow.selected.qualifiers.getOrThrow("color").name;
