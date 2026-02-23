import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { stripePromise } from "../../../utils/stripe";
// import { stripePromise } from "../../utils/stripe";

const CheckoutForm = () => {
  const { id } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/appointment/${id}`);

        const foundData = await res.json();

        if (!res.ok) {
          throw new Error(foundData.message);
        }

        setAppointment(foundData);
      } catch (error) {
        Swal.fire("Error!", error.message, "error");
      }
    };

    fetchAppointments();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      Swal.fire("Payment Failed", error.message, "error");
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      console.log(appointment);
      // 🔥 Store payment in DB
      await fetch("http://localhost:5000/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointment._id,
          paymentIntentId: paymentIntent.id,
          customerName: appointment.name,
          customerEmail: appointment.email,
        }),
      });

      Swal.fire(
        "Payment Successful 🎉",
        `Transaction ID: ${paymentIntent.id}`,
        "success",
      ).then(() => {
        navigate("/dashboard/my-appointments");
      });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        disabled={!stripe || loading}
        className="btn w-full btn-info font-bold text-lg hover:bg-gradient-to-r from-info to-accent border-0"
      >
        {loading ? "Processing..." : `Pay Now $${appointment.price}`}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { id } = useParams();
  const [checkoutAppointment, setCheckoutAppointment] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 1️⃣ Get appointment
  useEffect(() => {
    fetch(`http://localhost:5000/appointment/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCheckoutAppointment(data);
        setLoading(false);
      });
  }, [id]);

  // 🔹 2️⃣ Create PaymentIntent
  useEffect(() => {
    if (!checkoutAppointment) return;

    fetch("http://localhost:5000/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceId: checkoutAppointment.serviceId,
        customerName: checkoutAppointment.name,
        customerEmail: checkoutAppointment.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      });
  }, [checkoutAppointment]);

  if (loading || !clientSecret)
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-bars loading-xl text-lime-400"></span>
      </div>
    );

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">
        Pay: ${checkoutAppointment.price}
      </h2>

      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm appointment={checkoutAppointment} />
      </Elements>
    </div>
  );
};

export default Checkout;
