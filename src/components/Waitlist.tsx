import { WaitlistBoundary } from './WaitlistBoundary';
import { WaitlistSurface } from './WaitlistSurface';

/** Waitlist + Clerk, loaded as its own chunk. */
export default function Waitlist() {
  return (
    <WaitlistBoundary>
      <WaitlistSurface />
    </WaitlistBoundary>
  );
}
