import { permanentRedirect } from 'next/navigation';

export default function DevParentPage() {
  permanentRedirect('/parent');
}
