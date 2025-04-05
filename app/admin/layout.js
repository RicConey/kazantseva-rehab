import { getServerSession } from "next-auth";
import authConfig from "../api/auth/[...nextauth]/auth.config";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
    const session = await getServerSession(authConfig);

    if (!session) {
        redirect("/auth/signin");
    }

    return <>{children}</>;
}
