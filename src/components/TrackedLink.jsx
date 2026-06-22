import { trackEvent } from "../lib/analytics";

export default function TrackedLink({
  eventName,
  analyticsParams,
  includeOutboundUrl = true,
  outboundUrl,
  onClick,
  ...linkProps
}) {
  const handleClick = (event) => {
    try {
      trackEvent(eventName, {
        ...analyticsParams,
        outbound_url: includeOutboundUrl
          ? (outboundUrl ?? linkProps.href)
          : undefined,
      });
    } finally {
      onClick?.(event);
    }
  };

  return <a {...linkProps} onClick={handleClick} />;
}
