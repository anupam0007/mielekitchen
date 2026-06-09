import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import {
  EMAIL,
  EMAIL_LINK,
  GENERAL_ENQUIRY_LINK,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_TEL_LINK,
} from "@/lib/whatsapp";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Miele — Where Whisk Whips Wonders",
  description:
    "Miele is a cloud kitchen in Bengaluru by chef Anjali V Prasad — browse our showcase menu of cakes, cheesecakes, tarts and bakes, then order directly on WhatsApp.",
};

const SERVICES = [
  "Custom baked goods",
  "Celebration cakes",
  "Hamper boxes",
  "Snack boxes",
  "Micro-catering",
  "Pet cakes & treats",
  "Corporate orders",
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cream font-body text-espresso">
        <Navbar />
        <main className="flex-1">{children}</main>
        <WhatsAppFloatingButton />

        <footer className="border-t border-forest-dark/40 bg-forest text-cream">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
              <Link href="/" className="group inline-flex items-center gap-2.5">
                <span className="flex items-center justify-center p-0.5">
                  <Image src="/logo.png" alt="Miele logo" width={48} height={52} className="h-11 w-auto object-contain" />
                </span>
                <span className="font-display text-xl font-semibold tracking-tight text-cream">Miele</span>
              </Link>
              <p className="text-sm leading-relaxed text-cream/70">
                Where Whisk Whips Wonders — freshly-made cakes and bakes from our cloud kitchen,
                hand-finished in Vasanthnagar, Bengaluru by chef Anjali V Prasad.
              </p>
              <Image
                src="/mascot.jpg"
                alt="Miele's bee mascot"
                width={64}
                height={64}
                className="mt-1 h-16 w-16 object-contain opacity-90"
              />
            </div>

            <div className="flex flex-col gap-2 text-sm text-cream/75">
              <p className="font-display text-base font-semibold text-cream">Find us</p>
              <p className="leading-relaxed">
                #37, 1st Floor, 8th Main Road,
                <br />
                Vasanthnagar, Bengaluru 560052
              </p>
              <a href={PHONE_TEL_LINK} className="inline-flex items-center gap-1.5 transition-colors hover:text-cream">
                {PHONE_DISPLAY}
              </a>
              <a href={EMAIL_LINK} className="inline-flex items-center gap-1.5 transition-colors hover:text-cream">
                {EMAIL}
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-cream"
              >
                {INSTAGRAM_HANDLE}
              </a>
            </div>

            <div className="flex flex-col gap-2 text-sm text-cream/75">
              <p className="font-display text-base font-semibold text-cream">What we make</p>
              <ul className="flex flex-col gap-1.5">
                {SERVICES.map((service) => (
                  <li key={service} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-honey" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 text-sm text-cream/75">
              <p className="font-display text-base font-semibold text-cream">Ready to order?</p>
              <p className="leading-relaxed">
                This is a showcase menu — every order is arranged directly with our kitchen over
                WhatsApp.
              </p>
              <a
                href={GENERAL_ENQUIRY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-honey px-5 py-2.5 font-display text-sm font-semibold text-espresso shadow-warm-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-warm"
              >
                Order on WhatsApp
              </a>
            </div>
          </div>

          <div className="border-t border-cream/10">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-cream/55 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <p>&copy; {new Date().getFullYear()} Miele. Made with honey &amp; patience.</p>
              <p>Bengaluru · Local delivery &amp; pickup, arranged over WhatsApp</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
