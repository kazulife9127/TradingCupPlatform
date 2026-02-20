export type CupStatus = "draft" | "upcoming" | "active" | "finished";

export type ParticipantStatus =
  | "registered"
  | "active"
  | "disqualified_deposit"
  | "disqualified_volume";

export interface SIWESession {
  address: string;
  chainId: number;
}
