import Profile from "@/components/forms/Profile";
import { getUserbyId } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";

const EditProfile = async () => {
  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserbyId({ userId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 ">Edit Profile</h1>

      <div className="mt-9">
        <Profile
          clerkId={userId}
          user={JSON.stringify(mongoUser)} // ? <- Pass in this way (with stringify) because Profile is a client component and it not accept complex object from MongoDB
        />
      </div>
    </>
  );
};
export default EditProfile;
