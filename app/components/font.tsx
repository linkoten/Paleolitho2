import { Gentium_Book_Plus, Inter, Roboto_Mono } from "next/font/google";


export const inter = Inter({ subsets: ["latin"] });

export const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})

export const gentium_book_plus = Gentium_Book_Plus({
    subsets: ["latin"],
    weight: "400",
    style: "italic"
})