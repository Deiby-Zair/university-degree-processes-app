export type userOption = "admin" | "directive" | "teacher" | "student";

export const allowedToPrograms: userOption[] = ["admin"];
export const allowedToUsers: userOption[] = ["admin"];
export const allowedToReviews: userOption[] = ["admin", "directive"];
export const allowedToAssignments: userOption[] = ["admin", "directive"];
export const allowedToEvaluations: userOption[] = ["admin", "directive", "teacher"];
export const allowedToProcesses: userOption[] = ["admin", "directive", "teacher", "student"];

