const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A product must have a name"],
      unique: true,
      trim: true,
      maxlength: [100, "Product name must not exceed 100 characters"],
    },

    productSlug: {
      type: String,
    },

    price: {
      type: Number,
      required: [true, "A product must have a price"],
      min: [0, "Price must be a positive number"],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message:
          "Discount price ({{VALUE}}) should be below the regular price",
      },
    },

    category: {
      type: String,
      required: [true, "A product must have a category"],
      trim: true,
      enum: {
        values: ["Electronics", "Books", "Clothes", "Sports", "Furniture", "Others"],
        message: "Category must be one of: Electronics, Books, Clothes, Sports, Furniture, Others",
      },
    },

    location: {
      type: String,
      required: [true, "A product must have a location"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "A product must have a description"],
      trim: true,
      maxLength: [
        50,
        "A product description must have less than or equal to 50 characters",
      ],
    },

    seller: {
      type: String,
      required: [true, "A product must have a seller"],
      trim: true,
    },

    ratingsAverage: {
      type: Number,
      default: 3.0,
      min: [1, "Rating must be at least 1.0"],
      max: [5, "Rating must not exceed 5.0"],
    },

    stock: {
      type: Number,
      default: 1,
      min: [0, "Stock cannot be negative"],
    },

    postedDate: {
      type: Date,
      default: Date.now,
    },

    premiumProducts: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


productSchema.virtual("daysPosted").get(function () {
  if (!this.postedDate) return null;
  const today = new Date();
  const posted = new Date(this.postedDate);
  const diffTime = Math.abs(today - posted);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});


productSchema.pre("save", function (next) {
  this.productSlug = slugify(this.name, { lower: false }).toUpperCase();
  next();
});

productSchema.post("save", function (doc) {
  console.log(`Document saved! productSlug: ${doc.productSlug}`);
});


productSchema.pre(/^find/, function (next) {
  this.find({ premiumProducts: { $ne: true } });
  this.start = Date.now();
  next();
});

productSchema.post(/^find/, function (docs) {
  console.log(
    `Query finished in ${Date.now() - this.start} milliseconds. Found ${
      Array.isArray(docs) ? docs.length : 1
    } document(s).`
  );
});

productSchema.pre("aggregate", function () {
  this.pipeline().unshift({
    $match: { premiumProducts: { $ne: true } },
  });
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;