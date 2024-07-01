const express = require('express');
const cors = require('cors');
const app = express();
const env = require('dotenv');
env.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PORT = process.env.PORT

app.use(cors({
  origin:["http://localhost:5173"],
  credentials:true
}))


app.get('/config', (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
  });
});

app.use(express.json()); 



app.post('/create-payment-intent', async (req, res) => {
      const { amount } = req.body;
      console.log(amount)


  // Create a PaymentIntent with the amount, currency, and a payment method type.
  //
  // See the documentation [0] for the full list of supported parameters.
  //
  // [0] https://stripe.com/docs/api/payment_intents/create
  let paymentIntent;

  try {
   
      paymentIntent = await stripe.paymentIntents.create({
        currency: 'usd',
        amount: amount,
        automatic_payment_methods: { enabled: true }
      });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});



app.listen(PORT, () =>
  console.log(`Node server listening at http://localhost:${PORT}`)
);