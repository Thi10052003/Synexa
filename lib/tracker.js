export async function trackEvent(eventName, payload = {}) {
  try {
    const sessionId = sessionStorage.getItem("session_id");

    const body = {
      event_name: eventName,
      payload: {
        session_id: sessionId,
        ...payload,
      },
      timestamp: new Date().toISOString(),
    };

    await fetch("/api/events", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

  } catch (error) {
    console.error("trackEvent error:", error);
  }
}

// Shorthand
export const trackProductClick = (payload) =>
  trackEvent("product_click", payload);

export const trackProductView = (payload) =>
  trackEvent("product_view", payload);

export const trackAddToCart = (payload) =>
  trackEvent("add_to_cart", payload);

export const trackRemoveFromCart = (payload) =>
  trackEvent("remove_from_cart", payload);

export const trackCartView = (payload) =>
  trackEvent("cart_view", payload);

export const trackCheckoutStart = (payload) =>
  trackEvent("checkout_start", payload);

export const trackPurchase = (payload) =>
  trackEvent("purchase", payload);
