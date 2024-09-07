// import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { currentUser, redirectToSignIn } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import { useAuth } from "@clerk/clerk-react";

import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();
    // const { user } = useAuth();
  const { userId } = auth();

  if (!user) {
    // return redirectToSignIn();
        redirect("/sign-in");
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};
