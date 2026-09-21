export type UserProfileStatus = "COMPLETE" | "INCOMPLETE";

export type AdminUser = {
  userId: string;
  name: string;
  age: string | number | null;
  profileStatus: UserProfileStatus;
};
