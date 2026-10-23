import type { Registration } from './model';

export type RegistrationStatus = 'draft' | 'confirmed' | 'cancelled';

export interface RegistrationDetails extends Registration {
  comment?: string;
  status: RegistrationStatus;
}

export type RegistrationDraft = Omit<RegistrationDetails, 'id'>;
export type RegistrationPreview = Pick<RegistrationDetails, 'name' | 'status'>;
export type RegistrationPatch = Partial<
  Pick<RegistrationDetails, 'comment' | 'status'>
>;

export function createRegistrationDetails(
  draft: RegistrationDraft,
): RegistrationDetails {
  return { id: crypto.randomUUID(), ...draft };
}

export function previewRegistration(
  registration: Readonly<RegistrationDetails>,
): RegistrationPreview {
  return { name: registration.name, status: registration.status };
}

export function patchRegistrationDetails(
  registration: Readonly<RegistrationDetails>,
  patch: RegistrationPatch,
): RegistrationDetails {
  return { ...registration, ...patch };
}
