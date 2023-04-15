import {ClerkProvider} from "@clerk/nextjs";
import type {AppProps} from "next/app";

import {api} from "~/utils/api";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ClerkProvider {...pageProps}>
            <Head>
                <title>Chirp</title>
                <meta name="description" content="🤔" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Toaster/>
            <Component {...pageProps} />
        </ClerkProvider>
    );
}
export default api.withTRPC(MyApp);
