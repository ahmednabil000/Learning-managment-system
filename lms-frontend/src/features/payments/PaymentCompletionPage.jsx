import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import PaymentsService from "../../services/PaymentsService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function PaymentCompletionPage() {
  const [searchParams] = useSearchParams();
  const clientSecret = searchParams.get("payment_intent_client_secret");
  const courseId = searchParams.get("courseId");

  const [status, setStatus] = useState(clientSecret ? "loading" : "error");
  const [message, setMessage] = useState(
    clientSecret ? "" : "No payment information found."
  );

  const effectRan = useRef(false);

  useEffect(() => {
    if (!clientSecret || effectRan.current) return;

    // In strict mode, effects run twice. We use this ref to prevent double execution.
    // However, cleanup functions run too, so we need careful handling.
    // For simpler data mutations like this payment confirmation which shouldn't happen twice,
    // a simple ref check works if we set it immediately.
    effectRan.current = true;

    stripePromise.then((stripe) => {
      if (!stripe) return;

      stripe
        .retrievePaymentIntent(clientSecret)
        .then(async ({ paymentIntent }) => {
          switch (paymentIntent.status) {
            case "succeeded":
              setStatus("loading");
              setMessage("Payment succeeded. Enrolling in course...");
              try {
                if (courseId) {
                  await PaymentsService.enrollUserInCourse(courseId);
                  setStatus("success");
                  setMessage("Thank you! You have been successfully enrolled.");
                } else {
                  // If no courseId, we can't enroll, but payment succeeded.
                  // Should potentially log this or show different message.
                  setStatus("success");
                  setMessage("Payment successful.");
                }
              } catch (error) {
                console.error("Enrollment error:", error);
                setStatus("error");
                // Even if payment succeeded, if enrollment fails, we need to show error or handle manual support.
                // For now, let's say "Payment successful but enrollment failed. Please contact support."
                setMessage(
                  "Payment successful but enrollment failed. Please contact support."
                );
              }
              break;
            case "processing":
              setStatus("processing");
              setMessage("Your payment is processing.");
              break;
            case "requires_payment_method":
              setStatus("error");
              setMessage("Your payment was not successful, please try again.");
              break;
            default:
              setStatus("error");
              setMessage("Something went wrong.");
              break;
          }
        });
    });
  }, [clientSecret, courseId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <FaSpinner className="w-16 h-16 text-blue-500 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-800">
              {message || "Verifying Payment..."}
            </h2>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <FaCheckCircle className="w-20 h-20 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Success!</h1>
            <p className="text-gray-600 text-lg">{message}</p>
            <div className="pt-4 space-y-3">
              {courseId ? (
                <Link
                  to={`/courses/${courseId}`}
                  className="w-full inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Go to Course
                </Link>
              ) : (
                <Link
                  to="/"
                  className="w-full inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Go Home
                </Link>
              )}
            </div>
          </div>
        )}

        {status === "processing" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <FaSpinner className="w-20 h-20 text-yellow-500 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Processing...</h1>
            <p className="text-gray-600 text-lg">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <FaTimesCircle className="w-20 h-20 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Something went wrong
            </h1>
            <p className="text-gray-600 text-lg">{message}</p>
            <div className="pt-4">
              <Link
                to={courseId ? `/checkout/${courseId}` : "/courses"}
                className="w-full inline-block bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-900 transition duration-300 shadow-md"
              >
                Try Again
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
