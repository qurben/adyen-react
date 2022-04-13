import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import AdyenCheckout from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";
import { initiateCheckout } from "../../app/paymentSlice";
import { getRedirectUrl } from "../../util/redirect";
import { RootState } from "../../app/store";

export const PaymentContainer = () => {
  const { type } = useParams();

  if (!type) {
    return null;
  }

  return (
    <div id="payment-page">
      <div className="container">
        <Checkout type={type} />
      </div>
    </div>
  );
}

const Checkout: React.FC<{ type: string }> = ({ type }) => {
  const dispatch = useDispatch();
  const payment = useSelector((state: RootState) => state.payment);


  const navigate = useNavigate();

  const paymentContainer = useRef(null);

  useEffect(() => {
    if (type) {
      dispatch(initiateCheckout(type));
    }
  }, [dispatch, type])


  useEffect(() => {
    const { error } = payment

    if (error) {
      navigate(`/status/error?reason=${error}`, { replace: true });
    }
  }, [payment, navigate])


  useEffect(() => {
    const { config, session } = payment;

    if (!session || !paymentContainer.current) {
      // initiateCheckout is not finished yet.
      return;
    }

    const createCheckout = async () => {
      const checkout = await AdyenCheckout({
        ...config,
        session,
        onPaymentCompleted: (response: { resultCode: string }, _component: unknown) =>
          navigate(getRedirectUrl(response.resultCode), { replace: true }),
        onError: (error: { message: string }, _component: unknown) => {
          console.error(error);
          navigate(`/status/error?reason=${error.message}`, { replace: true });
        },
      });

      if (paymentContainer.current) {
        checkout.create(type).mount(paymentContainer.current);
      }
    }

    createCheckout();
  }, [payment, type, navigate])

  return (
    <div className="payment-container">
      <div ref={paymentContainer} className="payment"></div>
    </div>
  );
}
