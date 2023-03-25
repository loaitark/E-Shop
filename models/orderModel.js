const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      // type: mongoose.Schema.ObjectId,
      type: mongoose.Schema.ObjectId,

      ref: "User",
      required: [true, "Order must belong to user"],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
    taxPrice: {
      type: Number,
      default: 0,
    },

    shippingPrice: { type: Number, default: 0 },
    totalOrderPrice: { type: Number },
    paymentMethodType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    delivered: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImg email phone",
  }).populate({ path: "cartItems.product", select: "title imageCover" });
  next();
});

module.exports = mongoose.model("Order", orderSchema);
