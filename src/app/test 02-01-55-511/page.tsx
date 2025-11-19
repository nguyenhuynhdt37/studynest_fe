"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: {
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID: string }) => Promise<void>;
      }) => {
        render: (selector: string) => void;
      };
    };
  }
}

export default function PayPalButton() {
  const isRendered = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRendered.current) return;

    const loadPayPal = () => {
      const container = containerRef.current;
      if (!container || isRendered.current) return;

      const renderButtons = () => {
        if (isRendered.current || !window.paypal || !container) return;

        // Xóa nội dung cũ nếu có
        container.innerHTML = "";

        try {
          window.paypal
            .Buttons({
              createOrder: async () => {
                const res = await fetch(
                  "http://127.0.0.1:8000/api/v1/wallets/create",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount_vnd: 200000 }),
                  }
                );
                const data = await res.json();
                return data.order_id;
              },
              onApprove: async (data: { orderID: string }) => {
                const res = await fetch(
                  "http://127.0.0.1:8000/api/v1/wallets/create",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ order_id: data.orderID }),
                  }
                );
                const result = await res.json();
                alert("Thanh toán thành công!");
                console.log(result);
              },
            })
            .render("#paypal-button-container");

          isRendered.current = true;
        } catch (error) {
          console.error("Error rendering PayPal buttons:", error);
        }
      };

      // Nếu PayPal đã sẵn sàng, render ngay
      if (window.paypal) {
        renderButtons();
        return;
      }

      // Kiểm tra xem script đã tồn tại chưa
      let script = document.getElementById("paypal-sdk") as HTMLScriptElement;

      if (!script) {
        script = document.createElement("script");
        script.id = "paypal-sdk";
        script.src =
          "https://www.paypal.com/sdk/js?client-id=AesnZYPFLC3Z8L-l9JNCt2xcG9Qx1NsuYoCudniLe6TpIeDbcfnBXxGa7AvPYu5gXA7xGEvntaLP6WQi&currency=USD";
        script.async = true;
        script.onload = renderButtons;
        document.head.appendChild(script);
      } else {
        // Script đã tồn tại, kiểm tra xem đã load xong chưa
        if (window.paypal) {
          renderButtons();
        } else {
          // Script đang load, đợi onload
          checkIntervalRef.current = setInterval(() => {
            if (window.paypal) {
              if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
              }
              renderButtons();
            }
          }, 100);

          // Timeout sau 10 giây
          setTimeout(() => {
            if (checkIntervalRef.current) {
              clearInterval(checkIntervalRef.current);
              checkIntervalRef.current = null;
            }
          }, 10000);
        }
      }
    };

    // Đợi DOM sẵn sàng
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", loadPayPal);
    } else {
      loadPayPal();
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex justify-center bg-amber-100 items-center h-screen">
      {/* Đây phải là <div>, không được là <button> */}
      <div ref={containerRef} id="paypal-button-container" />
    </div>
  );
}
