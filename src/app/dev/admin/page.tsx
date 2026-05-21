import { permanentRedirect } from 'next/navigation';

export default function DevAdminPage() {
  permanentRedirect('/admin');
}
