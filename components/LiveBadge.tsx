export default function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white animate-pulse">
      <span className="h-2 w-2 rounded-full bg-white" />
      LIVE
    </span>
  );
}
