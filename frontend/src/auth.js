import { getAuth } from "firebase/auth";

export const getAuthToken = async () => {
  const auth = getAuth();
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken();
  }
  return null;
};