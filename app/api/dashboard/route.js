import { DbCon } from "@/lib/dbCon";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";

await DbCon();

export async function POST(request) {
    const userId= await getDataFromToken(request);
    const user = await User.findOne({_id: userId}).select("-password");

    // check if there is no user 
    return NextResponse.json({
        message: "User found",
        data: user
    })
}