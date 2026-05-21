import { permanentRedirect } from 'next/navigation';

export default function DevIndexPage() {
  permanentRedirect('/parent');
}
