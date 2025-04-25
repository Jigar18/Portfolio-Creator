import { getAccessToken } from "@/lib/accessToken";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const accessToken = await getAccessToken(req);
         
        const userEmailsResponse = await axios.get(
            'https://api.github.com/user/emails',
            {
              headers: {
                Authorization: `token ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
              },
            }
        );

        interface GithubEmail {
            email: string;
            primary: boolean;
            verified: boolean;
            visibility: string | null;
        }
        
        const primaryEmail = userEmailsResponse.data.find((emailObj: GithubEmail) => emailObj.primary)?.email;
        
        return NextResponse.json({ email: primaryEmail });
    }
    catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
}