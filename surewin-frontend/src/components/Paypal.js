import axios from "axios";
import React from "react";

export default function Paypal({ amount, tenant_id, invoice_id }) {
  const paypal = React.useRef(null);

  let myButton = window.paypal.Buttons({
    createOrder: (data, actions, err) => {
      return actions.order.create({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: "Cool looking table",
            amount: {
              currency_code: "PHP",
              value: amount,
            },
          },
        ],
      });
    },
    onApprove: async (data, actions) => {
      const order = await actions.order.capture();
      console.log(order);
      const transaction = {
        tenant_id: tenant_id,
        invoice: invoice_id,
        amount: amount,
        payment_method: "Online",
      };
      axios
        .post("http://localhost:5000/api/transactions/add", transaction, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            console.log(res.data);
            return;
          }
        })
        .catch((error) => {
          if (error.response?.data?.success === false) {
            return;
          }

          return;
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });
  React.useEffect(() => {
    if (paypal.current !== null) {
      myButton.render(paypal.current);
      paypal.current = null;
    }
  });
  return (
    <div style={{ margin: "auto", width: "100%" }}>
      <div ref={paypal} style={{ marginTop: "30px" }}></div>
    </div>
  );
}
