/**
 * Thin typed wrapper around the web Contact Picker API.
 * https://developer.mozilla.org/en-US/docs/Web/API/Contact_Picker_API
 *
 * Browser support is narrow: Android Chrome / Edge 80+ over HTTPS only.
 * Use `isContactsSupported()` before calling `pickContacts()`.
 */

export interface PickedContact {
  name: string;
  tel: string;
}

interface ContactsManagerLike {
  select: (
    properties: ('name' | 'tel' | 'email')[],
    options?: { multiple?: boolean },
  ) => Promise<Array<{ name?: string[]; tel?: string[]; email?: string[] }>>;
}

export function isContactsSupported(): boolean {
  // Two checks: the navigator.contacts object AND the ContactsManager global.
  // Some browsers expose a stub for one but not the other.
  // The cast is safe — we're just feature-detecting.
  const nav = navigator as Navigator & { contacts?: ContactsManagerLike };
  return Boolean(nav.contacts && (window as unknown as { ContactsManager?: unknown }).ContactsManager);
}

export async function pickContacts(): Promise<PickedContact[]> {
  const nav = navigator as Navigator & { contacts?: ContactsManagerLike };
  if (!nav.contacts) throw new Error('Contact Picker API not available');
  const raw = await nav.contacts.select(['name', 'tel'], { multiple: true });
  return raw
    .map((c) => ({
      name: (c.name && c.name[0]) || '',
      tel: (c.tel && c.tel[0]) || '',
    }))
    .filter((c) => c.name || c.tel);
}
