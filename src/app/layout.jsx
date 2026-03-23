import './globals.css';

export const metadata = {
  title: 'Animated Authentication',
  description: 'Login, Signup, OTP Verification app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
