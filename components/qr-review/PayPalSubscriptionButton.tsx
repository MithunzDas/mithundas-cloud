"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react";

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: {
        style?: {
          shape?: "pill" | "rect";
          color?: "gold" | "blue" | "silver" | "white" | "black";
          layout?: "vertical" | "horizontal";
          label?: "subscribe" | "pay" | "checkout";
        };
        createSubscription: (
          data: Record<string, unknown>,
          actions: {
            subscription: {
              create: (options: { plan_id: string; custom_id?: string }) => Promise<string>;
            };
          }
        ) => Promise<string>;
        onApprove: (
          data: { subscriptionID: string },
          actions: Record<string, unknown>
        ) => Promise<void> | void;
        onError?: (err: unknown) => void;
      }) => {
        render: (element: HTMLElement | string) => Promise<void>;
      };
    };
  }
}

interface PayPalSubscriptionButtonProps {
  planId?: string;
  clientId?: string;
  businessSlug?: string;
  onSuccess?: (subscriptionId: string) => void;
}

export default function PayPalSubscriptionButton({
  planId = "P-1C0909029J424933WNKSC7RI",
  clientId = "BAAmpQfRc8Hu8Jwp8Knydw-h8f-ve-oVsJzLweqhfBNgG4eFSro1IckOpQEM87jn7NKR_U1fG7imRbXM0g",
  businessSlug,
  onSuccess
}: PayPalSubscriptionButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const directCheckoutUrl = `https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=${planId}${businessSlug ? `&custom_id=${encodeURIComponent(businessSlug)}` : ""}`;

  useEffect(() => {
    let isMounted = true;

    const loadPayPalScript = () => {
      const existingScript = document.getElementById("paypal-sdk-subscription");
      if (existingScript && window.paypal) {
        initPayPalButtons();
        return;
      }

      if (existingScript && !window.paypal) {
        existingScript.addEventListener("load", initPayPalButtons);
        return;
      }

      const script = document.createElement("script");
      script.id = "paypal-sdk-subscription";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;
      script.setAttribute("data-sdk-integration-source", "button-factory");
      script.async = true;
      script.onload = () => {
        if (isMounted) initPayPalButtons();
      };
      script.onerror = () => {
        if (isMounted) {
          setIsLoading(false);
          setErrorMsg("Could not load PayPal SDK. You can use direct link below.");
        }
      };
      document.body.appendChild(script);
    };

    const initPayPalButtons = () => {
      if (!window.paypal || !containerRef.current) return;

      // Clear any existing buttons inside container
      containerRef.current.innerHTML = "";

      try {
        window.paypal
          .Buttons({
            style: {
              shape: "pill",
              color: "gold",
              layout: "vertical",
              label: "subscribe"
            },
            createSubscription: function (data, actions) {
              return actions.subscription.create({
                plan_id: planId,
                custom_id: businessSlug || undefined
              });
            },
            onApprove: function (data) {
              if (isMounted) {
                setIsSuccess(true);
                setSubscriptionId(data.subscriptionID);
                if (onSuccess) onSuccess(data.subscriptionID);
              }
            },
            onError: function (err) {
              console.error("PayPal button error:", err);
            }
          })
          .render(containerRef.current)
          .then(() => {
            if (isMounted) setIsLoading(false);
          })
          .catch(() => {
            if (isMounted) setIsLoading(false);
          });
      } catch {
        if (isMounted) setIsLoading(false);
      }
    };

    loadPayPalScript();

    return () => {
      isMounted = false;
    };
  }, [planId, clientId, businessSlug, onSuccess]);

  if (isSuccess) {
    return (
      <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-in fade-in duration-300">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white">Subscription Active!</h4>
        <p className="text-xs text-slate-300">
          Your PayPal subscription ({subscriptionId}) has been successfully activated.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {isLoading && (
        <div className="flex items-center justify-center py-4 text-xs text-slate-400 gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          <span>Loading secure PayPal subscription buttons...</span>
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-amber-400 text-center">{errorMsg}</p>
      )}

      {/* Render Target Container */}
      <div ref={containerRef} className="w-full min-h-[90px]" />

      {/* Fallback Direct Link in case of Ad-blocker or iframe restriction */}
      <div className="text-center pt-1">
        <a
          href={directCheckoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-slate-400 hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
        >
          <span>Having trouble? Open PayPal in a new tab</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
