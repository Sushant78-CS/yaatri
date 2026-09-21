import type { AdminUser } from "../types/user";

export const mockUsers: AdminUser[] = [
  {
    userId: "mock-user-001",
    name: "Tenzin Dorjee",
    age: "24",
    profileStatus: "COMPLETE",
  },
  {
    userId: "mock-user-002",
    name: "Nisha Patel",
    age: "21",
    profileStatus: "COMPLETE",
  },
  {
    userId: "mock-user-003",
    name: "Kabir Khan",
    age: "25",
    profileStatus: "COMPLETE",
  },
  {
    userId: "mock-user-004",
    name: "Meera Iyer",
    age: null,
    profileStatus: "INCOMPLETE",
  },
  {
    userId: "mock-user-005",
    name: "Aarav Sharma",
    age: "22",
    profileStatus: "COMPLETE",
  },
];
